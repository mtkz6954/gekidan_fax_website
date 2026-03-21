# game1 改善 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** ファニーモンスターラン！のゲームプレイ・見た目・バランス・UI/UXを総合改善する

**Architecture:** 既存の`game1/game1.html`単体ファイルに対して、JavaScript入力ハンドリング・描画ロジック・CSS/HTMLレイアウトを段階的に修正する。フルスクリーン化はCanvasの解像度をビューポートに合わせ動的リサイズする方式。

**Tech Stack:** Pure HTML/CSS/Canvas API (既存構成を維持)

---

## Task 1: バグ修正 — 死亡後のスペース早押しで不正にゲーム再開する問題

**問題:** `gameOver()`で`gameState='dead'`設定後、600ms後にオーバーレイ表示するが、その間にスペースを押すと`keydown`ハンドラが`gameState==='dead'`を検知して`startGame()`を呼んでしまう。

**Files:**
- Modify: `game1/game1.html` (JavaScript部分)

**Step 1: 死亡後の入力無効化フラグを追加**

`gameState`の変数宣言付近に追加:
```javascript
let deadCooldown = false;
```

**Step 2: `gameOver()`でフラグを立てる**

`gameOver()`の先頭で:
```javascript
deadCooldown = true;
```

`setTimeout`のコールバック内でフラグ解除:
```javascript
setTimeout(() => {
  deadCooldown = false;
  // ... 既存のオーバーレイ表示処理
}, 600);
```

**Step 3: `keydown`ハンドラの条件にフラグチェック追加**

```javascript
if (gameState === 'idle' || (gameState === 'dead' && !deadCooldown)) {
  startGame();
}
```

**Step 4: ブラウザで確認**

- ゲームプレイ → 敵に当たる → 即座にスペース連打 → ゲームが再開しないことを確認
- オーバーレイ表示後にスペース → 正常に再開することを確認

**Step 5: Commit**

```bash
git add game1/game1.html
git commit -m "fix: prevent game restart during death cooldown"
```

---

## Task 2: 入力システム改修 — しゃがみ・チャージ・大ジャンプ

**要件:**
- スペースを**離した時**に通常ジャンプ
- スペースを**押し続ける**としゃがみ（プレイヤーの高さが縮む）
- **一定時間押し続ける**（例: 500ms）とチャージ状態（視覚的にわかる演出）
- チャージ状態で**離す**と大ジャンプ

**Files:**
- Modify: `game1/game1.html` (JavaScript部分)

**Step 1: 入力ステート管理の変数を追加**

```javascript
// --- Input state ---
let spacePressed = false;
let spaceDownTime = 0;        // スペース押下開始時刻
const CHARGE_THRESHOLD = 500; // チャージまでのms
let isCharging = false;
let isCrouching = false;

// player追加プロパティ
// player.crouchH = 40;       // しゃがみ時の高さ
// player.superJumpPower = -20; // 大ジャンプ力
```

playerオブジェクトに追加:
```javascript
crouchH: 40,
superJumpPower: -20,
```

**Step 2: keydownをkeydown+keyupに分離**

既存の`keydown`イベントリスナーを置き換え:

```javascript
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    if (gameState === 'idle' || (gameState === 'dead' && !deadCooldown)) {
      startGame();
      return;
    }
    if (gameState === 'playing' && !spacePressed && !player.jumping) {
      spacePressed = true;
      spaceDownTime = performance.now();
      isCrouching = true;
      isCharging = false;
    }
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    if (gameState === 'playing' && spacePressed) {
      const holdDuration = performance.now() - spaceDownTime;
      if (isCharging) {
        // 大ジャンプ
        doSuperJump();
      } else {
        // 通常ジャンプ
        doJump();
      }
      spacePressed = false;
      isCrouching = false;
      isCharging = false;
    }
  }
});
```

**Step 3: update()でチャージ判定**

`update()`のプレイヤー物理演算セクションに追加:

