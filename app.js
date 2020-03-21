var myGamePiece=[];
var cols = [0,0,0,0,0,0,0];
var turn = 0;

function startGame() {
  myGameArea.start();
  var i,j ;

  for (i=6; i>=0; i--)
  {
    for (j=5; j>=0; j--)
    {
      var obj = new component(50,50,"black",60*i+85, 60*j+70);
      myGamePiece.push(obj);
    }
  }
}

function changeColor(piece,pos,color){
  piece[pos].color=color;
  ctx = myGameArea.context;
  ctx.fillStyle = color;
  ctx.fillRect(piece[pos].x, piece[pos].y, piece[pos].width, piece[pos].height);
}

function randplay(){
  var i;
  var randnum, pos;

  randnum = Math.floor(Math.random()*7);
  if(cols[randnum]<6)
  {
    pos = randnum*6 + cols[randnum];
    cols[randnum] += 1;
    if(turn==0)
    {
      changeColor(myGamePiece,pos,"blue");
      turn = 1;
    }
    else
    {
      changeColor(myGamePiece,pos,"red");
      turn = 0;
    }

  }
  var board = boardState();
  checkwinner(board);

}

function checkwinner(board){

  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status==200){
      var res = xhr.responseText;
      if(res == '-1' || res =='1'){
	clearInterval(myVar);
	if(res == '1')
	  alert("Blue Won");
	else
	  alert("Red Won")
      }
    }
  };

  xhr.open("POST","http://localhost:5000/checkwin",true);

  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({"gameState": board.toString()}));

}


function boardState(){
  var board = [];
  var i;
  for (i=0; i<42; i++)
  {
    console.log(myGamePiece[i].colo)
    if(myGamePiece[i].color=='black')
      board.push(0);
    else if(myGamePiece[i].color=='blue')
      board.push(1);
    else
      board.push(-1);
  }
  console.log(board);
  return board;
}

function component(width, height, color, x, y){
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.color = color;
  ctx = myGameArea.context;
  ctx.fillStyle = color;
  ctx.fillRect(this.x, this.y, this.width, this.height)
}

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 580;
    this.canvas.height = 500;
    this.context = this.canvas.getContext("2d");
    document.getElementById("canvas-container").appendChild(this.canvas);
  }
}
