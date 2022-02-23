/*global Phaser*/
var mode; // Represents which animation is playing. Players can only move on "still"
var tileSize; // Size of each tile
var gameMode; // gameMode can be either king, flag, or battle
var leftMargins = 150;
var upperMargins = 10;
var jailP = 0;
var jailN = 0;
var hurt;
var whirlpoolFirstFrame = false; // lets the program know if you want to do the whirlpool animation, so that it performs the first functions only once
var whirlpoolLastFrame = false; // lets the program know that you're on the last frame of whirlpool, so that it can perform a set of ending commands

var playMusic; // The background music needs to be made global so that it can be stopped when the player presses space
var hasWon = false;
var hasWonSide;


// The following contains information for the images and animations to be loaded.
// In the format ["name",frameWidth, frameHeight]. Pirate aniamtions don't need framewidth
// and frameheight because they're all the same
var ninjaNameList = [['ninja1idle',105,127],['ninja1walk',106,125],['ninja1run',128,132],['ninja1attack',129,128],
['ninja1die',155,139],['ninja1hurt',130,133],['ninja2attack',137,135],['ninja2die',173,152], ['ninja2hurt',139,137],
['ninja2idle',128,128],['ninja2run',134,137],['ninja2walk',129,133],['ninja3attack',148,142],['ninja3die',177,158],
['ninja3hurt',149,141],['ninja3idle',129,139],['ninja3run',147,149], ['ninja3walk',129,141],['ninja4attack',95,105],
['ninja4die',135,113],['ninja4attack2',193,105],['ninja4hurt',104,103],['ninja4idle',85,97],['ninja4run',99,109],
['ninja4walk',86,100],['ninja5attack',117,104],['ninja5attack2',184,101],['ninja5die',131,122],['ninja5hurt',101,109],
['ninja5idle',91,96],['ninja5run',109,106],['ninja5walk',90,99],['ninja6attack',94,102],['ninja6attack2',153,100],
['ninja6die',131,111],['ninja6hurt',101,100],['ninja6idle',83,94],['ninja6run',98,106],['ninja6walk',85,98]];


var pirateNameList = ['pirate1attack','pirate1die','pirate1hurt','pirate1idle','pirate1run','pirate1walk','pirate2attack',
'pirate2die','pirate2hurt','pirate2idle','pirate2run','pirate2walk','pirate3attack','pirate3die','pirate3hurt','pirate3idle',
'pirate3run','pirate3walk','pirate4attack','pirate4die','pirate4hurt','pirate4idle','pirate4run','pirate4walk',
'pirate5attack','pirate5die','pirate5hurt','pirate5idle','pirate5run','pirate5walk','pirate6attack','pirate6die','pirate6hurt',
'pirate6idle','pirate6run','pirate6walk'];

export default class Play extends Phaser.Scene {
  constructor () {
    super('Play');
  }

  init (data) {
    // Initialization code goes here
    //gameMode and boardSize initialized based on user choice from welcomeScenes
    gameMode = data.gameMode
    console.log(this.cameras.main.height);
    console.log(this.cameras.main.width);

    //this will reset the jails
    jailN = 0;
    jailP = 0;

    if(gameMode == "tutorial"){
      this.tutorialTextArr = [
        "WELCOME TO PIRATES VS NINJAS!\nClick the pirate to begin.",
        "This is the pirate captain!\nHis crew is fighting ninjas\nfor ancient treasure.\n(Click any red square)",
        "This is the pirate accountant!\nHe is hungry for coins,\nbut his movement is more\nrestricted! (Get the coin)",
        "During gameplay, the coin gives\nyou an extra turn. Now\nthe pirate navigator. His\nknowledge of the currents allows\nhim to move great distances.",
        "Whoosh! The whirlpool sends you\nto a random location on\nthe board. Next is the cook!\nHe’s always hungry for food…",
        "The fruit revives a piece. Now\nfor the pirate clergyman.\nHis movements are a little\nmore spread out.",
        "The holy grail you just collected\nrevives all the pieces\nof a certain team. Finally\nlet’s meet the pirate bandit.",
        "The flag counts for points in\ncapture the flag mode only.\nCollect 5 points to win!\n… Uh oh… is that the Ninja captain…?",
        "The ninjas have a team similar\nto the pirates. The winning\nteam is whoever meets the\ncurrent mode’s winning conditions\nfirst. Press space to begin!",
        ""
      ]
      this.tutorialIdx = 0;

      this.boardSize = 5;
      upperMargins = 10;
      leftMargins = 250;
      //var bg = this.add.image(this.centerX, this.centerY, 'plain');

      this.playerMode = "multi";
      this.input.keyboard.on(
        "keydown_SPACE",
          function () {
            playMusic.stop();
            this.scene.start('WelcomeScene');
          }, this
      );
    } else {
      leftMargins = 150; //Reset leftMargins to 150 if not in tutorial....
      this.boardSize = data.boardSize;
      if (this.boardSize == 4) {
        leftMargins = 275;
        upperMargins = 125;
      }
      if (this.boardSize == 7) {
        leftMargins = 180;
        upperMargins = 70;
      }
      if (this.boardSize == 8) {
        leftMargins = 155;
        upperMargins = 18;
      }
      if (this.boardSize == 9) {
        leftMargins = 150;
        upperMargins = 7;
      }

      this.playerMode = data.playerMode;
    }

    this.Tile = function(xPos, yPos){
      // Tile class
      this.xPos = xPos; // Where the tile is on the board
      this.yPos = yPos;
      this.sprite = null; // The tile's actual image variable
      this.selected = false; // Whether the tile is red or green
      this.highlighted = false;
      this.threatened = false;

      this.select = function(turn) { // Selects the tile
        this.selected = true;
        if(turn == "pirate"){
          this.sprite.setFrame(1); // Make the tile pink
        } else if(turn == "ninja"){
          this.sprite.setFrame(2);
        }
      }

      this.deselect = function() { // Deselcts the tile
        this.selected = false;
        this.highlighted = false;
        if(this.threatened == true){
          //this.sprite.setFrame(4);
          this.sprite.setFrame(0);
          // Uncomment this to see threatened tiles
        } else if(this.threatened == false){
          this.sprite.setFrame(0); // Regular tile
        }
      }

      this.switch = function(turn){ // This function is basically used for the blinking
        if(this.selected == true || this.highlighted == true){
          this.deselect();
        } else {
          this.highlight(turn);
        }
      }

      this.highlight = function(turn) {
        this.highlighted = true;
        if(turn == "ninja"){
          this.sprite.setFrame(3);
        } else if(turn == "pirate"){
          this.sprite.setFrame(4);
        } else {
          this.sprite.setFrame(4);
        }
      }

      this.threaten = function() {
        this.threatened = true;
        //this.sprite.setFrame(4);
        // Uncomment this to see threatened tiles
      }

      this.unthreaten = function() {
        this.threatened = false;
        this.sprite.setFrame(0);
      }


    }

    this.Piece = function(name, xPos, yPos, health, power){
        this.name = name; // What kind of sprite is it
        this.xPos = xPos; // Where the sprite is on the board
        this.yPos = yPos;
        this.health = health; // the health stat of the character
        this.power = power; // the damage the character does to enemy's health

        // Determine the team the piece is on (this.type), and its movements (this.movements)
        switch(this.name){
          // Assign movement and type based on the name
          case "pirate1": // Chess equivilant: King (P)
            this.type = "pirate";
            this.movement = [[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,1],[1,1],[-1,-1]];
            break;
          case "pirate2": //Queen (P)
            this.type = "pirate";
            this.movement = [[1,-1],[-1,1],[1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1],[2,0],[-2,0],[0,2],[0,-2]];
            break;
          case "pirate3": //Bishop (P)
            this.type = "pirate";
            this.movement = [[1,-1],[-1,1],[1,1],[-1,-1],[2,2],[-2,-2],[2,-2],[-2,2]];
            break;
          case "pirate4"://Castle (P)
            this.type = "pirate"
            this.movement = [[1,0],[-1,0],[0,1],[0,-1],[3,0],[-3,0],[0,3],[0,-3],[5,0],[-5,0],[0,5],[0,-5],[7,0],[-7,0],[0,7],[0,-7]];
            break;
          case "pirate5": //Knight (P)
            this.type = "pirate";
            this.movement = [[1,2],[2,1],[-1,2],[2,-1],[-2,1],[2,-1],[-2,-1],[-1,-2],[1,-2]];
            break;
          case "pirate6"://pawn (P)
            this.type = "pirate";
            this.movement = [[1,0],[-1,0],[0,1],[0,-1]];
            break;
          case "ninja1": //King (N)
            this.type = "ninja";
            this.movement = [[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,1],[1,1],[-1,-1]];
            break;
          case "ninja2": //Queen (N)
            this.type = "ninja";
            this.movement = [[1,-1],[-1,1],[1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1],[2,0],[-2,0],[0,2],[0,-2]];
            break;
          case "ninja3": //Bishop (N)
            this.type = "ninja";
            this.movement = [[1,-1],[-1,1],[1,1],[-1,-1],[2,2],[-2,-2],[2,-2],[-2,2]];
            break;
          case "ninja4"://Castle (N)
            this.type = "ninja"
            this.movement = [[1,0],[-1,0],[0,1],[0,-1],[3,0],[-3,0],[0,3],[0,-3],[5,0],[-5,0],[0,5],[0,-5],[7,0],[-7,0],[0,7],[0,-7]];
            break;
          case "ninja5": //Knight (N)
            this.type = "ninja";
            this.movement = [[1,2],[2,1],[-1,2],[2,-1],[-2,1],[2,-1],[-2,-1],[-1,-2],[1,-2]];
            break;
          case "ninja6"://Pawn (N)
            this.type = "ninja";
            this.movement = [[1,0],[-1,0],[0,1],[0,-1]];
            break;
          default:
            this.type = null;
            this.movement = null;
            break;
        }

        switch(this.type){ // Give the appropriate sizing for all the sprites
          case "ninja":
            if(this.name == "ninja4" || this.name == "ninja5" || this.name == "ninja6"){
              this.scale = 0.65;
            }
            else if(this.name == "ninja3") {
              this.scale = 0.45;
            } else {
              this.scale = 0.5;
            }
            this.originX = -0.05
            this.originY = 0.06;
            break;
          case "pirate":
            if (this.name == "pirate6"){
              this.scale = 0.75;
            } else {
              this.scale = 0.8;
            }
            this.originX = 0.13;
            this.originY = 0.17;
            break;

        }

        this.sprite = null; //variable that contains the image;
        // The following are sprites that represent animations
        // They will take the place of sprite based on which animation is being played
        this.idleSprite = null;
        this.walkingSprite = null;
        this.attackSprite = null;
        this.dieSprite = null;
        this.hurtSprite = null;
        this.orientation = "right";


        this.update = function(){ // Moves the image when xPos and yPos change, and hides the rest of the sprites off screen
          this.idleSprite.x = 1000;
          this.idleSprite.y = 1000;
          this.walkingSprite.x = 1000;
          this.walkingSprite.y = 1000;
          this.attackSprite.x = 1000;
          this.attackSprite.y = 1000;
          this.dieSprite.x = 1000;
          this.dieSprite.y = 1000;
          this.hurtSprite.x = 1000;
          this.hurtSprite.y = 1000;
          this.sprite.x = leftMargins + this.xPos * tileSize;
          this.sprite.y = upperMargins + this.yPos * tileSize;
          if(this.orientation == "right"){
            this.sprite.flipX = false;
          } else if(this.orientation == "left"){
            this.sprite.flipX = true;
          }
        }

        // Changes the animation that the sprite is playing to "a"
        this.changeFace = function(a){
          this.sprite = a;
          this.update();
        }
    }

    // Coin class - represents a powerup
    this.Powerup = function(name){
      this.name = name;
      this.coord = null; // Where on the board is the coin
      this.sprite = null; // Represents the actual coins' sprite

      // Update the actual position of the coin
      this.update = function(){
        this.sprite.x = leftMargins + this.coord[0] * tileSize;
        this.sprite.y = upperMargins + this.coord[1] * tileSize;
      }
    }

    //health bar class with update function
    this.HealthBar = function(name, x, y) {
      this.name = name;
      this.x = x;
      this.y = y;
      this.sprite = null;

      this.update = function(xCoord, yCoord) {
        this.x = 32 + leftMargins + xCoord * tileSize;
        this.y = upperMargins + yCoord * tileSize;
      }
    }

    this.stage = "choose";
    // Stage is "choose" when the player is choosing a piece,
    // and "move" when the player is choosing a square to move
    this.selectedCharacter = null;
    this.corrChar = null;
    this.captureChar = null;
    // When the player selects a square, "selectedCharacter" will
    // contain the tile that's selected, corrChar is any Piece that
    // is occupying a square that's just been clicked, and captureChar
    // is any Piece that's about to be captured
    this.turn = "pirate"; // Keeps track of whose turn it is

    this.flagDic = {
      "ninja": 0,
      "pirate": 0
    }

    if(gameMode != "tutorial" && this.boardSize > 4 && this.playerMode != "multi"){
      // the tutorial text will just tell you what's going on and stuff
      this.blinkCount = 0;
      mode = "blink";
    } else {
      if(this.playerMode == "ninja"){ // If ninjas have the board... give control to the AI first
        this.AICount = 0;
        mode = "AI";
      } else {
        mode = "still"; // Start out by letting the player move
      }
    }

    if(this.boardSize == 9){
      this.infoToggle = false; // Represents if the tutorial text is on or off.
    } else {
      this.infoToggle = true;
    }



  }

