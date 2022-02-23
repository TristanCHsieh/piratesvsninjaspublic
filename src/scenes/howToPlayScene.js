/*global Phaser*/
export default class Instructions extends Phaser.Scene {
  constructor () {
    super('Instructions');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    //this.load.image('whirlpool', './assets/whirlpool.png');
    this.load.image('instructions', './assets/howtoplay.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    var img = this.add.image(this.centerX, this.centerY, 'instructions');
    img.setScale(0.35);

    this.input.keyboard.on(
      "keydown_ONE",
        function () {
          this.scene.start('Play');
        }, this
    );
    this.input.keyboard.on(
      "keydown_TWO",
        function () {
          console.log("hello");
          this.scene.start('InstructionsScene');
        }, this
    );
  }

  update (time, delta) {
    // Update the scene
  }
}
