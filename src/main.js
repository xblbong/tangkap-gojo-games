import './style.css';

/* ============================================================
   TANGKAP GOJO GAMES - Main Game File
   Multi-scene Phaser 3 Game dengan UI Premium & Audio Support
   ============================================================ */

const GAME_WIDTH  = 480;
const GAME_HEIGHT = 640;
const BASE_SPEED  = 220;

/* ──────────────────────────────────────────
   SCENE 1: PreloadScene - Loading Bar
   ────────────────────────────────────────── */
class PreloadScene extends Phaser.Scene {
  constructor() {
    super('scene-preload');
  }

  preload() {
    // ── Background & Karakter ──
    this.load.image('bg',      '/assets/bg.png');
    this.load.image('basket',  '/assets/basket.png');
    this.load.image('gojo',    '/assets/gojo.png');
    this.load.image('apple',   '/assets/apple.png');
    this.load.image('money',   '/assets/money.png');   // fix: was "mone.png"
    this.load.image('logo',    '/assets/logo.png');

    // ── Audio ──
    this.load.audio('coin',    '/assets/coin.mp3');
    this.load.audio('bgMusic', '/assets/bgMusic.mp3');

    // ── Loading UI ──
    const cx = GAME_WIDTH  / 2;
    const cy = GAME_HEIGHT / 2;

    // Dark overlay
    this.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x020817);

    // Logo text
    this.add.text(cx, cy - 100, '⚡ TANGKAP GOJO ⚡', {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#00d4ff',
      shadow: { color: '#4f8ef7', blur: 20, fill: true }
    }).setOrigin(0.5);

    this.add.text(cx, cy - 60, 'Loading...', {
      fontFamily: 'Rajdhani, sans-serif',
      fontSize: '16px',
      color: '#c8d6ef',
    }).setOrigin(0.5);

    // Progress bar background
    const barBg = this.add.rectangle(cx, cy, 260, 20, 0x0a0f1e);
    barBg.setStrokeStyle(1, 0x4f8ef7);

    // Progress bar fill
    const barFill = this.add.rectangle(cx - 130, cy, 0, 16, 0x00d4ff);
    barFill.setOrigin(0, 0.5);

    // Progress text
    const pctText = this.add.text(cx, cy + 28, '0%', {
      fontFamily: 'Rajdhani, sans-serif',
      fontSize: '14px',
      color: '#4f8ef7',
    }).setOrigin(0.5);

    // Update bar on progress
    this.load.on('progress', (value) => {
      barFill.width = 260 * value;
      pctText.setText(Math.floor(value * 100) + '%');
    });
  }

  create() {
    this.scene.start('scene-menu');
  }
}

/* ──────────────────────────────────────────
   SCENE 2: MenuScene - Start Screen
   ────────────────────────────────────────── */
class MenuScene extends Phaser.Scene {
  constructor() {
    super('scene-menu');
  }

