import './style.css';
import Phaser from 'phaser';

const GAME_WIDTH  = 480;
const GAME_HEIGHT = 640;
const TARGET_WIN  = 50; 

const COLORS = {
  blue: 0x001D39,
  white: 0xEDF7F6,
  amber: 0xFEA120,
  slate: 0x765CEB,
  red: 0x8D0801,
  green: 0x2ecc71
};

/* ── SCENE 1: LOADING ── */
class PreloadScene extends Phaser.Scene {
  constructor() { super('scene-preload'); }
  preload() {
    this.load.image('pohon', '/assets/pohon.png');
    this.load.image('abil', '/assets/abil.png');
    this.load.image('money', '/assets/money.png');
    this.load.image('love', '/assets/love.png'); 
    this.load.image('gojo', '/assets/gojo.png');
    this.load.image('gojo1', '/assets/gojo1.png');
    this.load.image('gojo2', '/assets/gojo2.png');
    this.load.image('gojo3', '/assets/gojo3.png');
    this.load.audio('coin', '/assets/coin.mp3');
    this.load.audio('bgMusic', '/assets/bgMusic.mp3');

    let cx = GAME_WIDTH/2; let cy = GAME_HEIGHT/2;
    let bar = this.add.rectangle(cx-100, cy, 0, 20, COLORS.amber).setOrigin(0, 0.5);
    this.add.rectangle(cx, cy, 200, 20).setStrokeStyle(2, 0xffffff);
    this.load.on('progress', (v) => { bar.width = 200 * v; });
  }
  create() { this.scene.start('scene-menu'); }
}

