var myGamePiece=[];
var cols = [0,0,0,0,0,0,0];
var turn = 1;
var flag = 0;
var win = 0;
var move = -1;
var n=2;
var n1=2;
var valid=1;

if(!("Computer" in sessionStorage))
  sessionStorage.setItem("Computer","0");
if(!("User" in sessionStorage))
  sessionStorage.setItem("User","0");

xhr = new XMLHttpRequest();

function startGame() {
  var i,j ;

  for (j=0; j<=5; j++)
  {
    for (i=0; i<=6; i++)
    {
      var obj = new component("black");
      myGamePiece.push(obj);
    }
  }

  displaywins();
}


function changeColor(piece,pos,color){
  piece[pos].color=color;
  var n = pos.toString();
  var a = "a".concat(n);
  var b = "circle ".concat(color)
  document.getElementById(a).className = b;
}


function play(){
  var pos;

    if(turn==0 && valid==1)
    {


      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status==200){
          if(flag == 0){
            var move = xhr.responseText;
            move = parseInt(move)
            console.log(move);
            if(cols[move]<6)
            {
              pos = move + (5-cols[move])*7;
              cols[move] += 1;
              changeColor(myGamePiece,pos,"yellow");
            }
            var board = boardState();
            checkwinner(board);
            disableButton();
            flag = 1;
            turn=1;
            n=2;
          }
        }
      };
      var board = boardState();
      xhr.timeout=5000;
      xhr.ontimeout=expbackoff;
      xhr.open("POST","http://localhost:5000/getmove",true);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify({"gameState": board.toString()}));


    }
    else if(turn==1 && valid==1)
    {
      if(move == -1){
        alert("Your turn");
      }
      else{
        if(cols[move]<6)
        {
          pos = move + (5-cols[move])*7;
          cols[move] += 1;
          changeColor(myGamePiece,pos,"red");
          flag = 0;
          move = -1;
          turn = 0;
          var board = boardState();
          checkwinner(board);
          disableButton();
          play();
        }
      }
    }

}


function checkwinner(board){
  xhr2 = new XMLHttpRequest();
  xhr2.onreadystatechange = function(){
    if(xhr2.readyState == 4 && xhr2.status==200){
      var res = xhr2.responseText;
      var res = parseInt(res);
      if(res == -1 || res == 1){
        if(res == 1 && valid==1)
	{
	  valid=0;
          alert("Computer Won");
          var x=sessionStorage.getItem("Computer");
          x=parseInt(x);
          x=x+1;
          sessionStorage.setItem("Computer",x.toString());
	  setTimeout(function(){ location.reload(true); }, 5000);
	}

        else
	{
	  if(valid == 1){
	    valid=0;
            alert("User Won");
            var x=sessionStorage.getItem("User");
            x=parseInt(x);
            x=x+1;
            sessionStorage.setItem("User",x.toString());
            setTimeout(function(){ location.reload(true); }, 5000);
	  }
	}
      }
    n1=2;
    }
  };

  xhr2.open("POST","http://localhost:5000/test_check",true);
  xhr2.timeout=5000;
  xhr2.ontimeout=function(){expbackoff1(board);};
  xhr2.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr2.send(JSON.stringify({"gameState": board.toString(),"format":'0'}));

}


function boardState(){
  var board = [];
  var i;
  for (i=0; i<42; i++)
  {
    if(myGamePiece[i].color=='black')
      board.push(0);
    else if(myGamePiece[i].color=='yellow')
      board.push(1);
    else
      board.push(-1);
  }
  console.log(board);
  return board;
}

function component(color){
  this.color = color;
}

function choose(num){
  if(turn == 1){
    move = num;
    play();
  }
}

function displaywins(){
  var comp= document.getElementById("comp");
  var user= document.getElementById("user");

  comp.innerHTML= "Computer:  "+sessionStorage.getItem("Computer");
  user.innerHTML= "User:  "+sessionStorage.getItem("User");
}

function expbackoff(){
  console.log("failed");
	n=n*2;
	setTimeout(play,n*1000);
}


function expbackoff1(board){
  console.log("failed");
  console.log(board);
	n1=n1*2;
	setTimeout(function(board){checkwinner(board);},n1*1000);
}

function hoverin(num){
  var n = (7*(5-cols[num])+num).toString();
  var a = "a".concat(n);
  document.getElementById(a).className = "circle #ef9a9a red lighten-3";
}

function hoverout(num){
  var n = (7*(5-cols[num])+num).toString();
  var a = "a".concat(n);
  document.getElementById(a).className = "circle black";
}

function disableButton(){
  var temp=0;
  for(i=0;i<7;i++)
  {
    if(cols[i]==6)
    {
      temp+=1;
      var a = document.getElementById("b".concat(i)).className;
      if(!(a.includes("disabled")))
        document.getElementById("b".concat(i)).className = a.concat(" disabled");
    }
  }
  if(temp==6)
	   {
	     alert("Draw");
	     setTimeout(function(){ location.reload(true); }, 5000);
	   }
}

function load() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      myFunction(this);
    }
  };
  xhttp.open("GET", "http://localhost/wt2/project/connect4-v2/RSS.php", true);
  xhttp.send();
}

function myFunction(xml) {
  var xmlDoc = xml.responseXML;
  for (i = 0;i < 4;i++){
    var node = document.createElement("li");
    var x = xmlDoc.getElementsByTagName("rules")[i].childNodes[0].nodeValue
    var textnode = document.createTextNode(x);
    node.appendChild(textnode);
    node.className = "collection-item teal flow-text";
    document.getElementById("myList").appendChild(node);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var elems2 = document.querySelectorAll('.tooltipped');
  var instances = M.Modal.init(elems);
  var instances2 = M.Modal.init(elems2);
});