  preload () {
    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
    // Preload assets
    this.load.audio('music', './assets/gameMusic1.mp3');
    this.load.audio('ninjaSound', './assets/ninjaSound.mp3');
    this.load.audio('pirateSound', './assets/pirateYell.mp3');
    this.load.audio('coinsound', './assets/coinsound.wav');
    this.load.audio('whirlsound', './assets/bubbles.wav');
    this.load.audio('holygrailsound', './assets/holygrail.wav')
    this.load.audio('Error', './assets/error.wav');
    this.load.audio('crash', './assets/crash.wav');
    this.load.image('fullbg2', './assets/fullbg2.png');
    this.load.image('plain', './assets/plain.png');
    this.load.image('boardBoarder', './assets/board.png');
    this.load.image('woodTexture', './assets/woodtexture.png');
    this.load.image('pirateking', './assets/PirateKing1.png');
    this.load.image('ninjaking', './assets/NinjaKing.png');
    this.load.image('flashofWhite', './assets/flashofwhite.png');


    //this.load.image('info', './assets/info.ico');

    this.load.spritesheet('tiles', './assets/spritesheettiles.png', {
      frameHeight: 60,
      frameWidth: 60
    });

    this.load.spritesheet('coin', './assets/coinanimation.png', {
      frameHeight: 489,
      frameWidth: 531
    });


    this.load.spritesheet('whirlpool', './assets/whirlpoolanimation.png', {
      frameHeight: 1125,
      frameWidth: 1125
    });

    this.load.spritesheet('fruit', './assets/fruit.png', {
      frameHeight: 60,
      frameWidth: 61
    });

    this.load.spritesheet('holygrail', './assets/holygrail1.png', {
      frameHeight: 60,
      frameWidth: 60
    });

    this.load.spritesheet('flag', './assets/pirateflag.png', {
      frameHeight: 60,
      frameWidth: 68
    });

    this.load.spritesheet('ninjaflag', './assets/ninjaflag.png', {
      frameHeight: 60,
      frameWidth: 68
    });

    this.load.spritesheet('healthBar', './assets/healthBar.png', {
      frameHeight: 45,
      frameWidth: 60
    });

    this.load.spritesheet('info', './assets/infobutton.png',{
      frameHeight: 40,
      frameWidth: 40
    });

    this.load.spritesheet('infotext', './assets/infotext.jpeg',{
      frameHeight: 531,
      frameWidth: 489
    });

    this.load.spritesheet('backArrow', './assets/backArrow.png',{
      frameHeight: 200,
      frameWidth: 200
    });

    // Preload sprite sheets
    for (var i = 0; i < ninjaNameList.length; i++) {
      console.log('./assets/' + ninjaNameList[i][0] + '.png');
      if(ninjaNameList[i][0].slice(-4) == "idle"){
        this.load.spritesheet(ninjaNameList[i][0], './assets/' + ninjaNameList[i][0] + '.png', {
          frameWidth: ninjaNameList[i][1],
          frameHeight: ninjaNameList[i][2]
        });
      } else {
        this.load.spritesheet(ninjaNameList[i][0], './assets/' + ninjaNameList[i][0] + '.png', {
          frameWidth: ninjaNameList[i][1],
          frameHeight: ninjaNameList[i][2]
        });
      }
    }
    for (var i = 0; i < pirateNameList.length; i++) {
      console.log('./assets/' + pirateNameList[i] + '.png');
      this.load.spritesheet(pirateNameList[i], './assets/' + pirateNameList[i] + '.png', {
        frameWidth: 113,
        frameHeight: 113
      });
    }
  }

  create (data) {
    //Create the scene




    //create sprite animations
    var frameList = [7,11,4,11,5,9,5,11,7,11,4,11,5,9,5,11,7,11,4,11,5,9,5,11,
      7,11,4,11,5,9,5,11,7,11,4,11,5,9,5,11,7,11,4,11,5,9,5,11];
    this.endFrame = 4;
    for (i = 0; i < ninjaNameList.length; i++) {
      if(ninjaNameList[i][0] == "ninja4attack"){
        this.endFrame = 9;
      }
      console.log("loading " + ninjaNameList[i][0]);
      if(ninjaNameList[i][0].slice(-3) == "die"){ // it's a die animation
        this.anims.create({
          key: ninjaNameList[i][0],
          frames: this.anims.generateFrameNumbers(ninjaNameList[i][0], {start: 0, end: this.endFrame}),
          frameRate: 10,
          repeat: 0
        });
      }
      else if(ninjaNameList[i][0].slice(-4) == "hurt") { // it's a hurt animation
        this.anims.create({
          key: ninjaNameList[i][0],
          frames: this.anims.generateFrameNumbers(ninjaNameList[i][0], {start: 0, end: this.endFrame}),
          frameRate: 10,
          repeat: 0
        });
      } else {
        this.anims.create({
          key: ninjaNameList[i][0],
          frames: this.anims.generateFrameNumbers(ninjaNameList[i][0], {start: 0, end: this.endFrame}),
          frameRate: 10,
          repeat: -1
        });
      }
    }
    for (i = 0; i < pirateNameList.length; i++) {
      console.log("loading " + pirateNameList[i]);
      if(pirateNameList[i].slice(-3) == "die"){ // it's a die animation
        this.anims.create({
          key: pirateNameList[i],
          frames: this.anims.generateFrameNumbers(pirateNameList[i], {start: 0, end: frameList[i]}),
          frameRate: 10,
          repeat: 0
        });
      } else {
        this.anims.create({
          key: pirateNameList[i],
          frames: this.anims.generateFrameNumbers(pirateNameList[i], {start: 0, end: frameList[i]}),
          frameRate: 10,
          repeat: -1
        });
      }
    }

    // Create the powerup animations
    this.anims.create({
      key: 'coin',
      frames: this.anims.generateFrameNumbers('coin', {start: 0, end: 8}),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'whirlpool',
      frames: this.anims.generateFrameNumbers('whirlpool', {start: 0, end: 8}),
      frameRate: 15,
      repeat: -1
    });

    // Add Assets to the screen

    playMusic = this.sound.add('music');
    playMusic.play({volume: 1, loop: true}); // Play music

    this.crashSound = this.sound.add('crash');

    if(gameMode != "tutorial"){
      var bg = this.add.image(this.centerX, this.centerY, 'fullbg2'); // Add background image
      if(gameMode == "king"){
        if(this.boardSize == 9){ // adjust for hard mode... so that the board doesn't clip the kings
          var pking = this.add.image(40, 400, 'pirateking').setScale(.9);
          var nking = this.add.image(100, 400, 'ninjaking').setScale(.6);
          var kingtext = this.add.text(40, 440,"KINGS", {fill: "900", fontSize: 20});
        } else {
          var pking = this.add.image(700, 400, 'pirateking').setScale(.9);
          var nking = this.add.image(760, 400, 'ninjaking').setScale(.6);
          var kingtext = this.add.text(700, 440,"KINGS", {fill: "900", fontSize: 20});
        }
      }
    } else {
      console.log("adding bk image");
      var bg = this.add.image(this.centerX, this.centerY, 'plain'); // Add background image
    }

    tileSize = 65; // Each tile will be 65 pixels apart
    this.tileBoard = []; // Stores the board info

    this.emptyPiece = new this.Piece(null, 0, 0, 0, 0); // Used to represent the absence of a piece
    this.pieceArray = [ // This array will contain all the pieces there are
      new this.Piece("ninja1", null, null,44,22),
      new this.Piece("ninja2", null, null,44,22),
      new this.Piece("ninja3", null, null,44,22),
      new this.Piece("ninja4", null, null,54,17),
      new this.Piece("ninja5", null, null,57,14),
      new this.Piece("ninja6", null, null,60,11),
      new this.Piece("pirate1", null, null,44,22),
      new this.Piece("pirate2", null, null,44,22),
      new this.Piece("pirate3", null, null,44,22),
      new this.Piece("pirate4", null, null,54,17),
      new this.Piece("pirate5", null, null,57,14),
      new this.Piece("pirate6", null, null,60,11),
    ]

    this.pieces = []; // This array will add all the pieces
    this.initCoordArr = []; //Makes sure that each character appears in a unique location

    //hold the original health stats for revival
    this.originalHealth = [44,44,44,54,57,60,44,44,44,54,57,60];

    this.healthBars = [
      new this.HealthBar('ninja1', 0, 0),
      new this.HealthBar('ninja2', 0, 0),
      new this.HealthBar('ninja3', 0, 0),
      new this.HealthBar('ninja4', 0, 0),
      new this.HealthBar('ninja5', 0, 0),
      new this.HealthBar('ninja6', 0, 0),
      new this.HealthBar('pirate1', 0, 0),
      new this.HealthBar('pirate2', 0, 0),
      new this.HealthBar('pirate3', 0, 0),
      new this.HealthBar('pirate4', 0, 0),
      new this.HealthBar('pirate5', 0, 0),
      new this.HealthBar('pirate6', 0, 0)
    ];

    // Initialize pieces... either randomly generate them or begin the tutorial

    if(gameMode != "tutorial"){
      // Add all the pieces in a random location.
      for(var i = 0; i < this.pieceArray.length; i ++){
        while(true){

          if(this.boardSize == 4){
            this.newX = Math.floor(Math.random() * this.boardSize);
            this.newY = Math.floor(Math.random() * this.boardSize);
          } else {
            if(this.pieceArray[i].type == "pirate"){ // Pirates are at the bottom of the board
              this.newX = Math.floor(Math.random() * this.boardSize);
              this.newY = (this.boardSize-3) + (Math.floor(Math.random() * 3));
            } else if(this.pieceArray[i].type == "ninja"){ // Ninjas are at the top of the board
              this.newX = Math.floor(Math.random() * this.boardSize);
              this.newY = Math.floor(Math.random() * 3);
            }
          }

          if(this.initCoordArr[(this.newX * this.boardSize) + this.newY] != true){ // If there is not already a piece there
            break; // get out of the loop and continue with the code
          }
        }

        this.pieces.push(this.pieceArray[i]); // Add the piece to the board
        this.initCoordArr[(this.newX * this.boardSize) + this.newY] = true; // Tell the initCoordArr that there is now a piece in the corresponding coordinates
        // Update the coordinates of the piece.
        this.pieces[i].xPos = this.newX;
        this.pieces[i].yPos = this.newY;
      }

    }
    else if(gameMode == "tutorial"){
        this.pieces.push(new this.Piece("pirate1", 2, 2));
        this.pieces.push(new this.Piece("pirate6", 1000, 1000));
        this.pieces.push(new this.Piece("pirate2", 1000, 1000));
        this.pieces.push(new this.Piece("pirate3", 1000, 1000));
        this.pieces.push(new this.Piece("pirate5", 1000, 1000));
        this.pieces.push(new this.Piece("pirate4", 1000, 1000));
        this.pieces.push(new this.Piece("ninja1", 1000, 1000));
    }

    // Initilize the board with blank tiles
    for(var i = 0; i < this.boardSize; i++){
      this.tileBoard.push([]);
      for(var j = 0; j < this.boardSize; j ++){
        this.tileBoard[i].push(new this.Tile(i,j));
      }
    }

    this.captureCharArr = []; // This will keep track of which characters have been captured

    // Creates the board
    this.createBoard();


    if (gameMode == 'battle') {
      for (var i = 0; i < this.pieces.length; i++) {
        this.healthBars[i].update(this.pieces[i].xPos, this.pieces[i].yPos);
        this.healthBars[i].sprite = this.add.sprite(this.healthBars[i].x, this.healthBars[i].y, 'healthBar');
        this.healthBars[i].sprite.setDisplaySize(this.pieceArray[i].health, 45);
      }
    }

    if(gameMode == "tutorial"){
      this.tutorialText = this.add.text(200,(tileSize*this.boardSize) + upperMargins, this.tutorialTextArr[this.tutorialIdx],{ fill: "#000", font: "32px Impact" });
      this.add.text( 220, 560, "Press spacebar to exit tutorial", {fill: "900", fontSize: 20});

    } else {

      // Initialize the text that says whose turn it is
      if(this.playerMode == "multi" || this.playerMode == "pirate"){
        this.turnText = this.add.text(10,-1000,"Pirate's turn!",{ fill: "#FF0000", font: "19px Impact" }); // Add text to denote whose turn it is
        this.tweenText(this.turnText);
      } else {
        this.turnText = this.add.text(10,-1000,"Pirates are moving...",{ fill: "#FF0000", font: "19px Impact" });
        this.tweenText(this.turnText);
      }
    }

    if(gameMode == "flag"){
      this.pirateFlagText = this.add.text(15,50 + 30, "Pirate Flags: ", { fill: "000", fontSize: 16});
      this.ninjaFlagText = this.add.text(20, 120 + 30, "Ninja Flags: ", { fill: "000",fontSize: 16});
      this.pirateScoreText = this.add.text(70,80 + 30, 0, { fill: "900", fontSize: 20});
      this.ninjaScoreText = this.add.text(70,150 + 30, 0, { fill: "900",fontSize: 20});
    }

  }

