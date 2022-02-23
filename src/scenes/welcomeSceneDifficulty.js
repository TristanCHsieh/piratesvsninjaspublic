/*global Phaser*/
export default class WelcomeSceneDifficulty extends Phaser.Scene {
  constructor () {
    super('WelcomeSceneDifficulty');
  }

  init (data) {
    // Initialization code goes here
    this.mode = data.gameMode;
    this.playerMode = data.playerMode;
    this.playMusic1 = data.playMusic1;
  }

  preload () {
    // Preload assets
    this.load.image('welcomeImg', './assets/welcomeImg.png');
    this.load.spritesheet('welcomeButton', './assets/welcomeButtonNew.png', {
      frameHeight: 86,
      frameWidth: 302
    });
    this.load.image('easyText', './assets/easyText.png');
    this.load.image('mediumText', './assets/mediumText.png');
    this.load.image('hardText', './assets/hardText.png');
    this.load.image('suddenDeathText', './assets/suddenDeathText.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    var img = this.add.image(this.centerX, this.centerY, 'welcomeImg');

    // create easyButton and its pointer functions
    var easyButton = this.add.sprite(this.centerX, this.centerY - 130,'welcomeButton', 0).setInteractive().setDisplaySize(275,56);
    var easyText = this.add.image(this.centerX, this.centerY - 130, 'easyText').setScale(0.4);
    easyButton.on("pointerover", function(){
      this.setFrame(1);
    });
    easyButton.on("pointerout", function(){
      this.setFrame(0);
    });
    easyButton.on("pointerup", function(){
      this.playMusic1.stop();
      var buttonpress = this.sound.add('buttonclick').play({volume: 1, loop: false});
      this.scene.start('Play', { gameMode: this.mode, boardSize: 7, playerMode: this.playerMode });
    }, this );

    // create mediumButton and its pointer functions
    var mediumButton = this.add.sprite(this.centerX, this.centerY - 70,'welcomeButton', 0).setInteractive().setDisplaySize(275,56);
    var mediumText = this.add.image(this.centerX, this.centerY - 70, 'mediumText').setScale(0.4);
    mediumButton.on("pointerover", function(){
      this.setFrame(1);
    });
    mediumButton.on("pointerout", function(){
      this.setFrame(0);
    });
    mediumButton.on("pointerup", function(){
      this.playMusic1.stop();
      var buttonpress = this.sound.add('buttonclick').play({volume: 1, loop: false});
      this.scene.start('Play', { gameMode: this.mode, boardSize: 8, playerMode: this.playerMode });
    }, this );

    // create hardButton and its pointer functions
    var hardButton = this.add.sprite(this.centerX, this.centerY - 10,'welcomeButton', 0).setInteractive().setDisplaySize(275,56);
    var hardText = this.add.image(this.centerX, this.centerY - 10, 'hardText').setScale(0.4);
    hardButton.on("pointerover", function(){
      this.setFrame(1);
    });
    hardButton.on("pointerout", function(){
      this.setFrame(0);
    });
    hardButton.on("pointerup", function(){
      this.playMusic1.stop();
      var buttonpress = this.sound.add('buttonclick').play({volume: 1, loop: false});
      this.scene.start('Play', { gameMode: this.mode, boardSize: 9, playerMode: this.playerMode });
    }, this );

    // create suddenDeathButton and its pointer functions
    var suddenDeathButton = this.add.sprite(this.centerX, this.centerY + 50,'welcomeButton', 0).setInteractive().setDisplaySize(275,56);
    var suddenDeathText = this.add.image(this.centerX, this.centerY + 50, 'suddenDeathText').setScale(0.4);
    suddenDeathButton.on("pointerover", function(){
      this.setFrame(1);
    });
    suddenDeathButton.on("pointerout", function(){
      this.setFrame(0);
    });
    suddenDeathButton.on("pointerup", function(){
      this.playMusic1.stop();
      var buttonpress = this.sound.add('buttonclick').play({volume: 1, loop: false});
      this.scene.start('Play', { gameMode: this.mode, boardSize: 4, playerMode: this.playerMode });
    }, this );

  }

  update (time, delta) {
    // Update the scene
  }
}
