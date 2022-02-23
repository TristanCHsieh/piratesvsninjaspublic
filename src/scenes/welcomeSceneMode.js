/*global Phaser*/
export default class WelcomeSceneMode extends Phaser.Scene {
  constructor () {
    super('WelcomeSceneMode');
  }

  init (data) {
    // Initialization code goes here
    this.playerMode = data.playerMode;
    this.playMusic1 = data.playMusic1;
  }

  preload () {
    // Preload assets
    this.load.image('welcomeImgMode', './assets/welcomeImg.png');
    this.load.spritesheet('welcomeButton', './assets/welcomeButtonNew.png', {
      frameHeight: 86,
      frameWidth: 302
    });
    this.load.image('captureTheKingText', './assets/captureTheKingText.png');
    this.load.image('captureTheFlagText', './assets/captureTheFlagText.png');
    this.load.image('battleModeText', './assets/battleModeText.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    var img = this.add.image(this.centerX, this.centerY, 'welcomeImg');

    // create captureTheKingButton and its pointer functions
    var captureTheKingButton = this.add.sprite(this.centerX, this.centerY - 130,'welcomeButton', 0).setInteractive().setDisplaySize(275,56);
    var captureTheKingText = this.add.image(this.centerX, this.centerY - 130, 'captureTheKingText').setScale(0.3);
    captureTheKingButton.on("pointerover", function(){
      this.setFrame(1);
    });
    captureTheKingButton.on("pointerout", function(){
      this.setFrame(0);
    });
    captureTheKingButton.on("pointerup", function(){
      var buttonpress = this.sound.add('buttonclick').play({volume: 1, loop: false});
      this.scene.start('WelcomeSceneDifficulty', { gameMode: "king", playerMode: this.playerMode, playMusic1: this.playMusic1 });
    }, this );

    // create captureTheFlagButton and its pointer functions
    var captureTheFlagButton = this.add.sprite(this.centerX, this.centerY - 70,'welcomeButton', 0).setInteractive().setDisplaySize(275,56);
    var captureTheFlagText = this.add.image(this.centerX, this.centerY - 70, 'captureTheFlagText').setScale(0.3);
    captureTheFlagButton.on("pointerover", function(){
      this.setFrame(1);
    });
    captureTheFlagButton.on("pointerout", function(){
      this.setFrame(0);
    });
    captureTheFlagButton.on("pointerup", function(){
      var buttonpress = this.sound.add('buttonclick').play({volume: 1, loop: false});

      this.scene.start('WelcomeSceneDifficulty', { gameMode: "flag", playerMode: this.playerMode, playMusic1: this.playMusic1 });
    }, this );

    // create battleModeButton and its pointer functions
    var battleModeButton = this.add.sprite(this.centerX, this.centerY - 10,'welcomeButton', 0).setInteractive().setDisplaySize(275,56);
    var battleModeText = this.add.image(this.centerX, this.centerY - 10, 'battleModeText').setScale(0.3);
    battleModeButton.on("pointerover", function(){
      this.setFrame(1);
    });
    battleModeButton.on("pointerout", function(){
      this.setFrame(0);
    });
    battleModeButton.on("pointerup", function(){
      var buttonpress = this.sound.add('buttonclick').play({volume: 1, loop: false});
      this.scene.start('WelcomeSceneDifficulty', { gameMode: "battle", playerMode: this.playerMode, playMusic1: this.playMusic1 });
    }, this );

  }

  update (time, delta) {
    // Update the scene
  }
}