  update (time, delta) {
    // Update the scene

    // Will change scene if it's time
    // Basically when the animation is done playing,
    if(hasWon == true){
      hasWon = false; // or else once a team wins, they always win
      if(hasWonSide == "pirate"){
        this.scene.start("PirateWin");
      } else if(hasWonSide == "ninja"){
        this.scene.start("NinjaWin");
      }
    }
    // The following are instructions for each sprite based on what phase of the animation they're in
    if(this.stage != "winning"){
      // The game only functions while the winning animation is playing
      if (mode == "AI"){ // If the AI is determining where to go


        // While AICount is 0, find a piece to move. Then wait 100 frames before moving on to the next step.

        // AI FUNCTIONALITY VVVVV

        if(this.AICount == 50){

          // Calculate move based on difficulty

          if(this.boardSize == 7){
            // Easy AI, moves randomly
            this.AIMove = [null];/*this.findBestMoves(
              JSON.parse(JSON.stringify(this.pieces)),
              JSON.parse(JSON.stringify([this.coin,this.fruit,this.whirlpool,this.holyGrail,this.flag])),
              true,
              1
            );*/

          } else if(this.boardSize == 8 || this.boardSize == 4){
            // Medium AI, moves strategically

            this.AIMove = this.findBestMoves(
              JSON.parse(JSON.stringify(this.pieces)),
              JSON.parse(JSON.stringify([this.coin,this.fruit,this.whirlpool,this.holyGrail,this.flag])),
              true,
              1
            );

          } else if(this.boardSize == 9){
            // Hard AI... thinks two moves ahead
            this.AIMove = this.findBestMoves(
              JSON.parse(JSON.stringify(this.pieces)),
              JSON.parse(JSON.stringify([this.coin,this.fruit,this.whirlpool,this.holyGrail,this.flag])),
              true,
              2
            );
          }

          // Now Select the tiles

          if(this.AIMove[0] == null){
            // If there are really no good moves, just move randomly
            while(true){
              this.newPieceIdx = Math.floor(Math.random() * this.pieces.length);
              if(this.pieces[this.newPieceIdx].type == this.turn){
                this.selectTiles(this, this.pieces[this.newPieceIdx]);
                this.AICount ++;
                break;
              }
            }

          } else {
            // Otherwise, move the AI to the calculated location
            this.selectTiles(this, this.AIMove[0]);
            this.AICount ++;
          }


        } else if(this.AICount > 100){
          if(this.AIMove[0] == null){
            while(true){
              this.newAIX = Math.floor(Math.random() * this.boardSize);
              this.newAIY = Math.floor(Math.random() * this.boardSize);
              if(this.tileBoard[this.newAIX][this.newAIY].selected == true){
                // If the randomly generated tile is a legal move...
                this.movePiece(this, this.newAIX, this.newAIY);
                break;
              }
            }
          } else {
            this.movePiece(this, this.AIMove[0].xPos + this.AIMove[1], this.AIMove[0].yPos + this.AIMove[2]);
          }
        } else {
          this.AICount ++;
        }

      } else if (mode == "attack"){ // If the player is currently attacking
        this.corrChar.changeFace(this.corrChar.attackSprite); // The character is attacking
        if (this.corrChar.type == "ninja") {
          var ninjaYell = this.sound.add('ninjaSound').play({volume: 1, loop: false});
        }
        if (this.corrChar.type == "pirate") {
          var pirateYell = this.sound.add('pirateSound').play({volume: 1, loop: false});
        }
        if (gameMode != 'battle') {
          this.captureChar.changeFace(this.captureChar.dieSprite); // Captured character is dying
          this.captureChar.sprite.anims.play(this.captureChar.name + "die", false);
        }

        if (gameMode == 'battle') {
          for (var i = 0; i < this.healthBars.length; i++) {
            if (this.healthBars[i].name == this.captureChar.name) {
              if (this.pieceArray[i].health <= this.corrChar.power) {
                this.healthBars[i].sprite.destroy();
                this.captureChar.changeFace(this.captureChar.dieSprite); // Captured character is dying
                this.captureChar.sprite.anims.play(this.captureChar.name + "die", false);
                this.corrChar.xPos = this.captureChar.xPos;
                this.corrChar.yPos = this.captureChar.yPos;
                this.captureCharArr.push(this.captureChar);
                hurt = 'no';
              } else {
                this.pieceArray[i].health -= this.corrChar.power;
                this.healthBars[i].sprite.setDisplaySize(this.pieceArray[i].health, 45);
                this.captureChar.changeFace(this.captureChar.hurtSprite); // Captured character is dying
                this.captureChar.sprite.anims.play(this.captureChar.name + "hurt", false);
                hurt = 'yes';
              }
            }
          }
        }

        // Then move on to stage "attack2"
        this.attackCount = 0;
        mode = "attack2";
      } else if(mode == "attack2"){ // Wait 100 seconds, then make the capturing player take the place of the captured player
        this.attackCount ++;
        if(this.attackCount == 100){
          if (gameMode == 'battle' && hurt == 'yes') {
            this.captureChar.changeFace(this.captureChar.idleSprite);
            this.corrChar.changeFace(this.corrChar.walkingSprite);
            this.corrChar.xPos = this.originalX;
            this.corrChar.yPos = this.originalY;
            this.tweens.add({
              targets: this.corrChar.sprite,
              x: leftMargins + this.corrChar.xPos * tileSize,
              y: upperMargins + this.corrChar.yPos * tileSize,
              duration: 1000,
              onComplete: function(){
                mode = "finish";
              }
            });
            for (var i = 0; i < this.healthBars.length; i++) {
              if (this.healthBars[i].name == this.corrChar.name) {
                this.healthBars[i].update(this.corrChar.xPos, this.corrChar.yPos);
                this.tweens.add({
                  targets: this.healthBars[i].sprite,
                  x: this.healthBars[i].x,
                  y: this.healthBars[i].y,
                  duration: 1000,
                  onComplete: function(){
                    mode = "finish";
                  }
                });
              }
            }
          } else {
            this.pieces.splice(this.pieces.indexOf(this.captureChar),1); // Remove the captured piece from the board
            this.captureChar.changeFace(this.captureChar.idleSprite);
            if(this.captureChar.type == "pirate"){
              // Refresh the captured piece's orientation
              this.captureChar.orientation = "right";
              if(gameMode != "tutorial"){
                this.captureChar.update();
                this.captureChar.sprite.depth = jailP;
                this.captureChar.sprite.x = jailP;
                this.captureChar.sprite.y = 300;
                jailP = jailP + 20;
              } else {
                this.captureChar.sprite.x = 1000;
                this.captureChar.sprite.y = 1000;
                this.captureChar.update();
              }
            } else {
              this.captureChar.orientation = "right";
              if(gameMode != "tutorial"){
                this.captureChar.update();
                this.captureChar.sprite.depth = jailN;
                this.captureChar.sprite.x = jailN;
                this.captureChar.sprite.y = 500;
                jailN = jailN + 20;

              } else {
                this.captureChar.sprite.x = 1000;
                this.captureChar.sprite.y = 1000;
                if(this.tutorialIdx == 7){
                  console.log("captured!");
                  this.updateTutorialText();
                }
              }
            }
            this.corrChar.changeFace(this.corrChar.walkingSprite); // Player walks into position
            if(this.corrChar.orientation == "right" && gameMode != 'battle'){
              this.corrChar.xPos ++;
            } else if(this.corrChar.orientation == "left" && gameMode != 'battle'){
              this.corrChar.xPos --;
            }
            if (gameMode == 'battle') {
              for (var i = 0; i < this.healthBars.length; i++) {
                if (this.healthBars[i].name == this.corrChar.name) {
                  this.healthBars[i].update(this.corrChar.xPos, this.corrChar.yPos);
                  this.tweens.add({
                    targets: this.corrChar.sprite,
                    x: leftMargins + this.corrChar.xPos * tileSize,
                    y: upperMargins + this.corrChar.yPos * tileSize,
                    duration: 1000,
                    onComplete: function(){
                      mode = "finish";
                    }
                  });
                  this.tweens.add({
                    targets: this.healthBars[i].sprite,
                    x: this.healthBars[i].x,
                    y: this.healthBars[i].y,
                    duration: 1000,
                    onComplete: function(){
                      mode = "finish";
                    }
                  });
                }
              }
            } else {
              this.tweens.add({
                targets: this.corrChar.sprite,
                x: leftMargins + this.corrChar.xPos * tileSize,
                y: upperMargins + this.corrChar.yPos * tileSize,
                duration: 1000,
                onComplete: function(){
                  mode = "finish";
                }
              });
            }
          }
        }
      } else if (mode == "finish"){ // Once all the animations are finished
        this.corrChar.changeFace(this.corrChar.idleSprite); // Return player to the idle sprite

        if (gameMode == 'battle' && this.captureChar.health > 0) {
          this.captureChar.sprite.anims.play(this.captureChar.name + "idle", true);
        }
        if (gameMode != 'battle') {
          // Record captured Character
          if(this.captureChar.type != null){
            this.captureCharArr.push(this.captureChar);
          }
        }

        // Now tell me which tiles are threatened
        if(this.corrChar.type == this.playerMode){
          this.threatenTiles();
        }

        // NEXT SECTION CHECKS FOR ANY POWERUPS THAT WERE EATEN

        // Check to see if the player has eaten the fruit
        if(this.fruit.coord != null && this.fruit.coord[0] == this.corrChar.xPos && this.fruit.coord[1] == this.corrChar.yPos){ // If the fruit has been collected
          this.powerUpChoordArr[(this.fruit.coord[0] * this.boardSize) + this.fruit.coord[1]] = false;
          this.fruit.coord = null;
          this.fruit.sprite.x = 1000;
          if(this.turn == "pirate")
          {
            jailP = jailP - 20;
          }
          else
          {
            jailN = jailN - 20;
          }
          if(gameMode == "tutorial" && this.tutorialIdx == 4){
            this.pieces[4].xPos = this.pieces[3].xPos;
            this.pieces[4].yPos = this.pieces[3].yPos;
            this.pieces[4].update();
            this.pieces[3].xPos = 1000;
            this.pieces[3].update();
            this.updateTutorialText();
            this.powerupAppear(this.holyGrail);
          }

          for(var i = this.captureCharArr.length-1; i >= 0; i --){
            if(this.captureCharArr[i].type == this.turn){
              // Revive the character
              while(true){
                if (this.captureCharArr[i].health <= 0){ break; }
                this.newX = Math.floor(Math.random() * this.boardSize);
                this.newY = Math.floor(Math.random() * this.boardSize);
                if(this.findCorChar([this.newX,this.newY]).type == null && this.powerUpChoordArr[(this.newX * this.boardSize) + this.newY] != true){ // If there is not already a piece there
                  this.pieces.push(this.captureCharArr[i]); // Add the piece back to the game
                  this.pieces[this.pieces.length-1].xPos = this.newX; // Randomly place the piece on the board
                  this.pieces[this.pieces.length-1].yPos = this.newY;
                  this.pieces[this.pieces.length-1].sprite = this.pieces[this.pieces.length-1].idleSprite; // Change the piece's sprite back to idle sprite
                  this.pieces[this.pieces.length-1].update(); // Update position and appearance
                  if (gameMode == 'battle') {
                    for (var i = 0; i < this.healthBars.length; i++) {
                      if (this.healthBars[i].name == this.pieces[this.pieces.length-1].name) {
                        this.pieceArray[i].health = this.originalHealth[i];
                        this.healthBars[i].sprite.destroy();
                        this.healthBars[i].update(this.newX, this.newY);
                        this.healthBars[i].sprite = this.add.sprite(this.healthBars[i].x, this.healthBars[i].y,'healthBar');
                        this.healthBars[i].sprite.setDisplaySize(this.pieceArray[i].health, 45);
                      }
                    }
                  }
                  this.captureCharArr.splice(this.captureCharArr.indexOf(this.captureCharArr[i]),1); // The piece is no longer captured
                  break; // get out of the loop and continue with the code
                }
              }
              break;
            }
          }
        }

        // Check to see if the player has collected the holygrail
        if(this.holyGrail.coord != null &&  this.holyGrail.coord[0] == this.corrChar.xPos && this.holyGrail.coord[1] == this.corrChar.yPos){ // If the holyGrail has been collected
          this.powerUpChoordArr[(this.holyGrail.coord[0] * this.boardSize) + this.holyGrail.coord[1]] = false;
          this.holyGrail.coord = null;
          this.holyGrail.sprite.x = 1000;
          var coinspin = this.sound.add('holygrailsound').play({volume: 1, loop: false});

          var holygrailsound = this.sound.add('holygrailsound').play({volume: 1, loop: false});
          if(this.turn == "pirate")
          {
            jailP = 0;
          }
          else
          {
            jailN = 0;
          }

          if(gameMode == "tutorial" && this.tutorialIdx == 5){
            this.pieces[5].xPos = this.pieces[4].xPos;
            this.pieces[5].yPos = this.pieces[4].yPos;
            this.pieces[5].update();
            this.pieces[4].xPos = 1000;
            this.pieces[4].update();
            this.updateTutorialText();
            this.ninjaFlag = new this.Powerup("ninjaflag");
            this.ninjaFlag.sprite = this.add.image(1000,1000,this.ninjaFlag.name).setOrigin(0,0);
            this.flagDic = {"pirate":0 , "ninja":0};
            this.powerupAppear(this.ninjaFlag);
          }

          for(var i = this.captureCharArr.length-1; i >= 0; i --){
            if(this.captureCharArr[i].type == this.turn){
              // Revive the character
              while(true){
                if (this.captureCharArr[i].health <= 0){ break; }
                this.newX = Math.floor(Math.random() * this.boardSize);
                this.newY = Math.floor(Math.random() * this.boardSize);
                if(this.findCorChar([this.newX,this.newY]).type == null && this.powerUpChoordArr[(this.newX * this.boardSize) + this.newY] != true){ // If there is not already a piece there
                  this.pieces.push(this.captureCharArr[i]); // Add the piece back to the game
                  this.pieces[this.pieces.length-1].xPos = this.newX; // Randomly place the piece on the board
                  this.pieces[this.pieces.length-1].yPos = this.newY;
                  this.pieces[this.pieces.length-1].sprite = this.pieces[this.pieces.length-1].idleSprite; // Change the piece's sprite back to idle sprite
                  this.pieces[this.pieces.length-1].update(); // Update position and appearance
                  this.captureCharArr.splice(this.captureCharArr.indexOf(this.captureCharArr[i]),1); // The piece is no longer captured
                  if (gameMode == 'battle') {
                    for (var j = 0; j < this.healthBars.length; j++) {
                      if (this.healthBars[j].name == this.pieces[this.pieces.length-1].name) {
                        this.pieceArray[j].health = this.originalHealth[j];
                        this.healthBars[j].sprite.destroy();
                        this.healthBars[j].update(this.newX, this.newY);
                        this.healthBars[j].sprite = this.add.sprite(this.healthBars[j].x, this.healthBars[j].y,'healthBar');
                        this.healthBars[j].sprite.setDisplaySize(this.pieceArray[j].health, 45);
                      }
                    }
                  }
                  break; // get out of the loop and continue with the code
                }
              }
              // This time, go through the for loop all the way... ALL the characters will be revived
            }
          }
        }

        //Check to see if the player has collected the flag
        if(gameMode == "flag" || gameMode == "tutorial"){ // Check to see that your on a mode where the flag actually appears

          if(this.flag != undefined && this.flag.coord != null && this.flag.coord[0] == this.corrChar.xPos && this.flag.coord[1] == this.corrChar.yPos){
            // Check to see if, first, the flag actually has coordinates, and second, if the coordinates match the player's
            // Remove the flag from the gameboard
            this.powerUpChoordArr[(this.flag.coord[0] * this.boardSize) + this.flag.coord[1]] = false;
            this.flag.coord = null;
            this.flag.sprite.x = 1000;
            if(gameMode == "flag"){ // only change the text score if you're actully playing the game
              this.flagDic["ninja"] ++;
              this.ninjaScoreText.text = this.flagDic["ninja"];
            }
          } else if(this.ninjaFlag != undefined && this.ninjaFlag.coord != null && this.ninjaFlag.coord[0] == this.corrChar.xPos && this.ninjaFlag.coord[1] == this.corrChar.yPos){
            // Check to see if, first, the flag actually has coordinates, and second, if the coordinates match the player's
            // Remove the flag from the gameboard
            this.powerUpChoordArr[(this.ninjaFlag.coord[0] * this.boardSize) + this.ninjaFlag.coord[1]] = false;
            this.ninjaFlag.coord = null;
            this.ninjaFlag.sprite.x = 1000;
            if(gameMode == "tutorial" && this.tutorialIdx == 6){
              if(this.pieces[5].xPos == 3 && this.pieces[5].yPos == 3){ // Make sure that the new ninja doesn't land on top of the pirate
                this.pieces[6].xPos = 4;
                this.pieces[6].yPos = 4;
              } else {
                this.pieces[6].xPos = 3;
                this.pieces[6].yPos = 3;
              }

              this.pieces[6].sprite = this.pieces[6].idleSprite
              this.pieces[6].update();
              this.updateTutorialText();
            }
            if(gameMode == "flag"){ // only change the text score if you're actully playing the game
              this.flagDic["pirate"] ++;
              this.pirateScoreText.text = this.flagDic["pirate"];
            }
          }
        }

        // Check to see if the player has collected the coin
        if(this.coin.coord != null && this.coin.coord[0] == this.corrChar.xPos && this.coin.coord[1] == this.corrChar.yPos){ // If the coin has been collected

          var coinspin = this.sound.add('coinsound').play({volume: 1, loop: false});
          this.powerUpChoordArr[(this.coin.coord[0] * this.boardSize) + this.coin.coord[1]] = false;
          this.coin.coord = null; // Set the coin coordinates to null
          this.coin.sprite.x = 1000; // Make the coin disappear

          if(gameMode != "tutorial"){
            if(this.turn == "pirate"){ // Print whosever turn it is
              this.turnText.text = "Pirate's turn again!";
              this.turnText.setFill("#FF0000");
              this.tweenText(this.turnText);
            } else if(this.turn == "ninja"){
              this.turnText.text = "Ninja's turn again!";
              this.turnText.setFill("#000");
              this.tweenText(this.turnText);
            }
          } else {
            if(this.tutorialIdx == 2){
              // SWITCH PLAYERS
              console.log(this.pieces);
              this.pieces[2].xPos = this.pieces[1].xPos;
              this.pieces[2].yPos = this.pieces[1].yPos;
              this.pieces[2].update();
              this.pieces[1].xPos = 1000;
              this.pieces[1].update();
              this.updateTutorialText();
              this.powerupAppear(this.whirlpool);

            }
          }
        } else { // Otherwise switch turns
          if(gameMode != "tutorial"){
            this.switchTurns(); // switch turns
          }
        }
        // WHIRLPOOL WILL BE EXCLUDED, I put it in its own mode, because it involves a special animation

        // Check for win conditions
        if(gameMode == "king"){
          if(this.captureChar.name == "pirate1"){ //Blackbeard has been captured
            playMusic.stop();
            this.makeWin("ninja");
          } else if(this.captureChar.name == "ninja1"){ //The green ninja has been captured;
            playMusic.stop();
            this.makeWin("pirate");
          }
        } else if(gameMode == "flag"){
          if(this.flagDic["ninja"] == 5){
            playMusic.stop();
            this.makeWin("ninja");
          } else if(this.flagDic["pirate"] == 5){
            playMusic.stop();
            this.makeWin("pirate");
          }
        }
        if(gameMode != "king" && gameMode != "tutorial"){ //in every game mode except for king, you can kill all the other pieces in order to win the game
          this.doesPirate = false;
          this.doesNinja = false;
          // These variables will be set to true once the computer finds a still living pirate or ninja
          for(i = 0; i < this.pieces.length; i ++){

            if(this.pieces[i].type == "pirate"){
              this.doesPirate = true;
            } else if(this.pieces[i].type == "ninja"){
              this.doesNinja = true;
            }
          }

          if(this.doesPirate == false){ // All the pirates are dead
            playMusic.stop();
            this.makeWin("ninja");
          } else if(this.doesNinja == false){
            playMusic.stop();
            this.makeWin("pirate");
          }
        }


        // Set these variables to null, since board is now still again
        this.corrChar = null; // There is no player moving
        this.captureChar = null; // There is no player being captured

        if(gameMode != "tutorial"){

          this.powerupAppear(this.coin); // Generate another coin if the coin has been collected
          if(this.boardSize > 4){ // yeah so Im taking out these powerups in sudden death mode for now because they don't leave enough room for the flag...
            if (gameMode == 'battle') {
              if(Math.floor(Math.random() * 7) == 0){
                this.powerupAppear(this.holyGrail); // Generate another fruit... this appears randomly
              }
              if(Math.floor(Math.random() * 5) == 0){
                this.powerupAppear(this.fruit); // Generate another fruit... this appears randomly
              }
            } else {
              if(Math.floor(Math.random() * 16) == 0){
                this.powerupAppear(this.holyGrail); // Generate another fruit... this appears randomly
              }
              if(Math.floor(Math.random() * 8) == 0){
                this.powerupAppear(this.fruit); // Generate another fruit... this appears randomly
              }
            }
          }
          this.powerupAppear(this.whirlpool);

          if(gameMode == "flag"){
            this.powerupAppear(this.flag);
            this.powerupAppear(this.ninjaFlag);
          }
        }

        this.timePassed = 1000; //reset the timer at the end of each turn.
        if(this.playerMode == this.turn || this.playerMode == "multi"){ // If it is multiplayer or it is the player's turn, give control to the user
          mode = "still"; // Mode is now still - the player can make their move again
          if(gameMode != "tutorial") {
            // reset tutorial text every turn
            this.setDefaultTutorialText();
          }
        } else { // Otherwise give control to the AI
          this.AICount = 0;
          mode = "AI";
        }

        if(gameMode == "tutorial" && this.tutorialIdx == 1){
          this.updateTutorialText();
          // SWITCH PLAYERS
          console.log(this.pieces);
          this.pieces[1].xPos = this.pieces[0].xPos;
          this.pieces[1].yPos = this.pieces[0].yPos;
          this.pieces[1].update();
          this.pieces[0].xPos = 1000;
          this.pieces[0].update();
          this.powerupAppear(this.coin);
          console.log(this.tutorialIdx);
        }
        if(whirlpoolLastFrame == true && gameMode == "tutorial" && this.tutorialIdx == 3){
          // Only do this if you have finished the whirlpool animation
          this.updateTutorialText();
          this.pieces[3].xPos = this.pieces[2].xPos;
          this.pieces[3].yPos = this.pieces[2].yPos;
          this.pieces[3].update();
          this.pieces[2].xPos = 1000;
          this.pieces[2].update();

          // You need to make the fruit appear in an area that's accessable to the player
          // The first two if statements are to make sure the player doesn't land on top of the Fruit
          // The second two if statements are to make sure the player can reach the fruit (since the diagonal)
          // Moving piece can only access half of the board.
          if(this.pieces[3].xPos == 0 && this.pieces[3].yPos == 0){
            this.fruit.coord = [1,0];
            this.fruit.update();
          } else if(this.pieces[3].xPos == 1 && this.pieces[3].yPos == 0){
            this.fruit.coord = [0,0];
            this.fruit.update();
          } else if((this.pieces[3].xPos + this.pieces[3].yPos) % 2 == 0){
            this.fruit.coord = [0,0];
            this.fruit.update();
          } else if((this.pieces[3].xPos + this.pieces[3].yPos) % 2 == 1) {
            this.fruit.coord = [1,0];
            this.fruit.update();
          }

          whirlpoolLastFrame = false;
        }



      } else if(mode == "blink"){
        if(this.blinkCount == 30 * 8){
          this.setDefaultTutorialText();
          if(this.playerMode == "pirate"){
            mode = "still";
            this.stage = "choose";
          } else {

            // Change the turn temporarily so that the AI knows which tiles are threatened
            this.turn = "ninja";
            this.threatenTiles();
            this.turn = "pirate";

            this.AICount = 0;
            mode = "AI";
          }
        } else if(this.blinkCount % 30 == 0){
          if(this.playerMode == "ninja"){
            for(var blinkI = 0; blinkI < this.boardSize; blinkI ++){
              for(var blinkJ = 0; blinkJ < 3; blinkJ ++){
                this.tileBoard[blinkI][blinkJ].switch("ninja");
              }
            }
          } else if(this.playerMode == "pirate"){
            for(var blinkI = 0; blinkI < this.boardSize; blinkI ++){
              for(var blinkJ = this.boardSize - 1; blinkJ > this.boardSize - 4; blinkJ --){
                this.tileBoard[blinkI][blinkJ].switch("pirate");
              }
            }
          }





          this.blinkCount ++;
        } else {
          this.blinkCount ++;
        }
      } else if(mode == "spin"){
        // I made the whirlpool animation an entirely new mode, because it doesn't finish until the character has completely spun
        if(whirlpoolFirstFrame == true){
          this.powerUpChoordArr[(this.whirlpool.coord[0] * this.boardSize) + this.whirlpool.coord[1]] = false;
          this.whirlpool.coord = null;
          this.whirlpool.sprite.x = 1000;
          // The whirlpool disappears and will reappear as usual when all the powerups are regenerated

          // place the sprite on a new random location
          var whirlsound = this.sound.add('whirlsound').play({volume: 1, loop: false});

          while(true){
            this.newX = Math.floor(Math.random() * this.boardSize);
            this.newY = Math.floor(Math.random() * this.boardSize);


            if(this.findCorChar([this.newX, this.newY]).type == null && //If there is no piece in the new spot
            this.powerUpChoordArr[(this.newX * this.boardSize) + this.newY] != true){ //And there is no powerup in the new spot

              this.corrChar.xPos = this.newX; // The y position will be the selected square no matter what
              this.corrChar.yPos = this.newY;
              this.spinCharacter(this.corrChar,this.newX,this.newY); // This function will take care of the whirlpool animation -- spin the character to the new spot
              break;
            }
          }
          whirlpoolFirstFrame = false;
        } else {
          this.corrChar.sprite.angle += 360/10;
        }
      }
    }


    // Make sure every character is on the right depth
    for(i = 0; i < this.pieces.length; i ++){
      if(this.pieces[i] == this.corrChar){ // If the character is currently moving, give them priority
        this.pieces[i].sprite.depth = this.pieces[i].sprite.y + 1;
      } else { // Otherwise, print characters in order of y value
        this.pieces[i].sprite.depth = this.pieces[i].sprite.y;
      }
    }

    // This is the highlight functions, so the tiles you can move will highlight when you hover over each player
    this.mouseX = game.input.mousePointer.x;
    this.mouseY = game.input.mousePointer.y;

    if(this.stage == "choose" && mode == "still"){
      if(this.mouseX > leftMargins
        && this.mouseX < leftMargins + (this.boardSize*tileSize)
        && this.mouseY > upperMargins
        && this.mouseY < upperMargins + (this.boardSize*tileSize)){
          // Check to see if the mouse is on the board in the first placeholder
          this.mouseXPos = Math.floor((this.mouseX - leftMargins) / tileSize);
          this.mouseYPos = Math.floor((this.mouseY - upperMargins) / tileSize);
          this.hoverChar = this.findCorChar([this.mouseXPos, this.mouseYPos]);

          if(this.hoverChar.type != null){
            if(gameMode != "tutorial"){
              if(this.hoverChar.type == this.turn){
                this.tutorialText.text = "Click to move your\ncharacter!"
              } else if(this.hoverChar.type != this.turn) {
                this.tutorialText.text = "This is the other\nteam's piece"
              }
            }
            this.unselectBoard();
            this.selectTiles(this,this.hoverChar,"highlight");
          } else {
            this.hoverItem = this.findCorPowerup([this.mouseXPos,this.mouseYPos]);
            if(this.hoverItem != null && gameMode != "tutorial"){
              this.unselectBoard();
              switch(this.hoverItem){
                case this.coin:
                  this.tutorialText.text = "Coin gives you an\nextra turn";
                  break;
                case this.whirlpool:
                  this.tutorialText.text = "Whirlpool carries you\nto a random spot";
                  break;
                case this.fruit:
                  this.tutorialText.text = "Fruit revives a\nteammate";
                  break;
                case this.holyGrail:
                  this.tutorialText.text = "Holy grail revives the\nwhole team";
                  break;
                case this.flag:
                  if(this.playerMode == "pirate"){
                    this.tutorialText.text = "This is the pirate's\nflag, collect five to win!";
                  } else if(this.playerMode == "ninja"){
                    this.tutorialText.text = "This is the other teams\nflag... protect it.";
                  } else {
                    this.tutorialText.text = "This is the pirate's\nflag!";
                  }
                  break;
                case this.ninjaFlag:
                  if(this.playerMode == "pirate"){
                    this.tutorialText.text = "This is the other teams\nflag... protect it.";
                  } else if(this.playerMode == "ninja"){
                    this.tutorialText.text = "This is the ninja's\nflag, collect five to win!";
                  } else {
                    this.tutorialText.text = "This is the ninja's\nflag!";
                  }
                  break;
              }
            } else {
              this.setDefaultTutorialText();
              this.unselectBoard();
            }
          }
      } else if( (gameMode != "tutorial"
        && this.boardSize == 9
        && this.mouseX > 18
        && this.mouseX < 18 + 40
        && this.mouseY > 520
        && this.mouseY < 520 + 40)

        ||

        (gameMode != "tutorial"
        && this.boardSize != 9
        && this.mouseX > 750
        && this.mouseX < 750 + 40
        && this.mouseY > 520
        && this.mouseY < 520 + 40)

      ){ // If the mouse is over the info text;
          this.tutorialText.text = "Click to disable\ntutorial text";
      } else if((gameMode != "tutorial"
        && this.boardSize == 9
        && this.mouseX > 18
        && this.mouseX < 18 + 40
        && this.mouseY > 470
        && this.mouseY < 470 + 40)

        ||

        (gameMode != "tutorial"
        && this.boardSize != 9
        && this.mouseX > 750
        && this.mouseX < 750 + 40
        && this.mouseY > 470
        && this.mouseY < 470 + 40)

      ){
          this.tutorialText.text = "Click to return to\nthe home screen";
      } else {
        this.setDefaultTutorialText();
        this.unselectBoard();
      }
    }
    // Add a timer.

    if(this.boardSize == 4){
      // The player must be in the part of the game where the characters aren't moving, the player is making their choice, and it is currently the player's turn.
      if((this.stage == "choose" || this.stage == "move") && mode == "still" && (this.turn == this.playerMode || this.playerMode == "multi")){
        if(this.timePassed == 0){
          this.timePassed = 1000;
          // force the player to switch turns if their time is up.
          this.unselectBoard();
          this.switchTurns();
          var error = this.sound.add('Error');
          error.play({volume: 1, loop: false});
          this.stage = "choose";
          if(this.playerMode != "multi"){ // give control to the AI if not in multiplayer mode
            this.AICount = 0;
            mode = "AI";
          }

        } else {
          this.timePassed -= 1;
          this.timerText.text = "Time remaining\n" + this.timePassed;
        }
      } else {
        this.timerText.text = "Please wait...";
      }
    }
    console.log(mode);
  }

