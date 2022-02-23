/*global Phaser, window*/
import Play from './scenes/Play.js';
import Welcome from './scenes/welcomeScene.js';
import WelcomeScenePlayers from './scenes/welcomeScenePlayers.js';
import WelcomeSceneSide from './scenes/welcomeSceneSide.js';
import WelcomeSceneMode from './scenes/welcomeSceneMode.js';
import WelcomeSceneDifficulty from './scenes/welcomeSceneDifficulty.js';
import Instructions from './scenes/howToPlayScene.js';
import PirateWin from './scenes/PirateWin.js';
import NinjaWin from './scenes/NinjaWin.js';
import CreditScene from './scenes/creditScene.js';
import Config from './config/config.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Play', Play);
    this.scene.add('WelcomeScene', Welcome);
    this.scene.add('WelcomeSceneMode', WelcomeSceneMode);
    this.scene.add('WelcomeSceneDifficulty', WelcomeSceneDifficulty);
    this.scene.add('WelcomeScenePlayers', WelcomeScenePlayers);
    this.scene.add('WelcomeSceneSide', WelcomeSceneSide);
    this.scene.add('PirateWin', PirateWin);
    this.scene.add('NinjaWin', NinjaWin);
    this.scene.add('Instructions', Instructions);
    this.scene.add('CreditScene', CreditScene);
    this.scene.start('WelcomeScene');
  }
}

window.game = new Game();