  create() {
    const cx = GAME_WIDTH  / 2;
    const cy = GAME_HEIGHT / 2;

    // ── Background ──
    this.add.image(0, 0, 'bg').setOrigin(0, 0)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    // Dark gradient overlay
    const overlay = this.add.graphics();
    overlay.fillGradientStyle(0x020817, 0x020817, 0x020817, 0x020817, 0.85, 0.85, 0.6, 0.6);
    overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // ── Logo / Title ──
    const titleBg = this.add.graphics();
    titleBg.fillStyle(0x000000, 0.4);
    titleBg.fillRoundedRect(cx - 190, 60, 380, 100, 12);
    titleBg.lineStyle(1.5, 0x00d4ff, 0.5);
    titleBg.strokeRoundedRect(cx - 190, 60, 380, 100, 12);

    this.add.text(cx, 100, '⚡ TANGKAP GOJO ⚡', {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#00d4ff',
      shadow: { color: '#4f8ef7', blur: 25, fill: true, offsetX: 0, offsetY: 0 },
    }).setOrigin(0.5);

    this.add.text(cx, 135, 'JUJUTSU KAISEN FAN GAME', {
      fontFamily: 'Rajdhani, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#9b5de5',
      letterSpacing: 3,
    }).setOrigin(0.5);

    // ── Gojo Character Preview (jatuh animasi) ──
    const gojoPreview = this.add.image(cx, 290, 'gojo')
      .setDisplaySize(160, 200)
      .setAlpha(0.9);

    // Gojo floating animation
    this.tweens.add({
      targets: gojoPreview,
      y: 310,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // ── Instructions Card ──
    const cardX = cx - 160;
    const cardY = 415;
    const cardW = 320;
    const cardH = 110;

    const card = this.add.graphics();
    card.fillStyle(0x0a0f1e, 0.8);
    card.fillRoundedRect(cardX, cardY, cardW, cardH, 10);
    card.lineStyle(1, 0x4f8ef7, 0.4);
    card.strokeRoundedRect(cardX, cardY, cardW, cardH, 10);

    this.add.text(cx, cardY + 18, '📖 CARA BERMAIN', {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '12px',
      color: '#ffd700',
    }).setOrigin(0.5);

    this.add.text(cx, cardY + 44, '← → Keyboard  atau  Sentuh layar', {
      fontFamily: 'Rajdhani, sans-serif',
      fontSize: '14px',
      color: '#c8d6ef',
    }).setOrigin(0.5);

    this.add.text(cx, cardY + 66, 'Tangkap Gojo sebanyak-banyaknya!', {
      fontFamily: 'Rajdhani, sans-serif',
      fontSize: '14px',
      color: '#c8d6ef',
    }).setOrigin(0.5);

    this.add.text(cx, cardY + 88, '⏱ Waktu: 30 detik  |  Skor makin tinggi = semakin cepat!', {
      fontFamily: 'Rajdhani, sans-serif',
      fontSize: '11px',
      color: '#9b5de5',
    }).setOrigin(0.5);

    // ── Play Button ──
    const btnY = 565;
    const btnW = 200;
    const btnH = 52;

    const btnBg = this.add.graphics();
    this._drawBtn(btnBg, cx - btnW/2, btnY - btnH/2, btnW, btnH, false);

    const btnText = this.add.text(cx, btnY, '▶  MULAI GAME', {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#020817',
    }).setOrigin(0.5);

    // Interactive play button zone
    const btnZone = this.add.zone(cx, btnY, btnW, btnH).setInteractive({ useHandCursor: true });

    const startGameFade = () => {
      this.cameras.main.fadeOut(400, 2, 8, 23);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('scene-game');
      });
    };

    btnZone.on('pointerover', () => {
      this._drawBtn(btnBg, cx - btnW/2, btnY - btnH/2, btnW, btnH, true);
      btnText.setScale(1.06);
    });
    btnZone.on('pointerout', () => {
      this._drawBtn(btnBg, cx - btnW/2, btnY - btnH/2, btnW, btnH, false);
      btnText.setScale(1);
    });
    btnZone.on('pointerdown', startGameFade);

    // Keyboard shortcut: Enter/Space to start
    const keys = this.input.keyboard.addKeys({ enter: Phaser.Input.Keyboard.KeyCodes.ENTER, space: Phaser.Input.Keyboard.KeyCodes.SPACE });
    keys.enter.once('down', startGameFade);
    keys.space.once('down', startGameFade);

    // ── Fade In ──
    this.cameras.main.fadeIn(600, 2, 8, 23);
  }

  _drawBtn(gfx, x, y, w, h, hovered) {
    gfx.clear();
    if (hovered) {
      gfx.fillGradientStyle(0x00d4ff, 0x00d4ff, 0x4f8ef7, 0x4f8ef7, 1);
    } else {
      gfx.fillGradientStyle(0x4f8ef7, 0x4f8ef7, 0x00d4ff, 0x00d4ff, 1);
    }
    gfx.fillRoundedRect(x, y, w, h, 8);
    gfx.lineStyle(2, hovered ? 0xffffff : 0x00d4ff, 0.6);
    gfx.strokeRoundedRect(x, y, w, h, 8);
  }
}

/* ──────────────────────────────────────────
   SCENE 3: GameScene - Main Gameplay
   ────────────────────────────────────────── */
class GameScene extends Phaser.Scene {
  constructor() {
    super('scene-game');
    this.player        = null;
    this.target        = null;
    this.cursor        = null;
    this.playerSpeed   = BASE_SPEED + 80;
    this.points        = 0;
    this.remainingTime = 30;
    this.textScore     = null;
    this.textTime      = null;
    this.timedEvent    = null;
    this.coinMusic     = null;
    this.bgMusic       = null;
    this.emitter       = null;
    this.isTouching    = false;
    this.touchX        = 0;
    this.bgMusicStarted = false;
    this.timeLowEffect  = false;
  }

