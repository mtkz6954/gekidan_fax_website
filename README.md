# 劇団FAX 公式ウェブサイト

[劇団FAX](mailto:canisendafax@gmail.com)（2016年京都旗揚げ）の公式ウェブサイトです。

## ページ構成

| ファイル | 内容 |
|---|---|
| `index.html` | トップページ（次回公演『キルギスのやつ』） |
| `about.html` | 劇団について |
| `activity.html` | 活動内容・写真ギャラリー |
| `monster-zukan.html` | ファニーモンスター図鑑 |

## 次回公演

**『キルギスのやつ』**
- 会場: 神奈川県立青少年センター スタジオHIKARI（JR桜木町駅 徒歩8分）
- 日程: 7/17(木)19:00 / 7/18(金)12:00・19:00 / 7/19(土)12:00
- チケット: 前売り2,000円 / 当日3,000円

## 技術スタック

- Pure HTML（ビルドツールなし）
- [Tailwind CSS](https://tailwindcss.com)（CDN）
- Google Fonts（Noto Sans JP / Press Start 2P）

## ローカルで開く

ビルド不要。HTMLファイルを直接ブラウザで開くか、簡易サーバーを使います。

```bash
npx serve .
```

## テスト

```bash
npm install

# 構造テスト（HTML・ナビ・画像・モンスターデータ）
npm run test:structural

# E2Eテスト（Playwright）
npm run test:e2e

# 全テスト
npm test
```

## 連絡先

canisendafax@gmail.com