```javascript
// --- Charge detection ---
if (spacePressed && !player.jumping) {
  const holdDuration = performance.now() - spaceDownTime;
  if (holdDuration >= CHARGE_THRESHOLD && !isCharging) {
    isCharging = true;
    // チャージ開始エフェクト
    spawnParticles(player.x + player.w / 2, GROUND_Y, 'rgba(255,217,61,0.8)', 3);
  }
}
```

**Step 4: しゃがみをプレイヤー描画に反映**

`drawPlayer()`で、しゃがみ時にプレイヤーの高さを縮める:

```javascript
const drawH = isCrouching ? p.crouchH : p.normalH;
const drawY = GROUND_Y - drawH;
```

しゃがみ時にヒットボックスも変更（`update()`のpBox生成部分）:

```javascript
const currentH = isCrouching ? player.crouchH : player.normalH;
const pBox = {
  x: p.x, y: p.y - currentH, w: p.w, h: currentH,
};
```

**Step 5: チャージ中のビジュアルエフェクト**

`drawPlayer()`に追加 — チャージ中はプレイヤー周囲に光のパーティクルを出す:

```javascript
if (isCharging) {
  ctx.save();
  const pulse = Math.sin(frameCount * 0.3) * 0.3 + 0.5;
  ctx.globalAlpha = pulse;
  ctx.strokeStyle = '#ffd93d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(p.x + p.w / 2, p.y - drawH / 2, p.w * 0.7, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  // チャージ中パーティクル（毎4フレーム）
  if (frameCount % 4 === 0) {
    spawnParticles(p.x + p.w / 2, GROUND_Y, 'rgba(255,217,61,0.6)', 2);
  }
}
```

**Step 6: doSuperJump関数を追加**

```javascript
function doSuperJump() {
  if (gameState === 'playing' && !player.jumping) {
    player.jumping = true;
    isCrouching = false;
    player.vy = player.superJumpPower;
    spawnParticles(player.x + player.w / 2, GROUND_Y, 'rgba(255,217,61,0.8)', 10);
  }
}
```

**Step 7: モバイルボタン入力も同様に対応**

ジャンプボタンを `touchstart`/`mousedown` で押下開始、`touchend`/`mouseup` で離す方式に変更:

```javascript
function handleMobileDown(e) {
  e.preventDefault();
  if (gameState === 'playing' && !spacePressed && !player.jumping) {
    spacePressed = true;
    spaceDownTime = performance.now();
    isCrouching = true;
    isCharging = false;
  }
}

function handleMobileUp(e) {
  e.preventDefault();
  if (gameState === 'playing' && spacePressed) {
    if (isCharging) {
      doSuperJump();
    } else {
      doJump();
    }
    spacePressed = false;
    isCrouching = false;
    isCharging = false;
  }
}

btnJump.addEventListener('mousedown', handleMobileDown);
btnJump.addEventListener('mouseup', handleMobileUp);
btnJump.addEventListener('touchstart', handleMobileDown);
btnJump.addEventListener('touchend', handleMobileUp);
```

**Step 8: startGame()にリセット追加**

```javascript
spacePressed = false;
isCrouching = false;
isCharging = false;
```

**Step 9: ブラウザで確認**

- スペースを素早く押して離す → 通常ジャンプ
- スペースを押し続ける → しゃがみ（プレイヤーが小さくなる）
- 500ms以上押し続けて光エフェクト確認 → 離すと大ジャンプ
- モバイルボタンでも同様の操作

**Step 10: Commit**

```bash
git add game1/game1.html
git commit -m "feat: add crouch, charge, and super jump mechanics"
```

---

## Task 3: フルスクリーン化 — PC・モバイル対応

**要件:** PC・スマホともに画面全体を使った大画面表示。Canvasをビューポート全体にフィットさせる。

**Files:**
- Modify: `game1/game1.html` (CSS + JavaScript)

**Step 1: CSSをフルスクリーン用に変更**