  create() {
    const cx = GAME_WIDTH / 2;

    // ── Audio (Buat di sini, play setelah user interact) ──
    this.coinMusic = this.sound.add('coin', { volume: 0.7 });
    this.bgMusic   = this.sound.add('bgMusic', { loop: true, volume: 0.35 });

    // Play bgMusic saat scene start (user sudah klik tombol Play)
    if (!this.bgMusicStarted) {
      this.bgMusic.play();
      this.bgMusicStarted = true;
    }

    // ── Background ──
    this.add.image(0, 0, 'bg').setOrigin(0, 0)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    // Semi-transparent UI bar top
    const topBar = this.add.graphics();
    topBar.fillStyle(0x020817, 0.7);
    topBar.fillRect(0, 0, GAME_WIDTH, 56);
    topBar.lineStyle(1, 0x4f8ef7, 0.3);
    topBar.strokeRect(0, 0, GAME_WIDTH, 56);

    // ── Player (Keranjang) ──
    this.player = this.physics.add.image(
      cx - 40, GAME_HEIGHT - 90, 'basket'
    ).setOrigin(0, 0);

    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    this.player.setDisplaySize(100, 70);
    this.player.setSize(
      this.player.displayWidth  * 0.75,
      this.player.displayHeight * 0.5
    ).setOffset(
      this.player.displayWidth  * 0.12,
      this.player.displayHeight * 0.4
    );

    // ── Target (Gojo jatuh) ──
    this.target = this.physics.add.image(
      this.getRandomX(), -60, 'gojo'
    ).setOrigin(0, 0);

    this.target.setDisplaySize(60, 75);
    this.target.setMaxVelocity(0, BASE_SPEED * 1.5);
    this.target.body.setGravityY(BASE_SPEED);

    // ── Overlap Detection ──
    this.physics.add.overlap(this.player, this.target, this.targetHit, null, this);

    // ── Particles (Money burst) ──
    this.emitter = this.add.particles(0, 0, 'money', {
      speed:    { min: 80, max: 180 },
      angle:    { min: 230, max: 310 },
      scale:    { start: 0.06, end: 0.02 },
      alpha:    { start: 1, end: 0 },
      lifespan: 600,
      gravityY: 200,
      quantity: 6,
      duration: 150,
      emitting: false,
    });
    this.emitter.startFollow(
      this.player,
      this.player.displayWidth / 2,
      0,
      true
    );

    // ── Keyboard ──
    this.cursor = this.input.keyboard.createCursorKeys();

    // ── Touch / Mouse Controls ──
    this.input.on('pointerdown', (ptr) => {
      this.isTouching = true;
      this.touchX     = ptr.x;
    });
    this.input.on('pointermove', (ptr) => {
      if (this.isTouching) this.touchX = ptr.x;
    });
    this.input.on('pointerup', () => {
      this.isTouching = false;
    });

    // ── HUD: Score ──
    this.textScore = this.add.text(GAME_WIDTH - 14, 14, 'SKOR: 0', {
      fontFamily: 'Orbitron, sans-serif',
      fontSize:   '16px',
      fontStyle:  'bold',
      color:      '#ffd700',
      shadow:     { color: '#ffd700', blur: 10, fill: true },
    }).setOrigin(1, 0).setDepth(10);

    // ── HUD: Timer ──
    this.textTime = this.add.text(14, 14, '⏱ 30s', {
      fontFamily: 'Orbitron, sans-serif',
      fontSize:   '16px',
      fontStyle:  'bold',
      color:      '#00d4ff',
      shadow:     { color: '#00d4ff', blur: 10, fill: true },
    }).setOrigin(0, 0).setDepth(10);

    // ── HUD: controls hint ──
    this.add.text(cx, 40, '← Geser → | Sentuh layar', {
      fontFamily: 'Rajdhani, sans-serif',
      fontSize:   '12px',
      color:      'rgba(200,214,239,0.5)',
    }).setOrigin(0.5, 0).setDepth(10);

    // ── Game Timer: 30 detik ──
    this.timedEvent = this.time.delayedCall(30000, this.gameOver, [], this);

    // ── Camera Fade In ──
    this.cameras.main.fadeIn(500, 2, 8, 23);
  }

  // ── Helper: Random X for falling item ──
  getRandomX() {
    return Phaser.Math.Between(10, GAME_WIDTH - 70);
  }

  // ── Called when player catches target ──
  targetHit() {
    // Sound effect
    this.coinMusic.play();

    // Particle burst
    this.emitter.start();

    // Score
    this.points++;
    this.textScore.setText('SKOR: ' + this.points);

    // Score flash animation
    this.tweens.add({
      targets:  this.textScore,
      scaleX:   1.4,
      scaleY:   1.4,
      duration: 100,
      yoyo:     true,
      ease:     'Back.easeOut',
    });

    // Increase speed every 5 points (capped at 2× base)
    const newSpeedY = Math.min(BASE_SPEED + this.points * 12, BASE_SPEED * 2.2);
    this.target.body.setGravityY(newSpeedY);

    // Reset target position
    this.target.setX(this.getRandomX());
    this.target.setY(-60);
    this.target.body.reset(this.target.x, -60);
  }

