"""
ファニーモンスター画像の白背景を透過にするスクリプト
元ファイルは変更せず、別ファイルとして保存する

アルゴリズム:
1. 画像の四隅から白っぽい背景色をサンプリング
2. 背景色に近いピクセルのアルファ値を段階的に下げる
3. エッジ付近はスムーズにブレンド（アンチエイリアス）
"""

from PIL import Image
import numpy as np
import os
import sys

# ゲームで使用する画像ファイル
GAME_IMAGES = [
    "IMG_9335.PNG",  # player
    "IMG_9370.PNG",  # obs1
    "IMG_9362.PNG",  # obs2
    "IMG_9417.PNG",  # obs3
    "IMG_9333.PNG",  # fly1
    "IMG_9421.PNG",  # fly2
    "IMG_9344.PNG",  # collect
    "IMG_9365.PNG",  # elephant
    "IMG_9368.PNG",  # purple
]

def remove_white_background(input_path, output_path, threshold=220, edge_softness=30):
    """
    白背景を透過にする

    threshold: この値以上のRGB全チャンネルを「白」とみなす (0-255)
    edge_softness: エッジのソフトさ（大きいほど滑らか）
    """
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img, dtype=np.float64)

    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

    # 白さの度合いを計算 (0=完全に色付き、1=完全に白)
    # 各チャンネルがthreshold以上かどうかを基準にする
    min_channel = np.minimum(np.minimum(r, g), b)
    max_channel = np.maximum(np.maximum(r, g), b)

    # 彩度が低く、明度が高いピクセルを背景とみなす
    saturation = (max_channel - min_channel) / (max_channel + 1e-10)
    brightness = (r + g + b) / 3.0

    # 白背景スコア: 明るくて彩度が低いほど1に近づく
    white_score = np.clip((brightness - threshold) / edge_softness, 0, 1) * np.clip((1 - saturation * 3), 0, 1)

    # 四隅の平均色をサンプリングして背景色を推定
    corner_size = 5
    corners = [
        data[:corner_size, :corner_size, :3],
        data[:corner_size, -corner_size:, :3],
        data[-corner_size:, :corner_size, :3],
        data[-corner_size:, -corner_size:, :3],
    ]
    bg_color = np.mean(np.concatenate([c.reshape(-1, 3) for c in corners], axis=0), axis=0)

    # 背景色との距離も考慮
    color_dist = np.sqrt(
        (r - bg_color[0])**2 +
        (g - bg_color[1])**2 +
        (b - bg_color[2])**2
    )
    bg_score = np.clip(1 - color_dist / 80, 0, 1)

    # 最終的な透明度 = 白スコアと背景スコアの組み合わせ
    combined_score = np.maximum(white_score, bg_score * 0.8)

    # アルファ値を更新（元のアルファ値を考慮）
    new_alpha = a * (1 - combined_score)

    # 結果を書き戻し
    result = data.copy()
    result[:,:,3] = np.clip(new_alpha, 0, 255).astype(np.uint8)

    # 完全に透明なピクセルは白にする（圧縮効率のため）
    fully_transparent = result[:,:,3] < 5
    result[fully_transparent, 3] = 0

    output_img = Image.fromarray(result.astype(np.uint8))
    output_img.save(output_path, "PNG", optimize=True)

    return output_img.size

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    src_dir = os.path.join(base_dir, "images", "ファニーモンスター")
    out_dir = os.path.join(src_dir, "transparent")

    os.makedirs(out_dir, exist_ok=True)

    print(f"入力ディレクトリ: {src_dir}")
    print(f"出力ディレクトリ: {out_dir}")
    print()

    success = 0
    failed = 0

    for filename in GAME_IMAGES:
        input_path = os.path.join(src_dir, filename)
        # 出力は常にPNG
        output_name = os.path.splitext(filename)[0] + "_transparent.png"
        output_path = os.path.join(out_dir, output_name)

        if not os.path.exists(input_path):
            print(f"  [SKIP] {filename} -- not found")
            failed += 1
            continue

        try:
            size = remove_white_background(input_path, output_path)
            file_size = os.path.getsize(output_path) / 1024
            print(f"  [OK] {filename} -> {output_name} ({size[0]}x{size[1]}, {file_size:.0f}KB)")
            success += 1
        except Exception as e:
            print(f"  [FAIL] {filename} -- error: {e}")
            failed += 1

    print()
    print(f"Done: {success} ok, {failed} failed")
    print(f"Output: {out_dir}")

if __name__ == "__main__":
    main()
