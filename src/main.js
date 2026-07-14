import './style.css'
import Phaser from 'phaser';

const sizes = {
  width: 500,
  height: 500,
}

const speedDown = 200;

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.cursor;
    this.playerSpeed = speedDown + 100;
    this.target;
    this.points = 0;
    this.textScore;
    this.textTime;
    this.timedEvent;
    this.remainingTime;
    this.coinMusic;
    this.bgMusic;
    this.emitter;
  }

  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png");
    this.load.image("apple", "/assets/apple.png");
    this.load.image("money", "/assets/mone.png");
    this.load.audio("coin", "/assets/coin.mp3");
    this.load.audio("bgMusic", "/assets/bgMusic.mp3");
  }

  create() {
    this.coinMusic = this.sound.add("coin");
    this.bgMusic = this.sound.add("bgMusic", { loop: true });
    this.bgMusic.play();
    this.bgMusic.stop();

    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.player = this.physics.add.image(0, sizes.height - 100, "basket").setOrigin(0, 0);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    // this.player.setSize(80, 50).setOffset(10, 70);
    this.player.setSize(this.player.width - this.player.width / 4, this.player.height - this.player.height / 10).setOffset(this.player.width / 10, this.player.height / 10);

    this.target = this.physics.add.image(0, 0, "apple").setOrigin(0, 0);
    this.target.setMaxVelocity(0, speedDown);

    this.physics.add.overlap(this.player, this.target, this.targetHit, null, this);

    this.cursor = this.input.keyboard.createCursorKeys();

    this.textScore = this.add.text(
      sizes.width - 120, 10, 'Points: 0', {
      fontSize: '20px',
      fill: '#fff'
    }
    );

    this.textTime = this.add.text(10, 10, 'Time: 00', {
      fontSize: '20px',
      fill: '#fff'
    });

    this.timedEvent = this.time.delayedCall(30000, this.gameOver, [], this);

    this.emitter =  this.add.particles(0,0,"money", {
      speed: 100,
      gravityY: speedDown-200,
      scale: 0.04,
      duration: 100,
      emitting: false,
    })
    this.emitter.startFollow(this.player, this.player.width/2, this.player.height/2, true);
   
  }



  getRandomX() {
    return Math.floor(Math.random() * (sizes.width - 20));
  }

  targetHit() {
    this.emitter.start()
    this.coinMusic.play();
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText('Points: ' + this.points);
    console.log('Points:', this.points);
  }

  gameOver() {
    console.log('Game Over');
    this.scene.restart();
  }

  update() {
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.textTime.setText('Remaining Time: ' + Math.floor(this.remainingTime.toString().split('.')[0]) + 's');
    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
    }

    const { left, right } = this.cursor;
    console.log('Left:', left.isDown, 'Right:', right.isDown, 'Player X:', this.player.x);

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: document.getElementById('gameCanvas'),
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: speedDown },
      debug: true,
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config); 