  // ── Called when timer runs out ──
  gameOver() {
    this.bgMusic.stop();
    this.cameras.main.fadeOut(500, 2, 8, 23);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('scene-gameover', { score: this.points });
    });
  }

  // ── Update loop ──
  update() {
    // Update timer display
    const secLeft = Math.ceil(this.timedEvent.getRemainingSeconds());
    const color   = secLeft <= 10 ? '#e63946' : '#00d4ff';
    this.textTime.setText('⏱ ' + secLeft + 's');
    this.textTime.setColor(color);

    // Pulse when time is low
    if (secLeft <= 10 && !this.timeLowEffect) {
      this.timeLowEffect = true;
      this.tweens.add({
        targets:  this.textTime,
        scaleX:   1.2,
        scaleY:   1.2,
        duration: 400,
        yoyo:     true,
        repeat:   -1,
        ease:     'Sine.easeInOut',
      });
    }

    // Reset target if it falls past screen
    if (this.target.y > GAME_HEIGHT + 20) {
      this.target.setX(this.getRandomX());
      this.target.setY(-60);
      this.target.body.reset(this.target.x, -60);
    }

    // ── Player movement: Keyboard ──
    const { left, right } = this.cursor;
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else if (this.isTouching) {
      // ── Player movement: Touch / Mouse ──
      const playerCenterX = this.player.x + this.player.displayWidth / 2;
      const diff = this.touchX - playerCenterX;
      if (Math.abs(diff) > 6) {
        this.player.setVelocityX(diff > 0 ? this.playerSpeed : -this.playerSpeed);
      } else {
        this.player.setVelocityX(0);
      }
    } else {
      this.player.setVelocityX(0);
    }
  }
}

/* ──────────────────────────────────────────
   SCENE 4: GameOverScene - Result Screen
   ────────────────────────────────────────── */
