/*global Phaser*/
var playMusic1;

export default class WelcomeScene extends Phaser.Scene {
  constructor () {
    super('WelcomeScene');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.image('welcomeImg', './assets/welcomeImg.png');
    this.load.spritesheet('welcomeButton', './assets/welcomeButtonNew.png', {
      frameHeight: 86,
      frameWidth: 302
    });
    this.load.image('playText', './assets/testText.png');
    this.load.image('howToPlayText','./assets/howToPlayText.png');
    this.load.image('creditsText', './assets/creditsText.png');
    this.load.audio('music1', './assets/welcomeMusic.mp3');
    this.load.audio('buttonclick', './assets/button1.wav');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    var img = this.add.image(this.centerX, this.centerY, 'welcomeImg');

    playMusic1 = this.sound.add('music1');
    playMusic1.play({volume: 1, loop: true});
    // create playButton and its pointer functions
    var playButton = this.add.sprite(this.centerX, this.centerY - 130,'welcomeButton', 0).setInteractive().setDisplaySize(275,56);
    var playText = this.add.image(this.centerX, this.centerY - 130, 'playText').setScale(0.4);
    playButton.on("pointerover", function(){
      this.setFrame(1);

    });
    playButton.on("pointerout", function(){
      this.setFrame(0);
    });
    playButton.on("pointerup", function(){
      var buttonpress = this.sound.add('buttonclick').play({volume: 1, loop: false});
      this.scene.start('WelcomeScenePlayers', { playMusic1: playMusic1 });
    }, this );

    // create howToPlayButton and its pointer functions
    var howToPlayButton = this.add.sprite(this.centerX, this.centerY - 70,'welcomeButton', 0).setInteractive().setDisplaySize(275,56);
    var howToPlayText = this.add.image(this.centerX, this.centerY - 70, 'howToPlayText').setScale(0.4);
    howToPlayButton.on("pointerover", function(){
      this.setFrame(1);
    });
    howToPlayButton.on("pointerout", function(){
      this.setFrame(0);
    });
    howToPlayButton.on("pointerup", function(){
      playMusic1.stop();
      var buttonpress = this.sound.add('buttonclick').play({volume: 1, loop: false});
      this.scene.start('Play', { gameMode: "tutorial"});
    }, this );

    // create creditsButton and its pointer functions
    var creditsButton = this.add.sprite(this.centerX, this.centerY - 10,'welcomeButton', 0).setInteractive().setDisplaySize(275,56);
    var creditsText = this.add.image(this.centerX, this.centerY - 10, 'creditsText').setScale(0.4);
    creditsButton.on("pointerover", function(){
      this.setFrame(1);
    });
    creditsButton.on("pointerout", function(){
      this.setFrame(0);
    });
    creditsButton.on("pointerup", function(){
      var buttonpress = this.sound.add('buttonclick').play({volume: 1, loop: false});
      this.scene.start('CreditScene', { playMusic1: playMusic1 });
    }, this );

  }

  update (time, delta) {
    // Update the scene
  }
}