  createBoard (){

    // Add the light blue boarder around the board
    this.boardBoarder = this.add.image(leftMargins - 5,upperMargins - 5,"boardBoarder");
    this.boardBoarder.setOrigin(0,0);
    this.boardBoarder.setScale((tileSize*this.boardSize) + 5,(tileSize*this.boardSize) + 5);

    // Draw the tiles, sprites, and powerups
    for(var i = 0; i < this.boardSize; i ++){
      for(var j = 0; j < this.boardSize; j ++){
        // Add a tile
        this.tileBoard[i][j].sprite = this.add.sprite(leftMargins + i*tileSize,upperMargins + j*tileSize,"tiles",0).setInteractive(); // They're all green
        this.tileBoard[i][j].sprite.setOrigin(0,0); // So that the tiles are organized at their top left corner
        this.tileBoard[i][j].sprite.on("pointerup", function(){

          if(this[0].playerMode == "multi" || this[0].turn == this[0].playerMode){ //If it's multiplayer, or the player can move

            // If the player is selecting a square ("choose"), then show the player
            // all the squares they can move to. If they are in the process of moving ("move")
            // then move to that square
            if(this[0].stage == "choose" && mode == "still"){
              this[0].selectTiles(this[0],this[0].findCorChar([this[1],this[2]]));
            } else if(this[0].stage == "move" && mode == "still"){ // If the player is selecting a place to go
              this[0].movePiece(this[0],this[1],this[2]);
            }

          }

        }, [this,i,j]);
      }
    }

    // add the wood texture
    this.woodTexture = this.add.image(leftMargins - 5, upperMargins - 5, "woodTexture").setOrigin(0,0).setScale(((tileSize*this.boardSize) + 5)/580,((tileSize*this.boardSize) + 5)/580);

    // Add the info button
    if(gameMode != "tutorial" && this.boardSize < 9){ //Hard mode and tutorial will not be togglable
      this.info = this.add.image(750, 520, "info").setOrigin(0,0).setScale(1, 1);
      this.backArrow = this.add.sprite(768, 490,'backArrow', 0).setInteractive().setScale(0.2);
    } else if(this.boardSize == 9){ // reposition the buttons for hard mode
      this.info = this.add.image(18, 520, "info").setOrigin(0,0).setScale(1, 1);
      this.backArrow = this.add.sprite(38, 490,'backArrow', 0).setInteractive().setScale(0.2);
    }
    if(gameMode == "tutorial"){
      this.info = this.add.image(10000, 520, "info").setOrigin(0,0).setScale(1, 1);
      this.backArrow = this.add.sprite(768, 490,'backArrow', 0).setInteractive().setScale(0.2);
    }
    this.info.setInteractive();
    this.info.on("pointerup", function(){
      this.infoToggle = !this.infoToggle;
      if(this.infoToggle == true){
        this.tutorialText.x = 10;
      } else if(this.infoToggle == false){
        this.tutorialText.x = 1000;
      }
    }, this);

    this.info.on("over", function(){
      this.tutorialText.text = "Click to disable\ntutorial text";
    }, true);

    this.info.on("out", function(){
      this.setDefaultTutorialText();
    }, true);

    this.backArrow.on("pointerup", function(){
      playMusic.stop();
      this.scene.start('WelcomeScene');
    }, this );

    //this.infotext = this.add.image(leftMargins - 0, upperMargins - 0, "infotext").setOrigin(0,0).setScale(.7, 0.7);
    //this.infotext.x = 450;
    //this.infotext.y = 150;


    this.powerUpChoordArr = [];


    // Create the coin sprite -- which will be changed later
    this.coin = new this.Powerup("coin");
    this.coin.sprite = this.add.sprite(1000,1000,this.coin.name).setOrigin(0.03,0).setScale(0.12);
    this.coin.sprite.anims.play('coin', true);


    this.fruit = new this.Powerup("fruit");
    this.fruit.sprite = this.add.image(1000,1000,this.fruit.name).setOrigin(0,0);


    this.holyGrail = new this.Powerup("holygrail");
    this.holyGrail.sprite = this.add.image(1000,1000,this.holyGrail.name).setOrigin(-0.3,0);

    this.whirlpool = new this.Powerup("whirlpool");
    this.whirlpool.sprite = this.add.sprite(1000, 1000, "whirlpool").setOrigin(0.15,0.15).setScale(0.07);
    this.whirlpool.sprite.anims.play('whirlpool', true);
    /*this.tweens.add({
      targets: 'whirlpool',
      angle: 45,
      duration: Math.random()*3000,
      ease: "cubic.easeOut",
      repeat: -1
    });*/

    if(gameMode == "flag"){
      this.flag = new this.Powerup("flag");
      this.flag.sprite = this.add.image(1000,1000,this.flag.name).setOrigin(0,0);
      this.ninjaFlag = new this.Powerup("ninjaflag");
      this.ninjaFlag.sprite = this.add.image(1000,1000,this.ninjaFlag.name).setOrigin(0,0);
      this.powerupAppear(this.flag);
      this.powerupAppear(this.ninjaFlag);
    }
    if(gameMode != "tutorial"){
      this.powerupAppear(this.coin); // Make the first coin appear
      if(this.boardSize > 4){
        this.powerupAppear(this.fruit); // Make the first fruit appear
      }
      this.powerupAppear(this.whirlpool); // Make the first whirlpool appear
    }


    // Add all the sprites on the board
    for (var i = 0; i < this.pieces.length; i ++){
        // add the actual sprites... they must be sized correctly
        this.pieces[i].idleSprite = this.add.sprite(1000,1000,this.pieces[i].name + "idle").setOrigin(this.pieces[i].originX,this.pieces[i].originY).setScale(this.pieces[i].scale,this.pieces[i].scale);
        this.pieces[i].walkingSprite = this.add.sprite(1000,1000,this.pieces[i].name + "walk").setOrigin(this.pieces[i].originX,this.pieces[i].originY).setScale(this.pieces[i].scale,this.pieces[i].scale);
        this.pieces[i].attackSprite = this.add.sprite(1000,1000,this.pieces[i].name + "attack").setOrigin(this.pieces[i].originX + 0.05,this.pieces[i].originY).setScale(this.pieces[i].scale,this.pieces[i].scale);
        this.pieces[i].dieSprite = this.add.sprite(1000,1000,this.pieces[i].name +  "die").setOrigin(this.pieces[i].originX + .1,this.pieces[i].originY).setScale(this.pieces[i].scale,this.pieces[i].scale);
        this.pieces[i].hurtSprite = this.add.sprite(1000,1000,this.pieces[i].name +  "hurt").setOrigin(this.pieces[i].originX + .1,this.pieces[i].originY).setScale(this.pieces[i].scale,this.pieces[i].scale);
        this.pieces[i].idleSprite.anims.play(this.pieces[i].name + "idle", true);
        this.pieces[i].walkingSprite.anims.play(this.pieces[i].name + "walk", true);
        this.pieces[i].attackSprite.anims.play(this.pieces[i].name + "attack", true);
        this.pieces[i].changeFace(this.pieces[i].idleSprite); // All pieces start out as the idle sprite
    }

    // Finally add the tutorial text
    if(gameMode != "tutorial"){
      if(this.playerMode == "multi"){
        this.tutorialText = this.add.text(10,50 + upperMargins, "",{ fill: "#000", font: "12px Arial" });
        this.setDefaultTutorialText();
      } else {
        if(this.boardSize == 9){
          this.tutorialText = this.add.text(1000,50, "You are on the\nblinking side...",{ fill: "#000", font: "12px Arial" });
        } else {
          this.tutorialText = this.add.text(10,50, "You are on the\nblinking side...",{ fill: "#000", font: "12px Arial" });
        }
      }
    }

    if(this.boardSize == 4){
      this.timePassed = 1000;
      this.timerText = this.add.text(10,90, "", {fill: "#000"});
    }

    console.log(this.tutorialIdx);
  }