```css
body {
  background: #1a1a2e;
  font-family: 'Noto Sans JP', sans-serif;
  overflow: hidden;
  height: 100vh;
  height: 100dvh; /* mobile safe area対応 */
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

#game-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  gap: 0;
}

#header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: rgba(26,26,46,0.6);
  backdrop-filter: blur(4px);
}

#canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
  border: none;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  background: #f0f4ff;
}

#controls-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
  padding: 12px;
}

#back-link {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 20;
  /* ... existing styles ... */
}
```

**Step 2: Canvas解像度を動的リサイズ**

JavaScriptに追加:

```javascript
function resizeCanvas() {
  const container = document.getElementById('canvas-container');
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  // W, Hを更新（ゲーム内座標もこれに合わせる）
  // ただし、ゲームロジックは基準解像度(800x300)で動かし、描画時にスケールする方式がベター
}
```

**アプローチ: 基準解像度方式**

ゲームロジックは内部的に800×300で動作させ、描画時にcanvas全体にスケールする:

```javascript
let canvasW, canvasH, scaleX, scaleY, gameScale;

function resizeCanvas() {
  const container = document.getElementById('canvas-container');
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width * devicePixelRatio;
  canvas.height = rect.height * devicePixelRatio;
  canvasW = rect.width;
  canvasH = rect.height;

  // ゲーム座標→canvas座標のスケール（アスペクト比を維持しつつフィット）
  scaleX = canvas.width / W;
  scaleY = canvas.height / H;
  gameScale = Math.min(scaleX, scaleY);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
```

`draw()`の先頭でスケール適用:

```javascript
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  // 全体をスケール＆センタリング
  const offsetX = (canvas.width - W * gameScale) / 2;
  const offsetY = (canvas.height - H * gameScale) / 2;
  ctx.translate(offsetX, offsetY);
  ctx.scale(gameScale, gameScale);

  // ... 既存の描画処理（800x300の座標系で動く） ...

  ctx.restore();

  // スケール外エリアを背景色で塗る
  ctx.fillStyle = '#1a1a2e';
  if (offsetX > 0) {
    ctx.fillRect(0, 0, offsetX, canvas.height);
    ctx.fillRect(canvas.width - offsetX, 0, offsetX, canvas.height);
  }
  if (offsetY > 0) {
    ctx.fillRect(0, 0, canvas.width, offsetY);
    ctx.fillRect(0, canvas.height - offsetY, canvas.width, offsetY);
  }
}
```

**Step 3: max-width制限を削除**

CSSの`#canvas-container`と`#game-wrapper`から`max-width`を削除。

**Step 4: 戻るリンクの配置調整**

```css
#back-link {
  position: absolute;
  bottom: 8px;
  right: 16px;
  z-index: 20;
}
```

**Step 5: ブラウザで確認**

- PCブラウザでウィンドウリサイズ → キャンバスが追従してフル表示
- モバイル表示（DevTools）→ 画面全体に表示
- ゲームプレイが正常に動作するか

**Step 6: Commit**

```bash
git add game1/game1.html
git commit -m "feat: fullscreen canvas with dynamic resize"
```

---

## Task 4: 敵出現頻度を減少

**Files:**
- Modify: `game1/game1.html` (JavaScript)

**Step 1: スポーン間隔を調整**

現在:
```javascript
nextObstacleTimer = 240 + Math.random() * 360 - score * 0.02;
if (nextObstacleTimer < 120) nextObstacleTimer = 120;
```

変更後（基本間隔を大きく、最小間隔も引き上げ）:
```javascript
nextObstacleTimer = 320 + Math.random() * 400 - score * 0.015;
if (nextObstacleTimer < 160) nextObstacleTimer = 160;
```

初期タイマーも調整:
```javascript
nextObstacleTimer = 150;  // 100 → 150
```

**Step 2: ブラウザで確認**

- ゲーム序盤で敵の間隔が以前より広いことを確認
- 高スコアでも詰まりすぎないことを確認

**Step 3: Commit**

```bash
git add game1/game1.html
git commit -m "tweak: reduce enemy spawn frequency for better pacing"
```

---

## Task 5: 右上に太陽アニメーション追加

**Files:**
- Modify: `game1/game1.html` (JavaScript — drawGround内またはdraw内)

