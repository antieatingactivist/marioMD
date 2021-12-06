const screenWidth = 500;
const screenHeight = 600;
const yMargin = 4;
const yMarginBottom = 1;
const xMargin = 5;
const gridWidth = 10 + xMargin*2;
const gridHeight = 20 + yMargin + yMarginBottom;
const bgColor = "#222222";
const lineColor = "#111111";
const marginColor = "#000000";
const squareWidth = 30;
const squareHeight = 30;
var level = 1;
var speed = 1000  /level;
var score = 1;
var pillCount = 1;

var grid = new Array();
var piece;
var previewPiece;
var testPiece;
var targetPiece;
var scoreBox = new textBox(400, 80, level, 80);
var smallTestSquare = new Array();
let brokenPills = new Array();

function start() {
    

    gameCanvas.start();
    fillGrid();
    setMargins();
    createPiece();
    //testDraw();
   //preFill();
   makeVirus();
    

    

}

var gameCanvas = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = screenWidth;
        this.canvas.height = screenHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameCanvas, 40);
        this.speed = setInterval(drop, speed);
        this.keyInterval = setInterval(checkKey, 40);
        
 
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //score = 0;

    },
    update : function() {
       clearInterval(this.speed);
       this.speed = setInterval(drop, speed);
    },
    pause : function() {
        clearInterval(this.speed);
    },
    pillFill : function() {
        clearInterval(this.speed);
        this.speed = setInterval(pillDrop, 300);
    }

}
function checkKey() {document.onkeydown = checkKey_;}
function checkKey_(e) {

    e = e || window.event;

    if (e.keyCode == '38' || e.keyCode == '87') {
        fastDrop();
        // up arrow
    }
    else if (e.keyCode == '40' || e.keyCode == '83') {
        drop();
        // down arrow
    }
    else if (e.keyCode == '37' || e.keyCode == '65') {
        left();
       // left arrow
    }
    else if (e.keyCode == '39' || e.keyCode == '68') {
        right();
       // right arrow
    }
    else if (e.keyCode == '32') {
        rotate();
       // right arrow
    }

}

function textBox(x, y, text, size) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.size = size;

    this.update = function() {
        var ctx = gameCanvas.context;
        ctx.fillStyle = "white";
        ctx.font = size + "px Arial";
        ctx.fillText(this.text, this.x, this.y);
        
    }


}