  unselectBoard(style = "deselect"){ // function that deselects every square on the board
    for(var x = 0; x < this.boardSize; x++){
      for(var y = 0; y < this.boardSize; y ++){
        if(style == "deselect"){
          this.tileBoard[x][y].deselect();
        } else if(style == "unthreaten"){
          this.tileBoard[x][y].unthreaten();
        }
      }
    }
  }

  doesContain(a,b){ // Given table a and value b, does table a have value b?
    for(var z = 0; z < a.length; z ++){
      if(a[z] == b){
        return true;
      }
    }
    return false;
  }

  switchTurns(){ // Switches turns
    if(this.playerMode == "multi"){ // change as usual
      if(this.turn == "pirate"){
        this.turn = "ninja";
        this.turnText.text = "Ninja's turn!";
        this.turnText.setFill("#000");
        this.tweenText(this.turnText);
      } else if(this.turn == "ninja"){
        this.turn = "pirate";
        this.turnText.text = "Pirate's turn!";
        this.turnText.setFill("#FF0000");
        this.tweenText(this.turnText);
      }
    } else if(this.playerMode == "pirate"){
      if(this.turn == "pirate"){
        this.turn = "ninja";
        this.turnText.text = "Ninjas are moving...";
        this.turnText.setFill("#000");
        this.tweenText(this.turnText);
      } else if(this.turn == "ninja"){
        this.turn = "pirate";
        this.turnText.text = "Pirate's turn!";
        this.turnText.setFill("#FF0000");
        this.tweenText(this.turnText);
      }
    } else if(this.playerMode == "ninja"){
      if(this.turn == "pirate"){
        this.turn = "ninja";
        this.turnText.text = "Ninja's turn!";
        this.turnText.setFill("#000");
        this.tweenText(this.turnText);
      } else if(this.turn == "ninja"){
        this.turn = "pirate";
        this.turnText.text = "Pirates are moving...";
        this.turnText.setFill("#FF0000");
        this.tweenText(this.turnText);
      }
    }
  }