**Step 1: 太陽の描画関数を追加**

```javascript
function drawSun() {
  const sunX = W - 80;
  const sunY = 55;
  const baseR = 28;
  const pulse = Math.sin(frameCount * 0.03) * 3;
  const r = baseR + pulse;

  // 光芒（放射状の光線）
  ctx.save();
  ctx.translate(sunX, sunY);
  ctx.rotate(frameCount * 0.005); // ゆっくり回転
  const rayCount = 12;
  for (let i = 0; i < rayCount; i++) {
    const angle = (i / rayCount) * Math.PI * 2;
    const rayLen = r + 12 + Math.sin(frameCount * 0.05 + i) * 5;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * (r + 2), Math.sin(angle) * (r + 2));
    ctx.lineTo(Math.cos(angle) * rayLen, Math.sin(angle) * rayLen);
    ctx.strokeStyle = 'rgba(255,200,50,0.4)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  ctx.restore();

  // グロー
  const glow = ctx.createRadialGradient(sunX, sunY, r * 0.3, sunX, sunY, r * 2);
  glow.addColorStop(0, 'rgba(255,220,80,0.3)');
  glow.addColorStop(1, 'rgba(255,220,80,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, r * 2, 0, Math.PI * 2);
  ctx.fill();

  // 本体（グラデーション）
  const sunGrad = ctx.createRadialGradient(sunX - 5, sunY - 5, r * 0.1, sunX, sunY, r);
  sunGrad.addColorStop(0, '#fff7a0');
  sunGrad.addColorStop(0.5, '#ffd93d');
  sunGrad.addColorStop(1, '#ffb347');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, r, 0, Math.PI * 2);
  ctx.fill();

  // 顔（かわいい）
  ctx.fillStyle = '#e8a020';
  // 目
  ctx.beginPath();
  ctx.arc(sunX - 8, sunY - 4, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(sunX + 8, sunY - 4, 3, 0, Math.PI * 2);
  ctx.fill();
  // 笑い口
  ctx.beginPath();
  ctx.arc(sunX, sunY + 4, 8, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.strokeStyle = '#e8a020';
  ctx.lineWidth = 2;
  ctx.stroke();
}
```

**Step 2: draw()のdrawGround()の後に呼び出し**

```javascript
drawGround();
drawSun();   // ← 追加
drawCacti();
```

**Step 3: ブラウザで確認**

- 右上に太陽が表示され、光線がゆっくり回転、サイズが脈動していることを確認
- 雲やプレイヤーの後ろに表示されること

**Step 4: Commit**

```bash
git add game1/game1.html
git commit -m "feat: add animated sun with face in top-right corner"
```

---

## Task 6: ジャンプ・着地エフェクト追加

**Files:**
- Modify: `game1/game1.html` (JavaScript)

**Step 1: 着地検出を追加**

プレイヤー物理演算部分 (`update()`) で着地時にエフェクトを発生させる:

```javascript
if (p.y >= GROUND_Y) {
  p.y = GROUND_Y;
  p.vy = 0;
  p.jumping = false;
  // 着地エフェクト
  spawnLandingEffect(p.x + p.w / 2, GROUND_Y);
}
```

**Step 2: 着地エフェクト関数**

```javascript
function spawnLandingEffect(x, y) {
  // 土煙パーティクル（左右に広がる）
  for (let i = 0; i < 8; i++) {
    const dir = i < 4 ? -1 : 1;
    particles.push({
      x, y: y - 2,
      vx: dir * (1 + Math.random() * 3),
      vy: -Math.random() * 2 - 0.5,
      life: 20 + Math.random() * 10,
      maxLife: 30,
      size: 4 + Math.random() * 4,
      color: 'rgba(160,137,107,0.6)',
    });
  }
}
```

**Step 3: ジャンプ時のエフェクト強化**

既存の`doJump()`のパーティクルを強化し、上昇感のある演出を追加:

