/*global Phaser*/
export default class WelcomeSceneSide extends Phaser.Scene {
  constructor () {
    super('WelcomeSceneSide');
  }

  init (data) {
    // Initialization code goes here
    this.playMusic1 = data.playMusic1;
  }

  preload () {
    // Preload assets
    this.load.image('welcomeImg', './assets/welcomeImg.png');
    this.load.spritesheet('welcomeButton', './assets/welcomeButtonNew.png', {
      frameHeight: 56,
      frameWidth: 302
    });
    this.load.image('pirateSideText', './assets/pirateSideText.png');
    this.load.image('ninjaSideText', './assets/ninjaSideText.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    var img = this.add.image(this.centerX, this.centerY, 'welcomeImg');

    // create pirateSideButton and its pointer functions
    var pirateSideButton = this.add.sprite(this.centerX, this.centerY - 130,'welcomeButton', 0).setInteractive().setDisplaySize(275,56);
    var pirateSideText = this.add.image(this.centerX, this.centerY - 130, 'pirateSideText').setScale(0.4);
    pirateSideButton.on("pointerover", function(){
      this.setFrame(1);
    });
    pirateSideButton.on("pointerout", function(){
      this.setFrame(0);
    });
    pirateSideButton.on("pointerup", function(){
      var buttonpress = this.sound.add('buttonclick').play({volume: 1, loop: false});
      this.scene.start('WelcomeSceneMode', { playerMode: 'pirate', playMusic1: this.playMusic1 });
    }, this );

    // create ninjaSideButton and its pointer functions
    var ninjaSideButton = this.add.sprite(this.centerX, this.centerY - 70,'welcomeButton', 0).setInteractive().setDisplaySize(275,56);
    var ninjaSideText = this.add.image(this.centerX, this.centerY - 70, 'ninjaSideText').setScale(0.4);
    ninjaSideButton.on("pointerover", function(){
      this.setFrame(1);
    });
    ninjaSideButton.on("pointerout", function(){
      this.setFrame(0);
    });
    ninjaSideButton.on("pointerup", function(){
      var buttonpress = this.sound.add('buttonclick').play({volume: 1, loop: false});
      this.scene.start('WelcomeSceneMode', { playerMode: 'ninja', playMusic1: this.playMusic1 });
    }, this );

  }

  update (time, delta) {
    // Update the scene
  }
}
