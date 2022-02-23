/*global Phaser*/
export default class WelcomeScenePlayers extends Phaser.Scene {
  constructor () {
    super('WelcomeScenePlayers');
  }

  init (data) {
    // Initialization code goes here
    this.playMusic1 = data.playMusic1;
  }

  preload () {
    // Preload assets
    this.load.image('welcomeImg', './assets/welcomeImg.png');
    this.load.spritesheet('welcomeButton', './assets/welcomeButtonNew.png', {
      frameHeight: 86,
      frameWidth: 302
    });
    this.load.image('singlePlayerText', './assets/singlePlayerText.png');
    this.load.image('multiPlayerText', './assets/multiPlayerText.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    var img = this.add.image(this.centerX, this.centerY, 'welcomeImg');

    // create singlePlayerButton and its pointer functions
    var singlePlayerButton = this.add.sprite(this.centerX, this.centerY - 130,'welcomeButton', 0).setInteractive().setDisplaySize(275,56);
    var singlePlayerText = this.add.image(this.centerX, this.centerY - 130, 'singlePlayerText').setScale(0.4);
    singlePlayerButton.on("pointerover", function(){
      this.setFrame(1);
    });
    singlePlayerButton.on("pointerout", function(){
      this.setFrame(0);
    });
    singlePlayerButton.on("pointerup", function(){
      var buttonpress = this.sound.add('buttonclick').play({volume: 1, loop: false});
      this.scene.start('WelcomeSceneSide', { playMusic1: this.playMusic1 });
    }, this );

    // create multiPlayerButton and its pointer functions
    var multiPlayerButton = this.add.sprite(this.centerX, this.centerY - 70,'welcomeButton', 0).setInteractive().setDisplaySize(275,56);
    var multiPlayerText = this.add.image(this.centerX, this.centerY - 70, 'multiPlayerText').setScale(0.4);
    multiPlayerButton.on("pointerover", function(){
      this.setFrame(1);
    });
    multiPlayerButton.on("pointerout", function(){
      this.setFrame(0);
    });
    multiPlayerButton.on("pointerup", function(){
      var buttonpress = this.sound.add('buttonclick').play({volume: 1, loop: false});
      this.scene.start('WelcomeSceneMode', { playerMode: 'multi', playMusic1: this.playMusic1 });
    }, this );

  }

  update (time, delta) {
    // Update the scene
  }
}