/* ── SCENE 2: MENU AWAL ── */
class MenuScene extends Phaser.Scene {
  constructor() { super('scene-menu'); }
  create() {
    const cx = GAME_WIDTH / 2;
    // Background lebih gelap agar teks menonjol
    this.add.image(0,0,'pohon').setOrigin(0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT).setAlpha(0.5);

    // ── JUDUL UTAMA (Dibuat lebih Glow & Berwarna) ──
    let title = this.add.text(cx, 80, 'TANGKAP GOJO', { 
      fontSize: '48px', 
      fontWeight: '900', 
      color: '#FEA120', 
      fontFamily: 'Poppins',
      stroke: '#8fe3ff', // Garis pinggir hitam
      strokeThickness: 8,
      shadow: { offsetX: 0, offsetY: 4, color: '#ffffff', blur: 10, fill: true }
    }).setOrigin(0.5);

    // Animasi judul membesar-mengecil halus
    this.tweens.add({ targets: title, scale: 1.05, duration: 800, yoyo: true, repeat: -1 });

    // ── KARAKTER GOJO ──
    const gojoList = ['gojo', 'gojo1', 'gojo2', 'gojo3'];
    gojoList.forEach((key, index) => {
        let xPos = 75 + (index * 110);
        let g = this.add.image(xPos, 240, key).setDisplaySize(90, 115);
        this.tweens.add({
            targets: g, y: 260, duration: 1000 + (index * 200),
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });
    });

    // ── KOTAK INSTRUKSI (Dibuat lebih Stylish) ──
    let infoBox = this.add.rectangle(cx, 430, 420, 170, 0x000000, 0.7)
        .setStrokeStyle(3, COLORS.amber);

    this.add.text(cx, 375, '📜 MISI KAMU', { 
        fontSize: '22px', fontWeight: '800', color: '#FEA120', fontFamily: 'Poppins' 
    }).setOrigin(0.5);

    // Teks deskripsi dengan highlight pada angka
    this.add.text(cx, 420, 'Tangkap Gojo sebanyak-banyaknya!', { 
        fontSize: '16px', color: '#EDF7F6', fontFamily: 'Poppins' 
    }).setOrigin(0.5);

    // Highlight Target Poin
    this.add.text(cx, 450, `🎯 TARGET: ${TARGET_WIN} POIN`, { 
        fontSize: '20px', fontWeight: '800', color: '#FEA120', fontFamily: 'Poppins',
        stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    // Highlight Durasi
    this.add.text(cx, 485, `⏱️ WAKTU: 30 DETIK`, { 
        fontSize: '18px', fontWeight: '800', color: '#2ecc71', fontFamily: 'Poppins',
        stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    // ── TOMBOL MULAI (Dibuat lebih modern) ──
    let btn = this.add.rectangle(cx, 570, 250, 65, COLORS.red).setInteractive({useHandCursor: true});
    btn.setStrokeStyle(4, COLORS.amber);
    
    let btnTxt = this.add.text(cx, 570, 'MULAI GAME', { 
        fontSize: '26px', fontWeight: '900', color: '#EDF7F6', fontFamily: 'Poppins',
        stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);
    
    // Efek saat tombol disentuh
    btn.on('pointerover', () => { btn.setScale(1.1); btnTxt.setScale(1.1); });
    btn.on('pointerout', () => { btn.setScale(1); btnTxt.setScale(1); });
    
    btn.on('pointerdown', () => this.scene.start('scene-game'));
  }
}

/* ── SCENE 3: GAMEPLAY ── */
class GameScene extends Phaser.Scene {
  constructor() { super('scene-game'); }
  init() {
    this.score = 0; this.timeLeft = 30; this.currentSpeed = 250;
    this.isGameOver = false; this.consecutiveMisses = 0; 
    this.gojoKeys = ['gojo', 'gojo1', 'gojo2', 'gojo3'];
  }
  create() {
    const cx = GAME_WIDTH / 2;
    this.add.image(0,0,'pohon').setOrigin(0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT).setAlpha(0.6);

    this.moneyParticles = this.add.particles(0, 0, 'money', { speed: 150, scale: {start:0.1, end:0}, lifespan: 600, emitting: false }).setDepth(50);
    this.loveParticles = this.add.particles(0, 0, 'love', { speed: 200, scale: {start:0.15, end:0}, lifespan: 800, gravityY: -100, emitting: false, tint: [0xff69b4, 0xff0000] }).setDepth(51);

    this.player = this.physics.add.image(cx, GAME_HEIGHT - 80, 'abil').setDisplaySize(90, 100).setCollideWorldBounds(true).setImmovable(true).setDepth(20);
    this.gojos = this.physics.add.group();
    for (let i = 0; i < 3; i++) { this.spawnGojo(); }

    this.scoreText = this.add.text(20, 20, '⭐ POIN: 0 / ' + TARGET_WIN, { fontSize: '20px', fontWeight: '800', fill: '#EDF7F6', fontFamily: 'Poppins' }).setDepth(100);
    this.timeText = this.add.text(GAME_WIDTH - 20, 22, '⏱️ 30s', { fontSize: '20px', fontWeight: '800', fill: '#2ecc71', fontFamily: 'Poppins' }).setOrigin(1,0).setDepth(100);

    this.missContainer = this.add.container(cx, GAME_HEIGHT/2).setDepth(200).setAlpha(0);
    this.missBg = this.add.rectangle(0, 0, 420, 100, 0x000000, 0.7).setStrokeStyle(3, COLORS.amber);
    this.missText = this.add.text(0, 0, '', { fontSize: '24px', fontWeight: '900', color: '#fff', fontFamily: 'Poppins', align: 'center', wordWrap: {width:380} }).setOrigin(0.5);
    this.missContainer.add([this.missBg, this.missText]);

    this.timerEvent = this.time.addEvent({ delay: 1000, callback: () => {
        this.timeLeft--; this.timeText.setText('⏱️ ' + this.timeLeft + 's');
        if (this.timeLeft <= 10) this.timeText.setFill('#ff0000');
        if(this.timeLeft <= 0) this.gameOver();
    }, loop: true });

    this.physics.add.overlap(this.player, this.gojos, this.catchGojo, null, this);
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  spawnGojo() {
    let gojo = this.gojos.create(Phaser.Math.Between(50, 430), Phaser.Math.Between(-100, -500), Phaser.Math.RND.pick(this.gojoKeys));
    gojo.setDisplaySize(70, 90).setVelocityY(this.currentSpeed).setDepth(10);
  }
  catchGojo(p, gojo) {
    this.score++; this.scoreText.setText(`⭐ POIN: ${this.score} / ${TARGET_WIN}`);
    this.sound.play('coin');
    this.moneyParticles.emitParticleAt(gojo.x, gojo.y, 5);
    this.loveParticles.emitParticleAt(gojo.x, gojo.y, 5);
    if (this.score >= TARGET_WIN) { this.victory(); return; }
    this.consecutiveMisses = 0; this.resetGojo(gojo);
    this.currentSpeed += 8; this.gojos.getChildren().forEach(g => g.setVelocityY(this.currentSpeed));
  }
  resetGojo(gojo) {
    gojo.setPosition(Phaser.Math.Between(50, 430), Phaser.Math.Between(-50, -300));
    gojo.setTexture(Phaser.Math.RND.pick(this.gojoKeys)).setDisplaySize(70, 90);
  }
  update() {
    if(this.isGameOver) return;
    if (this.cursors.left.isDown) this.player.setVelocityX(-450);
    else if (this.cursors.right.isDown) this.player.setVelocityX(450);
    else this.player.setVelocityX(0);
    if (this.input.activePointer.isDown) this.player.x = Phaser.Math.Linear(this.player.x, this.input.activePointer.x, 0.2);
    this.gojos.getChildren().forEach(g => { if (g.y > GAME_HEIGHT) { 
        this.consecutiveMisses++;
        let p = this.consecutiveMisses === 1 ? "TANGKEP KUCUK! 😠" : this.consecutiveMisses === 2 ? "HEI HEI TANGKEP! 😤" : "BAKAAAAA! 💢👺";
        this.missText.setText(p); this.missContainer.setAlpha(1).setScale(0.8);
        this.tweens.add({ targets: this.missContainer, scale: 1, duration: 200, onComplete: () => {
            this.time.delayedCall(1000, () => this.tweens.add({ targets: this.missContainer, alpha: 0, duration: 300 }));
        }});
        this.resetGojo(g); 
    }});
  }
  gameOver() { this.isGameOver = true; this.physics.pause(); this.scene.start('scene-gameover', {score: this.score}); }
  victory() { this.isGameOver = true; this.physics.pause(); this.scene.start('scene-victory', {score: this.score}); }
}

/* ── SCENE 4: VICTORY ── */
class VictoryScene extends Phaser.Scene {
    constructor() { super('scene-victory'); }
    create(data) {
      const cx = GAME_WIDTH/2;
      // BG Pohon
      this.add.image(0,0,'pohon').setOrigin(0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT).setAlpha(0.4);
      this.add.rectangle(0,0, GAME_WIDTH, GAME_HEIGHT, 0x001D39, 0.7).setOrigin(0);

      // Partikel Love (Jumlah dikurangi agar tidak menutupi tulisan)
      this.add.particles(cx, 250, 'love', {
          speed: { min: 100, max: 300 }, scale: { start: 0.15, end: 0 },
          lifespan: 1200, gravityY: 50, quantity: 1, frequency: 100
      });

      this.add.text(cx, 120, 'CONGRATS! 🎉', { fontSize: '48px', fontWeight: '900', color: '#FEA120', fontFamily: 'Poppins', stroke: '#fff', strokeThickness: 3 }).setOrigin(0.5);
      this.add.text(cx, 200, 'MISI BERHASIL!', { fontSize: '20px', color: '#EDF7F6', fontFamily: 'Poppins' }).setOrigin(0.5);
      this.add.text(cx, 260, 'TOTAL POIN: ' + data.score, { fontSize: '35px', fontWeight: '800', color: '#fff', fontFamily: 'Poppins' }).setOrigin(0.5);

      // Tampilkan 4 Gojo berjejer
      ['gojo', 'gojo1', 'gojo2', 'gojo3'].forEach((key, i) => {
          this.add.image(75 + i * 110, 380, key).setDisplaySize(80, 105).setAlpha(0.9);
      });

      let btnRestart = this.add.rectangle(cx, 490, 220, 50, COLORS.amber).setInteractive({useHandCursor:true});
      this.add.text(cx, 490, 'MAIN LAGI', { color: COLORS.blue, fontWeight: '700', fontFamily: 'Poppins' }).setOrigin(0.5);
      let btnMenu = this.add.rectangle(cx, 560, 220, 50, COLORS.slate).setInteractive({useHandCursor:true});
      this.add.text(cx, 560, 'MENU AWAL', { color: '#fff', fontWeight: '700', fontFamily: 'Poppins' }).setOrigin(0.5);

      btnRestart.on('pointerdown', () => this.scene.start('scene-game'));
      btnMenu.on('pointerdown', () => this.scene.start('scene-menu'));
    }
}

/* ── SCENE 5: GAME OVER ── */
class GameOverScene extends Phaser.Scene {
  constructor() { super('scene-gameover'); }
  create(data) {
    const cx = GAME_WIDTH/2;
    // BG Pohon
    this.add.image(0,0,'pohon').setOrigin(0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT).setAlpha(0.4);
    this.add.rectangle(0,0, GAME_WIDTH, GAME_HEIGHT, 0x001D39, 0.8).setOrigin(0);

    this.add.text(cx, 120, 'WAKTU HABIS!', { fontSize: '45px', fontWeight: '800', color: '#8D0801', fontFamily: 'Poppins', stroke: '#fff', strokeThickness: 2 }).setOrigin(0.5);
    this.add.text(cx, 200, `SKOR ANDA: ${data.score} / ${TARGET_WIN}`, { fontSize: '28px', color: '#fff', fontFamily: 'Poppins' }).setOrigin(0.5);

    // Tampilkan 4 Gojo berjejer (di Game Over dibuat agak transparan/sedih)
    ['gojo', 'gojo1', 'gojo2', 'gojo3'].forEach((key, i) => {
        this.add.image(75 + i * 110, 330, key).setDisplaySize(80, 105).setAlpha(0.5);
    });

    let btnRestart = this.add.rectangle(cx, 460, 220, 50, COLORS.amber).setInteractive();
    this.add.text(cx, 460, 'COBA LAGI', { color: COLORS.blue, fontWeight: '700', fontFamily: 'Poppins' }).setOrigin(0.5);
    let btnMenu = this.add.rectangle(cx, 530, 220, 50, COLORS.slate).setInteractive();
    this.add.text(cx, 530, 'MENU AWAL', { color: '#fff', fontWeight: '700', fontFamily: 'Poppins' }).setOrigin(0.5);

    btnRestart.on('pointerdown', () => this.scene.start('scene-game'));
    btnMenu.on('pointerdown', () => this.scene.start('scene-menu'));
  }
}

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH, height: GAME_HEIGHT,
  parent: 'game-container', backgroundColor: '#001D39',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [PreloadScene, MenuScene, GameScene, VictoryScene, GameOverScene]
};
new Phaser.Game(config);