function square(x, y, color, width, height) {
    this.joinedTo = 0;
    this.x = x*squareWidth;
    this.y = y*squareHeight;
    this.color = color;
    this.isActive = false;
    this.isSet = false;
    this.isTarget = false;
    this.isLmargin = false;
    this.isRmargin = false;
    this.height = height;
    this.width = width;
    this.hollow = false;
    this.lineColor = lineColor;
    this.id = 'x';
    this.isVirus = false;
  
    
    

    this.update = function() {
        var ctx = gameCanvas.context;
        
        
        
        if (this.hollow) {
            outline = 6;
            ctx.lineWidth = outline;
            ctx.strokeStyle = this.color;
            ctx.fillStyle = bgColor;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeRect(this.x+outline/2, this.y+outline/2, this.width-outline, this.height-outline);
            
        } else {

            //ctx.fillStyle = this.color;
            ctx.fillStyle = bgColor;
            ctx.fillRect(this.x, this.y, this.width, this.height);
           
            if (this.color != marginColor) {
                
                ctx.fillStyle = this.color;
                ctx.strokeStyle = this.color;
                
                ctx.beginPath();
                ctx.lineWidth = 1;
                //if (grid[x][y]) console.log(grid[x][y].id);
                ctx.arc(this.x+width/2, this.y+width/2, width/2-1, 0,7);
                ctx.fill();
                
                switch (this.joinedTo) {
                    case 0:
                        ctx.fillRect(this.x, this.y, this.width/2, this.height);
                        break;
                    case 1:
                        ctx.fillRect(this.x, this.y, this.width, this.height/2);
                        break;

                    case 2: 
                        ctx.fillRect(this.x+this.width/2, this.y, this.width, this.height);
                        break;
                    case 3: 
                        ctx.fillRect(this.x, this.y+this.height/2, this.width, this.height/2);
                        break;
                //ctx.arc(this.x+width/2, this.y+width/2, width/2, 4.75,1.5);
                }
                
                ctx.font = "50px Arial";
                ctx.fillStyle = "black";
                if (this.isVirus) ctx.fillText("*", this.x+5, this.y+43);
               // ctx.font = "30px Arial";
               // ctx.fillText(this.joinedTo, this.x+8, this.y+26)
               // if (grid[this.xCoord][this.yCoord]) ctx.fillText(grid[this.xCoord][this.yCoord].id, this.x, this.y+30);
                ctx.stroke();


            
            }
            else {
                ctx.fillStyle = this.color;
            
            ctx.fillRect(this.x, this.y, this.width, this.height);
            }

        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.lineColor;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        //ctx.stroke();
    }



}
var rotation = 0;
function updateGameCanvas() {
    //document.onkeydown = checkKey;
    gameCanvas.clear();
   
    previewPiece.update();

   
 
    
    
    
    for(let j=0;j<gridWidth ;j++) {
        for(let i=0;i<gridHeight;i++) {
            if ( !grid[j][i].isActive && !grid[j][i].isSet) {
                grid[j][i].color = bgColor;
                grid[j][i].id = 'x';
                //grid[j][i].joinedTo = '4';
            }
            //if ( grid[j][i].isRmargin ) grid[j][i].color = "pink";
            if ( grid[j][i].isTarget ) {
                grid[j][i].color = "#383838";
                grid[j][i].hollow = true;

            }
            else grid[j][i].hollow = false;
            grid[j][i].update();
        }
    }  
    
    
    //testSquare.update();
    //testDraw();
    //testSquare.update();
    scoreBox.update();
    testAnimation();

    
}



function fillGrid() {
    for(let j=0;j<gridWidth+xMargin;j++) {
        var row = new Array();
        for(let i=0;i<gridHeight+yMarginBottom;i++) {
            row.push(new square((j-xMargin),(i-yMargin),bgColor,squareWidth, squareHeight));
            //row[i].update();

        }
        grid.push(row);
    }
    //console.log(grid);
}

function setMargins() { 
    for(let i=0;i<gridHeight;i++) { 
        for(let j=0;j<xMargin;j++) {
            grid[gridWidth-xMargin+j][i].isSet = true;
            grid[gridWidth-xMargin+j][i].color = marginColor;
            grid[gridWidth-xMargin+j][i].lineColor = marginColor;
            grid[gridWidth-xMargin+j][i].isRmargin = true;
            
        }

        
        
        grid[xMargin-1][i].isSet = true;
  
        grid[xMargin-1][i].isLmargin = true;
    }
    for(let i=0;i<gridWidth;i++) {
        grid[i][gridHeight - yMarginBottom].isSet = true;
        grid[i][gridHeight - yMarginBottom].color = marginColor;
    }

}
var id = 0;
function _piece(x, y, type, rotation, color, color2, isTarget) {
    this.squareCoord;
    this.occupiedBlocks; 
    

    this.rotation = rotation;
    this.x = x; 
    this.y = y;
    this.isSet = false;
    this.isActive = true;
    this.isTarget = isTarget;
    this.color = color;
    this.color2 = color2;
    this.type = type;

    this.id = pillCount;
    

    this.update = function() {
        x = this.x;
        y = this.y;
        rotation = this.rotation;
    
        switch(type) {
            
            case "jBlock": 
                jBlock();
                break;
            case "lBlock":
                lBlock();
                break;
            case "oBlock": 
                this.squareCoord = oBlock();
                break;
            case "iBlock": 
                iBlock();
                break;
            case "zBlock": 
                zBlock();
                break;
            case "sBlock": 
                sBlock();
                break;
            case "tBlock": 
                tBlock();
                break;
        }
        this.occupiedBlocks = buildPiece(this.isSet, this.isActive, this.isTarget, this.color, this.color2, this.id, this.rotation);
        
        
        //var color;
        function buildPiece(isSet, isActive, isTarget, color, color2, id, rotation) {
            var occupiedBlocks = new Array;

            for(let i=0;i<2;i++) { //set blocks
                occupiedBlocks.push([ x+squareCoord[i][0] , y+squareCoord[i][1] ]);
                    var square = grid[ x+squareCoord[i][0] ][ y+squareCoord[i][1]];

                    if (isTarget) {
                    //if (isTarget) {
                      //  if (square.color == bgColor) square.color = "#777777";
                        square.isActive = isActive;
                        square.id = 0;
                        
                        
                        //grid[ x+squareCoord[i][0] ][ y+squareCoord[i][1] ].isTarget = isTarget;
                    }
                    
                    else {
                       // if (!square.isSet || square.isRmargin) 
                       //console.log(square.isConnectedTo);
                            switch(i){
                                case 0: 
                                    square.color = color;
                                    square.id = id;
                                    square.joinedTo = rotation;
                                    //console.log(rotation);
                                    
                                    break;
                                case 1: 
                                    square.color = color2;
                                    square.id = id;
                                    square.joinedTo = rotation+2;
                                    if (rotation == 2) square.joinedTo = 0;
                                    if (rotation == 3) square.joinedTo = 1;
                                    break;
                            }
                        square.isActive = isActive;
                        if (isSet) square.isSet = true;

                        
                    }
                    square.isTarget = isTarget;
                    
                    
                    
                    
                
                
            }
            
            return occupiedBlocks;
            
        }

        function tBlock() {
            color = "white";
            switch(rotation) {
                case 0: 
                    squareCoord = [ [1,0],[0,1],[1,1],[2,1] ];  
                    break;
                case 1: 
                    squareCoord = [ [0,1],[1,0],[1,1],[1,2] ];  
                    break;
                case 2: 
                    squareCoord = [ [1,2],[0,1],[1,1],[2,1] ];  
                    break;
                case 3: 
                    squareCoord = [ [2,1],[1,0],[1,1],[1,2] ];  
                    break;

            }
        }
        function sBlock() {
            color = "purple"
            switch(rotation) {
                
                case 0:
                case 2: 
                    squareCoord = [ [1,0],[2,0],[0,1],[1,1] ];  
                    break;
                case 1: 
                case 3:
                    squareCoord = [ [2,1],[2,2],[1,0],[1,1] ];  
                    break;
           

             }
        }
        function zBlock() {
            color = "green"
            switch(rotation) {
                
                case 0:
                case 2: 
                    squareCoord = [ [0,0],[1,0],[1,1],[2,1] ];  
                    break;
                case 1: 
                case 3:
                    squareCoord = [ [2,0],[2,1],[1,1],[1,2] ];  
                    break;
           

             }
        }     
        function jBlock() {
            color = "red"
            switch(rotation) {
                case 0: 
                    squareCoord = [ [0 ,0],[0,1],[1,1],[2,1] ];  
                    break;
                case 1: 
                    squareCoord = [ [2,0],[1,0],[1,1],[1,2] ];  
                    break;
                case 2: 
                    squareCoord = [ [2,2],[0,1],[1,1],[2,1] ];  
                    break;
                case 3: 
                    squareCoord = [ [1,2],[2,0],[2,1],[2,2] ];  
                    break;

             }
        }      
    
        function lBlock() {
            color = "blue";
            switch(rotation) {
                case 0: 
                    squareCoord = [ [2,0],[0,1],[1,1],[2,1] ];    
                    break;
                case 1: 
                    squareCoord = [ [1,0],[2,0],[2,1],[2,2] ];  
                    break;
                case 2: 
                    squareCoord = [ [0,2],[0,1],[1,1],[2,1] ];      
                    break;
                case 3: 
                    squareCoord = [ [2,2],[1,0],[1,1],[1,2] ];      
                    break;

            }
        }
        function oBlock() {
            color = "yellow";
                    //squareCoord = [ [0,0],[0,1],[1,0],[1,1] ];
            switch (rotation) {
                case 0:
                    squareCoord = [ [1,0],[0,0]];
                    
                    break;
                
                case 2:
                    squareCoord = [ [0,0],[1,0]];
                    break;
                case 1:
                    squareCoord = [ [0,1],[0,0]];
                    break;
                
                
                case 3:
                    squareCoord = [ [0,0],[0,1]];
                    break;

                }
                return squareCoord; 
        }
        function iBlock() {
            color = "orange";

            switch (rotation) {
                case 0:
                case 2:
                    squareCoord = [ [0,2],[1,2],[2,2],[3,2] ];
                    break;
                case 1:
                case 3:
                    squareCoord = [ [1,0],[1,1],[1,2],[1,3] ];
                    break;
            } 
            

        }


    }  
}
function clearBoard() {
    gameCanvas.pause();
    let virusColor = 0;
    brokenPills = new Array();
    for (let j = xMargin; j < gridWidth-xMargin; j++ ) {
        for (let i = yMargin; i < gridHeight-yMarginBottom; i++) { 
            grid[j][i].isSet = false;
            grid[j][i].color = bgColor;
            grid[j][i].id = 'x';
            grid[j][i].joinedTo = 4;
            grid[j][i].isVirus = false;
            grid[j][i].isActive = false;
            grid[j][i].isSet = false;
            grid[j][i].isTarget = false;
            //updateGameCanvas();
            
        }
    } 
}

function makeVirus(){
    let virusColor = 0;

    
    
    
    for (let j = xMargin; j < gridWidth-xMargin; j++ ) {
        for (let i = gridHeight-yMarginBottom-level-7; i < gridHeight-yMarginBottom; i++) {
            
   
            
            if (Math.random() > .9/level) {
                grid[j][i].isVirus = true;
                grid[j][i].isSet = true;
                
                grid[j][i].joinedTo = 4;
                switch (virusColor) {
                    case 0: 
                        grid[j][i].color = "red";
                        virusColor = 1;
                        break;
                    case 1:
                        grid[j][i].color = "blue";
                        virusColor = 2;
                        break;
                    case 2:
                        grid[j][i].color = "yellow";
                        virusColor = 0;
                        break;



                }
                
            }
        }
    }

}

function rotate() {
 
    if (canRotate()) {
            piece.rotation = rotateCalculator(piece.rotation, true);
            
           // console.log(piece.rotation);
            piece.x = testPiece.x;
            testPiece.rotation = rotateCalculator(piece.rotation, true);
    }
 
    updatePiece();
    
    function rotateCalculator(input, right) {
        if (right) {
            if (input < 3) return input+1;
            else return 0;
        } else {    
            if (input >= 0) return input-1;
            else return 3;
        }
    }
     

    

}

function updatePiece() {
    //piece.color = bgColor;
    
    testPiece.x = piece.x;
    //targetPiece.rotation = piece.rotation;
    //targetPiece.x = piece.x;
    //targetPiece.isActive = true;
    //targetPiece.isTarget = true;
    //targetPiece.y = piece.y;
    //targetPiece.update();
    //targetFastDrop();
    piece.isActive = true;
    testPiece.update();
    
    piece.update();
    
    
    
    
    
    
}


function createPiece() {
    function random() {
    let type = "";
    
    let randomNum = Math.ceil(Math.random()*3);
 
    switch (randomNum) {
        case 1: color = "yellow"; break;
        case 2: color = "red"; break;
        case 3: color = "blue"; break;

    }
    type = "oBlock";
    //console.log(randomNum);
        return color;
    }

      if (!piece) {
        piece = new _piece(9,3,"oBlock",0,random(),random(), false);  // (x , y)  y higher than 2, x higher than 1
        pillCount++;
        
    }
    else {
        let color = previewPiece.color;
        previewPiece.color = marginColor;
        previewPiece.update();
        previewPiece.x = 9;
        previewPiece.y = 3;
        previewPiece.color = color;
     
        
        previewPiece.update();  
        piece = previewPiece;
        piece.update();
        

    }
    previewPiece = new _piece(16,8,"oBlock",0,random(),random(), false);  // (x , y)  y higher than 2, x higher than 1
    pillCount++;
    //console.log(pillCount);
    
  
  
    testPiece = new _piece(piece.x,piece.y,piece.type,1, bgColor, bgColor, false);  // (x , y)  y higher than 2, x higher than 1
   
   
    targetPiece = new _piece(piece.x,piece.y,piece.type,0, "black","black", true);  // (x , y)  y higher than 2, x higher than 1
   
    testPiece.update();
    targetPiece.update();
    piece.update();
    previewPiece.isActive = true;
    previewPiece.update();
    
    
    
}




function targetDrop() {
    var moveable = true;

    targetPiece.isActive = false;
    targetPiece.isTarget = false;

    targetPiece.update();
    for (i in targetPiece.occupiedBlocks) {
        
        if (grid[targetPiece.occupiedBlocks[i][0]][targetPiece.occupiedBlocks[i][1]+1].isSet) moveable = false;
    }
    if (moveable) targetPiece.y++; 
    

    targetPiece.isActive = true;

    
    return moveable;
}
function targetFastDrop() {
    while ( targetDrop() );
    targetPiece.isTarget = true;
    targetPiece.update();
    
}

function drop() {
   
    canRotate();
    
    var moveable = true;
    for (i in piece.occupiedBlocks) {

        if (grid[piece.occupiedBlocks[i][0]][piece.occupiedBlocks[i][1]+1].isSet) moveable = false;

    }

    if (moveable) {
        
        
        piece.y++; 
    }
    else {
        set();
        
        
        //previewPiece.color = marginColor;
        //previewPiece.update();  
        createPiece(); 
             
    }
    
    updatePiece();
    return moveable;
}

function canRotate() {
    piece.isActive = false;
    targetPiece.isActive = false;
    targetPiece.isTarget = false;
    piece.update();
    targetPiece.update();
    
    for (i in testPiece.occupiedBlocks) {
        if (grid[testPiece.occupiedBlocks[i][0]][testPiece.occupiedBlocks[i][1]].isSet){
            testPiece.x = piece.x+1;
            
           
            
        }
        testPiece.update();
    }
    for (i in testPiece.occupiedBlocks) {
        if (grid[testPiece.occupiedBlocks[i][0]][testPiece.occupiedBlocks[i][1]].isSet){
            testPiece.x = piece.x-1;
            
           
            
        }
        testPiece.update();
    }
    for (i in testPiece.occupiedBlocks) {
        if (grid[testPiece.occupiedBlocks[i][0]][testPiece.occupiedBlocks[i][1]].isSet){
            testPiece.x = piece.x-2;
            
           
            
        }
        testPiece.update();
    }
    for (i in testPiece.occupiedBlocks) {
        if (grid[testPiece.occupiedBlocks[i][0]][testPiece.occupiedBlocks[i][1]].isSet){
            return false;
            
           
            
        }
        
    }
    return true;

   
    
}

function fastDrop() {
    while ( drop() );
}

function left() {
    canRotate();
    var moveable = true;

    for (i in piece.occupiedBlocks) {
       
        if (grid[piece.occupiedBlocks[i][0]-1][piece.occupiedBlocks[i][1]].isSet) moveable = false;
    }

    if (moveable) {
        piece.x--; 
        targetPiece.x = piece.x;
        
        testPiece.x = piece.x;
    }
    updatePiece();    
}
function right() {
    canRotate();
    var moveable = true;

    for (i in piece.occupiedBlocks) {
       
        if (grid[piece.occupiedBlocks[i][0]+1][piece.occupiedBlocks[i][1]].isSet) moveable = false;
    }

    if (moveable) {
        piece.x++;
        targetPiece.x = piece.x;
        testPiece.x = piece.x;
    }
    updatePiece();
     
}

function set() {
    
    piece.isSet = true;
    //let pill = [grid[piece.occupiedBlocks[0][0]][piece.occupiedBlocks[0][1]] , grid[piece.occupiedBlocks[1][0]][piece.occupiedBlocks[1][1]]];


    piece.update();
    
    isGameOver();
    //scoreLines();
    isFour();
    gameCanvas.pillFill();
    scoreBox.text = level;   
    console.log(level); 
    //createPiece(); 
}

function pillDrop() {
    let virusCount = 0;
    let done = true;
    for (let j = xMargin; j < gridWidth-xMargin; j++ ) {
        for (let i = gridHeight-yMarginBottom-1; i >= yMargin; i--) {
            
           if ((!grid[j][i].isSet && grid[j][i-1].isSet) && (grid[j][i-1].id != grid[j-1][i-1].id) && (grid[j][i-1].id != grid[j+1][i-1].id)) {
              //console.log(grid[j][i-1].id);
              //console.log(grid[j+1][i-1].id);
              for (var k = i; k >= yMargin; k--) {
              grid[j][k].isSet = grid[j][k-1].isSet;
              grid[j][k].color = grid[j][k-1].color;
              grid[j][k].id = grid[j][k-1].id;
              grid[j][k].joinedTo = grid[j][k-1].joinedTo;
              
          
               
               
              }
              done = false;
              //gameCanvas.pause();
           }
           for (l of brokenPills) {
                if (grid[j][i].id == l) {
                    grid[j][i].joinedTo = 4;
                // grid[j][i].id = 'x';
                }
            }
            if (grid[j][i].isVirus) virusCount++;
        }
        
    }
    isFour();
    if (done) {
        if (virusCount == 0) {
            clearBoard();
            level++;
            
            
           
            pillCount = 1;
            
            //grid = new Array();
            
            //gameCanvas.clear();
            //fillGrid();
            //setMargins();
            //createPiece();
            
            makeVirus();
            scoreBox.text = level;  
            //gameCanvas.update();
        }
    
        gameCanvas.update();
    }
    
    return done;

}

function isFour() {
    
    for (let j = xMargin; j < gridWidth-xMargin; j++ ) {
        for (let i = yMargin; i < gridHeight-yMarginBottom-3; i++) {
            
            let match = false;
            let a =  grid[j][i];
            let b =  grid[j][i+1];
            let c =  grid[j][i+2];
            let d =  grid[j][i+3];
       
            if (a.isSet) {
            
                    let x = [a.color, b.color, c.color, d.color]
                    if (x.every( y => y == a.color)) match = true;
                
                    //console.log(match);
                   
                    if (match) {
                        
                        x = [];
                        let count = 0;
                        while (grid[j][i+count].color == a.color) {
                            x.push(grid[j][i+count]);
                            count++;
                        }
                        for (k of x) {
                            k.color = bgColor;
                            k.isSet = false;
                            brokenPills.push(k.id);
                            k.id = 'x';
                            k.isVirus = false;

                        }
                      
                        
                    }
                    
                    
            }
           
        }
    }

}


function isGameOver() {

    for (let i=xMargin; i < gridWidth-xMargin; i++) {
        //console.log(grid[i][4].isSet);
        if(grid[i][4].isSet) gameOver();

    }

}

function gameOver() {
    score = 0;
    level = 1;
    pillCount = 1;
    speed = 1000;
    grid = new Array();
    gameCanvas.update();
    gameCanvas.clear();
    fillGrid();
    setMargins();
    createPiece();
    
  

}

function scoreLines() {
    var completedLines = new Array();
    let bottom = gridHeight-yMarginBottom;

    
    for (let i=0; i<bottom; i++) {
        //console.log(i);
        if (scoreLine(i)) completedLines.push(i);
    }
    //console.log(completedLines);
    for (i of completedLines) {
        cutLine(i);
        score++;
        if (score >= level * 5) level++;
        speed = 1000 / level;
        gameCanvas.update();
        
    }
    
    
}
function scoreLine(line) {
    var completeLine = false;
    var test = new Array();
    for (let i=xMargin; i < gridWidth-xMargin; i++) {
        
        test.push(grid[i][line].isSet);

        if (!grid[i][line].isSet) {
            completeLine = false;
            break;
        }
        else {
            completeLine = true;       
            
        }

    }

    return completeLine;

}

function cutLine(line) {
    setExplosives(line);
    for (let j=line-1; j >= 0; j--) {
        for (let i=xMargin; i < gridWidth-xMargin; i++) {
            grid[i][j+1].color = grid[i][j].color;
            grid[i][j+1].isSet = grid[i][j].isSet;
            grid[i][j+1].isActive = grid[i][j].isActive;
        }
    }    

    

}

function setExplosives(line) {
    let lineY = (line-yMargin)*30;
    let x = squareWidth;
    
    //console.log(x);
    
    for (let i = 0; i < 10; i++) {
        let color = grid[i+xMargin][line].color;
        
        let a = smallTestSquare.length;
        //console.log(a);
        
        smallTestSquare.push([]);

        smallTestSquare[a].push(new square(i*x,lineY,color, 15, 15));
        smallTestSquare[a].push(new square(i*x+15,lineY,color, 15, 15));
        smallTestSquare[a].push(new square(i*x+15,lineY+15,color, 15, 15));
        smallTestSquare[a].push(new square(i*x,lineY+15,color, 15, 15));    
        
    }
    
    //testAnimation();
    //console.log(smallTestSquare);
    


}













//---------------------------------------------



function testAnimation() {

    let speed = 10;
    
    if (smallTestSquare.length && Math.abs(smallTestSquare[0][0].x) < 1000) {
        //testSquare.x = 2000;
        for (let i = 0; i < smallTestSquare.length; i++) {
            let randomX = speed+Math.random()*10;
            let randomY = speed/20;

            



            smallTestSquare[i][0].x-=randomX;
            smallTestSquare[i][0].y-=randomY;
            smallTestSquare[i][1].x+=randomX;
            smallTestSquare[i][1].y-=randomY;
            smallTestSquare[i][2].x+=randomX;
            smallTestSquare[i][2].y+=randomY;
            smallTestSquare[i][3].x-=randomX;
            smallTestSquare[i][3].y+=randomY;
        


            for (j in smallTestSquare[i]) {
            
                smallTestSquare[i][j].update();
            }
    
        }    
        

    }
    else {
            
            smallTestSquare = new Array();

        }


}



function preFill() {
    for (let i=1; i<11; i++) {
    grid[i][18].color = "red";
    grid[i][18].isSet = true;
    }
    grid[5][18].color = "yellow";


    for (let i=1; i<11; i++) {
        grid[i][20].color = "blue";
        grid[i][20].isSet = true;
        }
        grid[5][20].color = "yellow";
}

function blow() {

    //gameCanvas.setInterval.start.interval(updateGameCanvas, 10000);
   
    return "blow";
    
}