  findCorChar(loc){ //given coordinates, find the cooresponding piece
    for(var c = 0; c < this.pieces.length; c ++){
      if(this.pieces[c].xPos == loc[0] && this.pieces[c].yPos == loc[1]){
        return this.pieces[c];
      }
    }
    return this.emptyPiece;
  }

  findCorPowerup(loc){ //given coordinates, find the cooresponding powerUp
    if(this.coin.coord != null && this.coin.coord[0] == loc[0] && this.coin.coord[1] == loc[1]){
      return this.coin;
    } else if(this.fruit.coord != null && this.fruit.coord[0] == loc[0] && this.fruit.coord[1] == loc[1]){
      return this.fruit;
    } else if(this.holyGrail.coord != null && this.holyGrail.coord[0] == loc[0] && this.holyGrail.coord[1] == loc[1]){
      return this.holyGrail;
    } else if(this.whirlpool.coord != null && this.whirlpool.coord[0] == loc[0] && this.whirlpool.coord[1] == loc[1]){
      return this.whirlpool;
    } else if(gameMode == "flag" && this.flag.coord != null && this.flag.coord[0] == loc[0] && this.flag.coord[1] == loc[1]){
      return this.flag;
    } else if(gameMode == "flag" && this.ninjaFlag.coord != null && this.ninjaFlag.coord[0] == loc[0] && this.ninjaFlag.coord[1] == loc[1]){
      return this.ninjaFlag;
    } else {
      return null;
    }
  }

