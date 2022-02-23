switch(this.number){
  //Cases 1 - 5 are Pirates' turn, Cases 6-10 are Ninja moves
  case 0: //King (P)
    this.type = "pirate";
    this.movement = [[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,1],[1,1],[-1,-1]];
    break;
  case 1: //Queen (P)
    this.type = "pirate";
    this.movement = [[1,-1],[-1,1],[1,1],[-1,-1],[2,2],[-2,-2],[2,-2],[-2,2],[3,3],[-3,-3],[3,-3],[-3,3],[1,0],[-1,0],[0,1],[0,-1],[2,0],[-2,0],[0,2],[0,-2],[3,0],[-3,0],[0,3],[0,-3]];
  case 2: //Bishop (P)
    this.type = "pirate";
    this.movement = [[1,-1],[-1,1],[1,1],[-1,-1],[2,2],[-2,-2],[2,-2],[-2,2],[3,3],[-3,-3],[3,-3],[-3,3],[4,4],[-4,-4],[4,-4],[-4,4],[5,5],[-5,-5],[5,-5],[-5,5],[6,6],[-6,-6],[6,-6],[-6,6],[7,7],[-7,-7],[7,-7],[-7,7]];
    break;
  case 3://Castle (P)
    this.type = "pirate"
    [1,0],[-1,0],[0,1],[0,-1],[2,0],[-2,0],[0,2],[0,-2],[3,0],[-3,0],[0,3],[0,-3],[4,0],[-4,0],[0,4],[0,-4],[5,0],[-5,0],[0,5],[0,-5],[6,0],[-6,0],[0,6],[0,-6],[7,0],[-7,0],[0,7],[0,-7]
    break;
  case 4: //Knight (P)
    this.type = "pirate";
    this.movement = [[1,2],[2,1],[-1,2],[2,-1],[-2,1],[2,-1],[-2,-1],[-1,-2]];
    break;
  case 5://pawn (P)
    this.type = "pirate";
    this.movement = [[1,0],[-1,0],[0,1],[0,-1]];
    break;
  case 6: //King (N)
    this.type = "ninja";
    this.movement = [[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,1],[1,1],[-1,-1]];
    break;
  case 7: //Queen (N)
    this.type = "ninja";
    this.movement = [[1,-1],[-1,1],[1,1],[-1,-1],[2,2],[-2,-2],[2,-2],[-2,2],[3,3],[-3,-3],[3,-3],[-3,3],[1,0],[-1,0],[0,1],[0,-1],[2,0],[-2,0],[0,2],[0,-2],[3,0],[-3,0],[0,3],[0,-3]];
    break;
  case 8: //Bishop (N)
    this.type = "ninja";
    this.movement = [[1,-1],[-1,1],[1,1],[-1,-1],[2,2],[-2,-2],[2,-2],[-2,2],[3,3],[-3,-3],[3,-3],[-3,3],[4,4],[-4,-4],[4,-4],[-4,4],[5,5],[-5,-5],[5,-5],[-5,5],[6,6],[-6,-6],[6,-6],[-6,6],[7,7],[-7,-7],[7,-7],[-7,7]];
    break;
  case 9://Castle (N)
    this.type = "ninja"
    this.movement = [1,0],[-1,0],[0,1],[0,-1],[2,0],[-2,0],[0,2],[0,-2],[3,0],[-3,0],[0,3],[0,-3],[4,0],[-4,0],[0,4],[0,-4],[5,0],[-5,0],[0,5],[0,-5],[6,0],[-6,0],[0,6],[0,-6],[7,0],[-7,0],[0,7],[0,-7]
    break;
  case 10: //Knight (N)
    this.type = "ninja";
    this.movement = [[1,2],[2,1],[-1,2],[2,-1],[-2,1],[2,-1],[-2,-1],[-1,-2]];
    break;
  case 11://Pawn (N)
    this.type = "ninja";
    this.movement = [[1,0],[-1,0],[0,1],[0,-1]];
    break;
  default:
    this.type = null;
    this.movement = null;
    break;
}


defineMovement(){


}