class GameOverScene extends Phaser.Scene {
  constructor() {
    super('scene-gameover');
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const cx = GAME_WIDTH  / 2;
    const cy = GAME_HEIGHT / 2;

    // ── Background ──
    this.add.image(0, 0, 'bg').setOrigin(0, 0)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    const overlay = this.add.graphics();
    overlay.fillGradientStyle(0x020817, 0x020817, 0x020817, 0x020817, 0.9, 0.9, 0.75, 0.75);
    overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // ── Rank / Result Card ──
    const cardX = cx - 170;
    const cardY = 160;
    const cardW = 340;
    const cardH = 280;

    const card = this.add.graphics();
    card.fillStyle(0x0a0f1e, 0.85);
    card.fillRoundedRect(cardX, cardY, cardW, cardH, 14);
    card.lineStyle(1.5, 0x4f8ef7, 0.5);
    card.strokeRoundedRect(cardX, cardY, cardW, cardH, 14);

    // Title
    this.add.text(cx, cardY + 30, '🏁 GAME SELESAI 🏁', {
      fontFamily: 'Orbitron, sans-serif',
      fontSize:   '18px',
      fontStyle:  'bold',
      color:      '#ffd700',
      shadow:     { color: '#ffd700', blur: 16, fill: true },
    }).setOrigin(0.5);

    // Gojo image
    this.add.image(cx, cardY + 115, 'gojo')
      .setDisplaySize(90, 112)
      .setAlpha(0.85);

    // Score
    this.add.text(cx, cardY + 185, 'SKOR AKHIR', {
      fontFamily: 'Rajdhani, sans-serif',
      fontSize:   '14px',
      color:      '#9b5de5',
      letterSpacing: 3,
    }).setOrigin(0.5);

    const scoreText = this.add.text(cx, cardY + 215, this.finalScore, {
      fontFamily: 'Orbitron, sans-serif',
      fontSize:   '52px',
      fontStyle:  'bold',
      color:      '#00d4ff',
      shadow:     { color: '#00d4ff', blur: 24, fill: true },
    }).setOrigin(0.5);

    // Score count-up animation
    const targetScore = this.finalScore;
    let displayScore  = 0;
    const countUp = this.time.addEvent({
      delay: Math.max(20, Math.floor(1200 / Math.max(targetScore, 1))),
      repeat: targetScore - 1,
      callback: () => {
        displayScore++;
        scoreText.setText(displayScore);
      },
    });

    // Rank badge
    let rank = '🌟 RANK D';
    let rankColor = '#c8d6ef';
    if (targetScore >= 30) { rank = '⚡ RANK SSS'; rankColor = '#ffd700'; }
    else if (targetScore >= 20) { rank = '🔥 RANK SS'; rankColor = '#ff6b35'; }
    else if (targetScore >= 15) { rank = '💎 RANK S'; rankColor = '#00d4ff'; }
    else if (targetScore >= 10) { rank = '🏅 RANK A'; rankColor = '#9b5de5'; }
    else if (targetScore >= 5)  { rank = '⭐ RANK B'; rankColor = '#4f8ef7'; }
    else if (targetScore >= 2)  { rank = '🌟 RANK C'; rankColor = '#c8d6ef'; }

    this.add.text(cx, cardY + 262, rank, {
      fontFamily: 'Orbitron, sans-serif',
      fontSize:   '16px',
      fontStyle:  'bold',
      color:      rankColor,
      shadow:     { color: rankColor, blur: 12, fill: true },
    }).setOrigin(0.5);

    // ── High Score tip ──
    this.add.text(cx, cardY + cardH + 20, targetScore >= 20
      ? '🔥 Luar biasa! Kamu master Tangkap Gojo!'
      : '💪 Coba lagi, raih skor lebih tinggi!', {
      fontFamily: 'Rajdhani, sans-serif',
      fontSize:   '14px',
      color:      'rgba(200,214,239,0.7)',
    }).setOrigin(0.5);

    // ── Buttons Row ──
    const btnY = 560;

    // Main Menu Button
    this._makeBtn(cx - 90, btnY, 160, 46, '🏠 MENU', '#9b5de5', '#4a1f7a', () => {
      this.cameras.main.fadeOut(350, 2, 8, 23);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('scene-menu');
      });
    });

    // Retry Button
    this._makeBtn(cx + 90, btnY, 160, 46, '🔄 MAIN LAGI', '#00d4ff', '#0a3d52', () => {
      this.cameras.main.fadeOut(350, 2, 8, 23);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('scene-game');
      });
    });

    // ── Particle Celebration ──
    this.time.delayedCall(600, () => {
      const celebEmitter = this.add.particles(cx, -20, 'money', {
        speed:    { min: 100, max: 280 },
        angle:    { min: 60, max: 120 },
        scale:    { start: 0.07, end: 0.02 },
        alpha:    { start: 1, end: 0 },
        lifespan: 1800,
        gravityY: 180,
        quantity: 3,
        frequency: 80,
      });
      this.time.delayedCall(2500, () => celebEmitter.stop());
    });

    // ── Camera Fade In ──
    this.cameras.main.fadeIn(500, 2, 8, 23);
  }

  _makeBtn(x, y, w, h, label, colorHex, darkHex, callback) {
    const halfW = w / 2;
    const halfH = h / 2;

    const colorInt = Phaser.Display.Color.HexStringToColor(colorHex).color;
    const darkInt  = Phaser.Display.Color.HexStringToColor(darkHex).color;

    const gfx = this.add.graphics();
    const drawBtn = (hovered) => {
      gfx.clear();
      gfx.fillStyle(hovered ? colorInt : darkInt, 1);
      gfx.fillRoundedRect(x - halfW, y - halfH, w, h, 8);
      gfx.lineStyle(1.5, colorInt, hovered ? 1 : 0.6);
      gfx.strokeRoundedRect(x - halfW, y - halfH, w, h, 8);
    };
    drawBtn(false);

    this.add.text(x, y, label, {
      fontFamily: 'Orbitron, sans-serif',
      fontSize:   '13px',
      fontStyle:  'bold',
      color:      '#ffffff',
    }).setOrigin(0.5).setDepth(5);

    const zone = this.add.zone(x, y, w, h).setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => drawBtn(true));
    zone.on('pointerout',  () => drawBtn(false));
    zone.on('pointerdown', callback);
  }
}

/* ──────────────────────────────────────────
   Phaser Game Config
   ────────────────────────────────────────── */
const config = {
  type:   Phaser.CANVAS,
  width:  GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-main',
  backgroundColor: '#020817',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug:   false,
    }
  },
  scene: [PreloadScene, MenuScene, GameScene, GameOverScene],
  audio: {
    disableWebAudio: false,
  },
  scale: {
    mode:       Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width:      GAME_WIDTH,
    height:     GAME_HEIGHT,
  }
};

const game = new Phaser.Game(config);