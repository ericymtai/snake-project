// let's set images
var snakeImage1 = new Image();
	snakeImage1.src = "snake_outline1.png";
var snakeImage2 = new Image();
	snakeImage2.src = "snake_outline2.png";
var snakeImage3 = new Image();
	snakeImage3.src = "snake_outline3.png";
var snakeImage4 = new Image();
	snakeImage4.src = "snake_outline4.png";
var snakeImage5 = new Image();
	snakeImage5.src = "snake_outline5.png";
// var snakeImage6 = new Image();
// 	snakeImage6.src = "snake_outline6.png";


$(document).ready(function () {

	// set variables for button 1 payer and 2 players
	var button = document.getElementById("btn");

	// set variable for button back
	var button3 = document.getElementById("btn3");

	// set variable for button pause
	var button4 = document.getElementById("btn4");


	// set variable for getting five foods
	var canvasBoard = document.getElementById("canvas");

	// set variable for the div that includes 
	// var board = document.getElementById("board");

	// set variable for getting five foods
	var congratulation = document.getElementById("congratulation");


	// canvas build
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();

	// let's save the cell width in a variable for easy control
	var cw =  10;	// set the cell width for 10px
	var d;			// goldsnake's direction
	var food;		// goldsnake's food
	var score;		// goldsnake's score

	// create sound effect
	var audio = new Audio('House-music.mp3');	// background music
	var audio2 = new Audio('Coin_Drop.mp3');	// sound effect when eating food
	var audio3 = new Audio('Falling_Off.mp3');	// sound effect when hitting walls
	// let's build the snakes
	var goldsnake_array;  	// an array of cells to make up the goldsnake

var game_loop;

	// create the stage for goldsnake
	function goldsnake() {
		button.style.display = "none";		// hide select players' buttons
		button3.style.display = "block";	// show restart button
		button4.style.display = "block";
		d = "left";		// goldsnake's default direction
		create_goldsnake();	// now we can see the goldsnake			
		create_food(); 	// now we can see the food particle	for goldsnake
		score = 0;		// let's display the score for goldsnake
	}

	// start the game with 1 player
	function init() {
		
		goldsnake();		// call function goldsnake
		// let's move the goldsnake now using a timer which will trigger the paint function every 90ms
		if (typeof game_loop != "undefined") clearInterval(game_loop);
		// game_loop = setInterval(paint, 120);
		reStart(200);
	}

	// back to the beginning stage when press restart button
	function reloadPage() {
		location.reload();
		congratulation.style.display = "none";
	}

	// call functions when button clicked
	button.addEventListener('click', init);			// call function init when goldsnake button pressed
	button3.addEventListener('click', reloadPage);	// call function reloadPage when restart button pressed  
	button4.addEventListener('click', pause);
	// button4.addEventListener('click', reStar);

	// let's create the goldsnake 
	function create_goldsnake() {
		var length = 5;	
		goldsnake_array = [];
		for(var i=0 ; i<=length-1; i++) {
			goldsnake_array.push({x:i+49, y:49});		// set the snake's moving start from bottom right corner
		}
	}
	// let's set to pause the game
	function pause() {

		if(game_loop!=null){
			clearInterval(game_loop);
			crashSoundStop();
			bgMusicStop();
			game_loop=null;
			console.log('print pause');
		} else {
			reStart(200);
	    }
	}
	// let's set to re-start the game
	function reStart(b) {
		game_loop = setInterval(paint, b);
		console.log('print restart');
	}

	// let's create random food position
	function  randomFood() {
		return  {
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw)
		};
	}
	// let's create the food for the goldsnake now
	function create_food() {
		food = randomFood();
		// this will create a cell with x/y between 0-44, because there are 45(450/10) positions across the rows and columns
	}
	// paint the stage area and stroke color
	function stageArea() {
		// let's  paint the canvas now
		ctx.fillRect (0,0,w,h);
		ctx.strokeStyle = "black";
		ctx.strokeRect (0,0,w,h);
	}
	// let's paint the font size and position about the score for the goldsnake
	function goldScore() {
		//let's paint the score
		var score_text = "Gold's Score: " + score;
		ctx.font = '14pt Calibri';			// let's create font family and size
		ctx.fillStyle = 'blue';				// let's create font color
		ctx.fillText(score_text, 50, h-100);
	}
	// let's create the sound effect for hiting walls
	function crashSound() {
		audio3.play();		// sound effect when the snake hits walls 
		audio3.volume = .2;	// turn down the sound volume
	}
	function crashSoundStop() {
		audio3.stop();		// sound effect when the snake hits walls 
	}
	function bgMusic() {
		audio2.play();		// sound effect when the snake hits walls 
		audio3.volume = .2;	// turn down the sound volume
	}
	function bgMusicStop() {
		audio2.pause();		// sound effect when the snake hits walls 
	}

	// let's create the re-used function for the goldsnake
	function goldSnakeMove() {
		// the movement code for the goldsnake to come here
		// the logic is simple: pop out the ail cell and place it infront of the head cell
		var nx = goldsnake_array[0].x;
		var ny = goldsnake_array[0].y;
		// there were the position of the head cell
		// we will increment it to get the new head position
		// let's add proper direction based movement now
		if (d == "right") nx++;
		else if (d == "left") nx--;
		else if (d == "up") ny--;
		else if(d == "down") ny++;
		// let's add the game over clause now
		// this will restart the game if the snake hits thw wall
		// let's add the code for body collision
		// now is the head of the snake bumps into the body, the game will restart
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, goldsnake_array) )  {
			// restart game
			init();				// start 2 players game when false				
			crashSound();			// call sound effect when hit walls
			score = 0;
			return;
		} 
		// let's write the code to make the goldsnake eat the food
		// the logic is simple
		// if the new head position matches with that of the food
		// create a new head instead of moving the tail
		if(nx == food.x && ny == food.y) {
			var tail = {x: nx, y: ny};
			score++;			// add one when snake eat food
			// audio2.play();		// sound effect when snake eat food
			bgMusic();
			create_food();		// create new food	

			if (score==0) {
				reStart(190);
			} else if (score==1) {
				reStart(180);
			} else if (score==2) {
				reStart(170);
			} else if (score==3) {
				reStart(160);
			} else if (score==4) {
				reStart(150);
			} else if (score==5) {
				congratulation.style.display = "block";
				canvasBoard.style.display = "none";
				button.style.display = "none";		// hide select players' buttons
				button3.style.display = "block";
				button4.style.display = "none";
				crashSoundStop();
				bgMusicStop();
			}
		}  else {
			var tail = goldsnake_array.pop(); // pops out the last xell
			tail.x = nx; tail.y = ny;
			audio.play();		// play background music when the snake moves
			audio.volume = 0.3;	// turn down the sound volume
		} 
		// the goldsnake can now eat food
		goldsnake_array.unshift(tail); // puts back the tail as the first cell

		for(var i=0; i < goldsnake_array.length; i++) {
			var c = goldsnake_array[i];
			// lets paint 10px wide cells
			paint_cell(c.x, c.y);
		}
		// let's paint the food
		paint_cell(food.x, food.y);	
	}
	// let's draw the snake image 
	function snakeImg(a) {
		console.log(window["snakeImage"+a]); // THE OBJECT snakeImage1 
		ctx.drawImage(window["snakeImage"+a], 0, 0 );	// call the shake image

		window["snakeImage"+a].width = w/2;
		window["snakeImage"+a].height = h/2;

	}
	

	// lets paint the snake with one player game now

	function paint() {	

			// clearTimeout(pause);


		stageArea();		// call background area
		if (score == 0 ) {		// change to the snake image when reach score 3
				snakeImg(1);				// call the image1	
			} else if (score == 1 ) {		
				snakeImg(3);				// call the image3
			} else if (score == 2) {		
				snakeImg(4);				// call the image4
			} else if (score == 3) {		
				snakeImg(5);				// call the image5
			} else  {		
				snakeImg(2);				// call the image2
			} 
		// to avoid the snake's trail we need to paint the BG on every frame
		goldSnakeMove();	// call goldsnake
		goldScore();		// call goldsnake's score
	}

		
	// let's first create a generic function to paint goldsnake cells
	function paint_cell(x, y) {
		ctx.fillStyle = "gold";
		ctx.fillRect (x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "blue";
		ctx.strokeRect (x*cw, y*cw, cw, cw);
	}

	function check_collision(x, y, array) {
		// this function will check if the provided x/y coordinates exist
		// in an array of cells or not
		for(var i=0; i < array.length; i++) {
			if(array[i].x == x && array[i].y == y)
			return true;
		}
		return false;
	}

	// let's add the keyboard controls
	$(document).keydown(function (e) {
		var key = e.which;
		// we will add another clause to prevent reverse gear
		// using keyboard characters "up", "down", "left", and "right" arroes
		if (key == "37" && d != "right") d = "left";
		else if (key == "38" && d != "down") d = "up";
		else if (key == "39" && d != "left") d = "right";
		else if (key == "40" && d != "up") d = "down";
		// the snakes are now keyboard controllable
	})
})




























