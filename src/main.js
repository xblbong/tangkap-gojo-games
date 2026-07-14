import './style.css'
import Phaser from 'phaser';

const sizes = {
  width: 500,
  height: 500,
}

const speedDown = 300;

class GameScene extends Phaser.Scene{
  constructor(){
    super("scene-game");
    this.cursor;
    this.playerSpeed = speedDown + 100;
  }

  preload(){
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png");
  }
  create(){
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.player = this.physics.add.image(sizes.width / 2, sizes.height - 80, "basket").setOrigin(0.5, 0.5); // Start in center
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);

    this.physics.world.setBounds(0, 0, sizes.width, sizes.height);
    this.cursor = this.input.keyboard.createCursorKeys();
  }

  update(){
    const { left, right } = this.cursor;
    console.log('Left:', left.isDown, 'Right:', right.isDown, 'Player X:', this.player.x); 

    if(left.isDown){
      this.player.setVelocityX(-this.playerSpeed);
    }else if(right.isDown){
      this.player.setVelocityX(this.playerSpeed);
    }else{
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