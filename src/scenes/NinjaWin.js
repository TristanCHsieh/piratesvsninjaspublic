/*global Phaser*/
var ninjaWinMusic

export default class NinjaWin extends Phaser.Scene {
  constructor () {
    super('NinjaWin');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.image('PirateWin', './assets/End Screen.jpg');
    this.load.audio('shiverMeTimbers', './assets/shiverMeTimbers.mp3');
    this.load.audio('ninjaWinMusic', './assets/ninjaWinMusic.mp3');
    this.load.spritesheet('welcomeButton', './assets/welcomeButtonNew.png', {
      frameHeight: 86,
      frameWidth: 302
    });
    this.load.image('backToWelcomeScreenText', './assets/backToWelcomeScreenText.png');
    this.load.image('ninja', './assets/ninja4attack2.png')
    this.load.image('flashofBlack', './assets/flashofwhite.png')

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    var logo = this.add.image(this.centerX, this.centerY, 'PirateWin').setScale(1.65);
    var playVoice = this.sound.add('shiverMeTimbers').play({volume: 1, loop: false});
    var ninja = this.add.image(this.centerX-150, this.centerY+160, 'ninja').setScale(1.75);
    var wintext = this.add.text(250, 40, 'Ninjas Win!', { fill: "#800", font: "60px Palatino Linotype" });

    this.tweens.add({
      targets: ninja,
      x:this.centerX-150,
      y:this.centerY+75,
      ease: "circ.easeOut",
      duration: 500,
      delay: 1000,
      yoyo: true,
      repeat: -1
    });

    ninjaWinMusic = this.sound.add('ninjaWinMusic')
    ninjaWinMusic.play({volume: 1, loop: false});

    // create backButton and its pointer functions
    var backButton = this.add.sprite(this.centerX, this.centerY - 140,'welcomeButton', 0).setInteractive().setDisplaySize(600,75);
    var backText = this.add.image(this.centerX, this.centerY - 140, 'backToWelcomeScreenText').setScale(0.4);
    backButton.on("pointerover", function(){
      this.setFrame(1);
    });
    backButton.on("pointerout", function(){
      this.setFrame(0);
    });
    backButton.on("pointerup", function(){
      ninjaWinMusic.stop();
      this.scene.start('WelcomeScene');
    }, this );

    var flashofBlack = this.add.image(this.centerX, this.centerY, 'flashofBlack');

    this.tweens.add({
      targets: flashofBlack,
      alpha: 0,
      ease: "Cubic.easeIn",
      duration: 1000,
    });
  }

  update (time, delta) {
    // Update the scene
  }
}