  powerupAppear(powerUp){ // Make the powerUp appear on the board in an empty, randomly generated location

    var x;
    var y;

    if(powerUp.coord == null){
      if(gameMode == "flag" && powerUp == this.flag && this.boardSize > 4){ // pirates side... on the bottom
        var generateRange = function(board){ return board.boardSize - 3 + Math.floor(Math.random() * 3); }
      } else if(gameMode == "flag" && powerUp == this.ninjaFlag && this.boardSize > 4){
        var generateRange = function(board){ return Math.floor(Math.random() * 3); }
      } else {
        var generateRange = function(board){ return Math.floor(Math.random() * board.boardSize) }
      }

      while(true){
        x = Math.floor(Math.random() * this.boardSize);
        y = generateRange(this);
        if(this.findCorChar([x,y]).type == null && this.powerUpChoordArr[(x * this.boardSize) + y] != true){ // If there isn't already a player
          powerUp.coord = [x,y];
          powerUp.update();
          this.powerUpChoordArr[(x * this.boardSize) + y] = true; // Let the program know that that place is taken
          break;
        }
      }

    }
  }

  threatenTiles(){
    this.unselectBoard("unthreaten"); // This unthreatens all the tiles previously threatened
    console.log(this.pieces)
    for(var tp = 0; tp < this.pieces.length; tp ++){
      this.selectTiles(this, this.pieces[tp], "threaten");
    }
  }

  selectTiles(board, centerChar, selectType = "select"){ // Selects all the legal tiles that piece at xPos, yPos can move to
    //board.corrChar = board.findCorChar([xPos,yPos]); // Find the chorresponding piece given coordinate

    // If the square is a playable piece
    if(centerChar.type == board.turn || selectType == "highlight"){ // If the piece is on the player's team
      // If just highligting, it doesn't matter that the character in question is part of your turn
      if(selectType == "select"){
        // Only change the stage if the player is actually selecting, and not just highlighting
        this.stage = "move"; // Set the mode to move
        this.selectedCharacter = centerChar;
        this.corrChar = centerChar;
        // Store the selected player in the variable "selectedCharacter"
        // selected Character is now a piece
      }



      // Select all the squares that they player can move to.
      for(var a = 0; a < centerChar.movement.length; a ++){ // Go through all the squares in the piece's movement array
        if(
          centerChar.xPos + centerChar.movement[a][0] < board.boardSize &&
          centerChar.xPos + centerChar.movement[a][0] >= 0 &&
          centerChar.yPos + centerChar.movement[a][1] < board.boardSize &&
          centerChar.yPos + centerChar.movement[a][1] >= 0
        ){ // Checks to see if the following piece is on the board in the first place
          if((board.findCorChar([centerChar.xPos + centerChar.movement[a][0],centerChar.yPos + centerChar.movement[a][1]]).type != centerChar.type) || selectType == "threaten"){
            // This is to make sure the player doesn't capture their own piece
            var centerPowerup = board.findCorPowerup([centerChar.xPos + centerChar.movement[a][0],centerChar.yPos + centerChar.movement[a][1]]);

            if((centerChar.type == "ninja" && centerPowerup != this.ninjaFlag) || (centerChar.type == "pirate" && centerPowerup != this.flag) || (gameMode != "flag")){
            // This is to make sure you don't capture your own flag... feel free to comment out to add the penalty of capturing your own flag for the other team.
              if(selectType == "select"){
                board.tileBoard[centerChar.xPos + centerChar.movement[a][0]][centerChar.yPos + centerChar.movement[a][1]].select(board.turn); // Make the tile pink
              } else if(selectType == "highlight"){ // If you are just highlighting, highlight
                board.tileBoard[centerChar.xPos + centerChar.movement[a][0]][centerChar.yPos + centerChar.movement[a][1]].highlight(centerChar.type);
              } else if(selectType == "threaten"){
                board.tileBoard[centerChar.xPos + centerChar.movement[a][0]][centerChar.yPos + centerChar.movement[a][1]].threaten();
              }
            }
          }
        }
      }
      // Sometimes you can navigate a tutorial by selecting the player
      if(centerChar != null && gameMode == "tutorial"){
        if(board.tutorialIdx == 0 && centerChar != null && selectType == "select"){
          board.updateTutorialText();
        }
      }

    }
  }

  movePiece(board, xPos, yPos){ // Move corrChar to xPos, yPos
    // If the player clicks on a tile that constitutes a legal move...
    if(gameMode != "tutorial"){
      this.tutorialText.text = "Moving...";
    }
    if(board.tileBoard[xPos][yPos].selected == true){
      board.captureChar = board.findCorChar([xPos,yPos]); // Find any piece the player will potentially capture
      board.corrChar.changeFace(board.corrChar.walkingSprite); // The player begins walking
      this.originalX = board.corrChar.xPos;
      this.originalY = board.corrChar.yPos;
      board.corrChar.yPos = yPos; // The y position will be the selected square no matter what

      // Control the animation and the tweens
      mode = "tweening";
      if(board.captureChar.type != null){ //If the player is capturing

        // The player will move one square to the left or right of the captured char
        if(board.corrChar.xPos < board.captureChar.xPos){
          board.corrChar.xPos = xPos - 1; // move the player 1 square to the left of the captured piece
          board.corrChar.orientation = "right";
          board.corrChar.sprite.flipX = false; // Go ahead and change the current sprite, since the update is only after the walking animation
        } else if(board.corrChar.xPos > board.captureChar.xPos){ //Otherwise move the player 1 square to the right of the captured character
          board.corrChar.xPos = xPos + 1;
          board.corrChar.orientation = "left";
          board.corrChar.sprite.flipX = true;
        } else if(board.corrChar.xPos == board.captureChar.xPos){

          if(board.captureChar.xPos == 0){ // If the captured piece is on the left most part of the board, move the player to the right of the piece to avoid walking off the board
            board.corrChar.xPos = xPos + 1;
            board.corrChar.orientation = "left";
            board.corrChar.sprite.flipX = false;
          } else { // Otherwise... the default is always going to the left of the piece
            board.corrChar.xPos = xPos - 1;
            board.corrChar.orientation = "right";
            board.corrChar.sprite.flipX = true;
          }

        }

        // Move the player:
        board.tweens.add({
          targets: board.corrChar.sprite,
          x: leftMargins + board.corrChar.xPos * tileSize,
          y: upperMargins + board.corrChar.yPos * tileSize,
          duration: 1000,
          onComplete: function(){
            mode = "attack"; // this will trigger the "attack" if statement in update
          }
        });
        if (gameMode == 'battle') {
          for (var i = 0; i < this.healthBars.length; i++) {
            if (this.healthBars[i].name == board.corrChar.name) {
              //this.healthBars[i].update(xPos, yPos);
              board.tweens.add({
                targets: this.healthBars[i].sprite,
                x: 32 + leftMargins + board.corrChar.xPos * tileSize,
                y: upperMargins + board.corrChar.yPos * tileSize,
                duration: 1000,
                onComplete: function(){
                  mode = "attack"; // this will trigger the "finished" if statement in update
                }
              });
            }
          }
        }
      } else { // If the player is moving like normal

        // Flip the player around
        if(board.corrChar.xPos < xPos){
          board.corrChar.orientation = "right";
          board.corrChar.sprite.flipX = false;
        } else if(board.corrChar.xPos > xPos){
          board.corrChar.orientation = "left";
          board.corrChar.sprite.flipX = true;
        }

        board.corrChar.xPos = xPos; // move the player to the selected square

        // Check to see if the player is about to eat a whirlpool... if so, send player to the spin animations
        if(board.whirlpool.coord != null && board.whirlpool.coord[0] == board.corrChar.xPos && board.whirlpool.coord[1] == board.corrChar.yPos){
          whirlpoolFirstFrame = true; // This sets up the program to perform the all the functions on the first frame of the whirlpool animation
        }

        if (gameMode == 'battle') {
          for (var i = 0; i < this.healthBars.length; i++) {
            if (this.healthBars[i].name == board.corrChar.name) {
              this.healthBars[i].update(xPos, yPos);

              board.tweens.add({
                targets: board.corrChar.sprite,
                x: leftMargins + board.corrChar.xPos * tileSize,
                y: upperMargins + board.corrChar.yPos * tileSize,
                duration: 1000,
                onComplete: function(){
                  if(whirlpoolFirstFrame == true){
                    // this is essentially telling the program that your ready to do the
                    // spin animation, so that the program knows that you want to do the
                    // spin animation in the first place
                    mode = "spin"
                  } else {
                    mode = "finish";
                  }
                }
              });
              board.tweens.add({
                targets: board.healthBars[i].sprite,
                x: this.healthBars[i].x,
                y: this.healthBars[i].y,
                duration: 1000,
              });
            }
          }
        } else {
          board.tweens.add({
            targets: board.corrChar.sprite,
            x: leftMargins + board.corrChar.xPos * tileSize,
            y: upperMargins + board.corrChar.yPos * tileSize,
            duration: 1000,
            onComplete: function(){
              if(whirlpoolFirstFrame == true){
                mode = "spin"
              } else {
                mode = "finish";
              }
            }
          });
        }

      }

      // Reset selected character
      board.selectedCharacter = null;
      // Make all the squares are unselected
      board.unselectBoard();


      board.stage = "choose"; // Make it so that the player can choose a tile again

    } else {
      // deselect tiles if player makes invalid move
      board.unselectBoard();
      var error = this.sound.add('Error')
      error.play({volume: 1, loop: false});
      board.stage = "choose";
    }
  }

