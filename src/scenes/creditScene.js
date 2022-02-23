/*global Phaser*/
export default class CreditScene extends Phaser.Scene {
  constructor () {
    super('CreditScene');
  }

  init (data) {
    this.playMusic1 = data.playMusic1;
    // Initialization code goes here
    this.playMusic1 = data.playMusic1;
  }

  preload () {
    // Preload assets
    this.load.image('creditImg', './assets/creditImg.png');
    this.load.image('backText', './assets/backText.png');
    this.load.spritesheet('welcomeButton', './assets/welcomeButton.png', {
      frameHeight: 202,
      frameWidth: 302
    });

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    var img = this.add.image(this.centerX, this.centerY, 'creditImg');
    img.setScale(0.565);

    // create playButton and its pointer functions
    var playButton = this.add.sprite(this.centerX + 255, this.centerY - 170,'welcomeButton', 0).setInteractive().setDisplaySize(275,56);
    var playText = this.add.image(this.centerX + 255, this.centerY - 170, 'playText').setScale(0.4);
    playButton.on("pointerover", function(){
      this.setFrame(1);
    });
    playButton.on("pointerout", function(){
      this.setFrame(0);
    });
    playButton.on("pointerup", function(){
      this.scene.start('WelcomeScenePlayers', { playMusic1: this.playMusic1 });
    }, this );

    // create backButton and its pointer functions
    var backButton = this.add.sprite(this.centerX - 255, this.centerY - 170,'welcomeButton', 0).setInteractive().setDisplaySize(275,56);
    var backText = this.add.image(this.centerX - 255, this.centerY - 169, 'backText').setScale(0.4);
    backButton.on("pointerover", function(){
      this.setFrame(1);
    });
    backButton.on("pointerout", function(){
      this.setFrame(0);
    });
    backButton.on("pointerup", function(){
      this.playMusic1.stop();
      this.scene.start('WelcomeScene');
    }, this );
  }

  update (time, delta) {
    // Update the scene
  }
}