```javascript
function doJump() {
  if (gameState === 'playing' && !player.jumping) {
    player.jumping = true;
    isCrouching = false;
    player.vy = player.jumpPower;
    // ジャンプエフェクト（下方向に散るパーティクル）
    spawnParticles(player.x + player.w / 2, GROUND_Y, 'rgba(107,203,119,0.6)', 8);
  }
}
```

大ジャンプ時はさらに派手に:

```javascript
function doSuperJump() {
  if (gameState === 'playing' && !player.jumping) {
    player.jumping = true;
    isCrouching = false;
    player.vy = player.superJumpPower;
    // 大ジャンプエフェクト（より多い＋黄色）
    spawnParticles(player.x + player.w / 2, GROUND_Y, 'rgba(255,217,61,0.8)', 15);
    spawnParticles(player.x + player.w / 2, GROUND_Y, 'rgba(107,203,119,0.6)', 8);
  }
}
```

**Step 4: ブラウザで確認**

- ジャンプ開始時に緑のパーティクル
- 着地時に左右に散る土煙
- 大ジャンプ時にさらに派手なパーティクル

**Step 5: Commit**

```bash
git add game1/game1.html
git commit -m "feat: add jump and landing particle effects"
```

---

## Task 7: 画像透過について（ユーザー判断が必要）

**背景:**
モンスター画像（`images/ファニーモンスター/IMG_*.PNG`）は白背景で、ゲーム上で白い枠が見える。

**Canvasベースの自動透過処理** — 実装可能だが品質はユーザー判断:

```javascript
function removeWhiteBackground(img) {
  const offscreen = document.createElement('canvas');
  offscreen.width = img.naturalWidth;
  offscreen.height = img.naturalHeight;
  const offCtx = offscreen.getContext('2d');
  offCtx.drawImage(img, 0, 0);
  const data = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
  const d = data.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i+1], b = d[i+2];
    // 白に近いピクセルを透明にする
    if (r > 220 && g > 220 && b > 220) {
      const whiteness = (r + g + b) / (255 * 3);
      d[i+3] = Math.floor((1 - whiteness) * 255); // アルファ値を白さに応じて減少
    }
  }
  offCtx.putImageData(data, 0, 0);
  const processed = new Image();
  processed.src = offscreen.toDataURL();
  return processed;
}
```

これを画像ロード完了時に各画像に適用する。ただし、白い部分がキャラクターの一部（目の白など）だと透明になってしまう可能性がある。

**→ ユーザーに確認:** Canvas上での自動白背景除去を試すか、ユーザー自身で透過PNG画像を用意するか。

---

## Task 8: UI操作ヒントの更新

**Files:**
- Modify: `game1/game1.html` (HTML)

**Step 1: オーバーレイのヒントテキストを新しい操作に合わせて更新**

```html
<div class="overlay-hint">
  PC: スペース短押し → ジャンプ ／ 長押し → しゃがみ ／ 長押しチャージ → 大ジャンプ<br>
  スマホ: ボタンまたは画面タップで同様の操作
</div>
```

**Step 2: モバイルボタンのラベル更新**

```html
<button class="ctrl-btn" id="btn-jump">🎮 押す→しゃがみ ／ 離す→ジャンプ</button>
```

**Step 3: Commit**

```bash
git add game1/game1.html
git commit -m "docs: update control hints for new input mechanics"
```

---

## 実行順序まとめ

| # | タスク | 依存関係 |
|---|--------|---------|
| 1 | バグ修正（死亡後早押し） | なし |
| 2 | 入力システム改修（しゃがみ・チャージ・大ジャンプ） | Task 1のdeadCooldownに依存 |
| 3 | フルスクリーン化 | なし（Task 1,2と並行可能だが、座標系変更があるため後にする） |
| 4 | 敵出現頻度調整 | なし |
| 5 | 太陽アニメーション | なし |
| 6 | ジャンプ・着地エフェクト | Task 2のdoJump/doSuperJumpに依存 |
| 7 | 画像透過 | ユーザー判断待ち |
| 8 | UIヒント更新 | Task 2の操作体系確定後 |

**推奨順:** 1 → 2 → 6 → 3 → 4 → 5 → 8 → 7（ユーザー判断）