  updateTutorialText(){
    this.tutorialIdx ++;
    this.tutorialText.text = this.tutorialTextArr[this.tutorialIdx];
    console.log(this.tutorialIdx);
    console.log(this.pieces);
  }

  findBestMoves(piecesArr, itemArr, depth){ // I'm testing this right now -- this will be a recursive function that looks ahead while evaluating each move for the AI's team... returns an array with a piece and its movement
    if(depth == 0){
      return [null,null,null,0]; // You aren't adding any points -- end of the line.
    } else {
      // Literally go through every possible move and calculate its worth
      // This is where the AI "thinks"

      var points = {};
      // this will store all the moves, index being their total worth. So points[5] will be
      // a move that ranked 5 points. This will be in the form of an array: [piece, x movmenet, y movement]

      // First, with for loops, go through every piece of every turn
      for(var i = 0; i < piecesArr.length; i ++){
        if(piecesArr[i].type == this.turn){
          for(var j = 0; j < piecesArr[i].movement.length; j ++){

            // These represent the new coordinates
            var newX = piecesArr[i].xPos + piecesArr[i].movement[j][0];
            var newY = piecesArr[i].yPos + piecesArr[i].movement[j][1];

            // Check for any pieces that you would potentially capture
            this.capturePiece = this.findCorChar([
              piecesArr[i].xPos + piecesArr[i].movement[j][0],
              piecesArr[i].yPos + piecesArr[i].movement[j][1]
            ])

            var foundPowerup = this.findCorPowerup([
              piecesArr[i].xPos + piecesArr[i].movement[j][0],
              piecesArr[i].yPos + piecesArr[i].movement[j][1]
            ]); // will find any powerup that is eaten

            // Check to see if the piece is not moving off the board, or capturing its own piece, or capturing it's own flag
            if(newX >= 0
              && newX < this.boardSize
              && newY >= 0
              && newY < this.boardSize
              && this.capturePiece.type != this.turn
            && ((this.turn == "pirate" && foundPowerup != this.flag) ||
                (this.turn == "ninja" && foundPowerup != this.ninjaFlag) ||
                gameMode != "flag")
              ){

              // Create an imaginary board to move your pieces on
              var newPiecesArr = JSON.parse(JSON.stringify(piecesArr));
              var newItemsArr = JSON.parse(JSON.stringify(itemArr));

              // Move your piece on the imaginary board
              newPiecesArr[i].xPos += newPiecesArr[i].movement[j][0];
              newPiecesArr[i].yPos += newPiecesArr[i].movement[j][1];

              // Now it's time to calculate the worth of each move.

              var pointsIdx = 0; // represents the value of each move...

              // Penalty points for if you land in a threatened zone, and bonus points for if you evade getting captured... this is not for looking moves ahead though...

              if(this.tileBoard[newX][newY].threatened == true){
                pointsIdx -= 5;
              } else {
                // If not going into a threatened zone, add a defense bonus if you are moving out of a threatened zone
                if(this.tileBoard[piecesArr[i].xPos][piecesArr[i].yPos].threatened == true){
                  // so if you can avoid getting captured, it's a pretty good move.
                  if(gameMode == "king" && (piecesArr[i].name == "pirate1" || piecesArr[i].name == "ninja1")){
                    // in king mode, saving your king is REALLY important....
                    pointsIdx += 6;
                  } else {
                    // Otherwise get out of there!
                    pointsIdx += 5;
                  }
                }
              }

              // Now lets add points for capturing pieces and powerups


              if(this.capturePiece.type != null){
                // If you can capture a piece, do it.
                if(gameMode == "king" && (this.capturePiece.name == "ninja1" || this.capturePiece.name == "pirate1")){
                  // highest priority is king
                  pointsIdx += 7;
                } else {
                  pointsIdx += 6;
                  // Note, the array has "this.pieces" in it instead of "pieceArr", because when you JSONify everything, it gets rid of functions... which are absolutely necissary
                  // Also note for improvement: make the king worth more points in capture the king mode
                }
              } else {
                // Otherwise check for powerups
                switch(foundPowerup){
                  case this.coin:
                    newItemsArr.splice(this.coin,1);
                    pointsIdx += 2;
                    break;
                  case this.fruit:
                    if(this.hasBeenCaptured(this.turn)){
                      // only get a fruit if your piece has been captured
                      newItemsArr.splice(this.fruit,1);
                      pointsIdx += 3;
                    }
                    break;
                  case this.whirlpool:
                    newItemsArr.splice(this.whirlpool,1);
                    pointsIdx += 1;
                    break;
                  case this.holyGrail:
                    if(this.hasBeenCaptured(this.turn)){
                      // only get a holygrail if your piece has been captured
                      newItemsArr.splice(this.holyGrail,1);
                      pointsIdx += 4;
                    }
                    break;
                  case this.flag:
                    // only try to capture the flag if it's the other teams flag
                    if(this.turn == "ninja"){
                      newItemsArr.splice(this.flag,1);
                      pointsIdx += 6;
                    }
                    break;
                  case this.ninjaFlag:
                    // only try to capture the flag if it's the other teams flag
                    if(this.turn == "pirate"){
                      newItemsArr.splice(this.ninjaFlag,1);
                      pointsIdx += 6;
                    }
                    break;
                  case null:
                    break;
                }
              }
              pointsIdx += this.findBestMoves(newPiecesArr, newItemsArr, depth-1)[3]; // Add bonus if you can make a really good move your next turn
              points[pointsIdx] = [this.pieces[i],piecesArr[i].movement[j][0],piecesArr[i].movement[j][1],pointsIdx];
            }

          }
        }
      }

      console.log(points);

      //Now, go through each move, and find the move with the best points
      if(points == {}){ //If there were no good moves
        // NOTE: This is not ideal, since it doesn't take into account negative indices of "points"
        // I will find a better way to get the most ideal move in the future, but for now
        // I'm just leaving it as... if all the potential moves suck (negative points), just move randomly...
        // Just so the game doesn't crash
        console.log("no good moves");
        return [null,null,null,0];
      } else {
        var bestMove = [null,null,null,0]; // This shouldn't ever happen, but if there is no max, then just return a null array
        var minPoints = -1000000;

        for(var f in points){
          // If you found a record high in points, set the bar higher, and record which move broke the record
          if(f > minPoints){
            minPoints = f;
            bestMove = points[f];
          }
        }
        return bestMove;

      }

    }
  }

  hasBeenCaptured(turn){ // Given turn "pirate" or "ninja", will return false if any of the side's pieces have been captured and true if none of the pieces have been Captured
    // Note for improvement: split captureCharArr into a pirate jail and a ninja jail
    for(var cap = 0; cap < this.captureCharArr.length; cap ++){
      if(this.captureCharArr[cap].type == turn){
        return true;
      }
    }

    return false;
  }

  setDefaultTutorialText(){
    // This function will reset the tutorial text, only when the game is not in tutorial mode
    if(gameMode != "tutorial"){
      this.tutorialText.text = "Hover over something to\nsee what it does!"
    }
  }

  spinCharacter(character,xPos,yPos){
    console.log("PUT THE SPIN ANIMATION HERE");
    mode = "spin";
    // Move the player:
    this.tweens.add({
      targets: character.sprite,
      x: leftMargins + xPos * tileSize,
      y: upperMargins + yPos * tileSize,
      duration: 500,
      onComplete: function(){
        character.update();
        character.sprite.angle = 0;
        mode = "finish";
        whirlpoolLastFrame = true;
      }
    });

    //Move healthBars
    if (gameMode == 'battle') { // Take care of the health bars too
      for (var i = 0; i < this.healthBars.length; i++) {
        if (this.healthBars[i].name == this.corrChar.name) { // Go through each healthbar, and find the player's health bar
          this.tweens.add({
            targets: this.healthBars[i].sprite,
            x: 32 + leftMargins + xPos * tileSize,
            y: upperMargins + yPos * tileSize,
            duration: 500
          });
        }
      }
    }
  }

  tweenText(text) {
    this.tweens.add({
      targets: text,
      x: 10,
      y: 12,
      delay: 300,
      hold: 1100,
      duration: 900,
      yoyo: true,
      ease: 'expo'
    });
  }

  makeWin(side){
    hasWonSide = side;

    // So that nothing can happen during the animation
    mode = "winning";
    this.stage = "winning";

    playMusic.stop();
    this.crashSound.play();
    this.cameras.main.zoomTo(20,2500,"Cubic.easeIn");
    var flashofWhite = this.add.image(this.centerX, this.centerY, 'flashofWhite');
    flashofWhite.alpha = 0;
    this.tweens.add({
      targets: flashofWhite,
      alpha: 1,
      duration: 2500,
      ease: 'Cubic.easeIn',
      onComplete: function(){
        hasWon = true;
      }
    });
  }
}
