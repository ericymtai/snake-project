
$(document).ready(function () {

	// set variables for button 1 payer and 2 players
	var button = document.getElementById("btn");
	var button2 = document.getElementById("btn2");

	// set variable for button restart
	var button3 = document.getElementById("btn3");

	// set variable for the div that includes button 1 player and 2 players
	var board = document.getElementById("board");

	// canvas build
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();

	// let's save the cell width in a variable for easy control
	var cw =  10;	// set the cell width for 10px
	var d;			// goldsnake's direction
	var nd;			// bluesnake's direction
	var food;		// goldsnake's food
	var food2;		// bluesnake's food
	var score;		// goldsnake's score
	var score2;		// bluesnake's score

	// create sound effect
	var audio = new Audio('House-music.mp3');	// background music
	var audio2 = new Audio('Coin_Drop.mp3');	// sound effect when eating food
	var audio3 = new Audio('Falling_Off.mp3');	// sound effect when hitting walls


	// let's build the snakes
	var goldsnake_array;  	// an array of cells to make up the goldsnake
	var bluesnake_array;	// an array of cells to make up the bluesnake

	var ifPlayer2 = true;	// set if selecting 2 players

	// create the stage for goldsnake
	function goldsnake() {
		board.style.display = "none";		// hide select players' buttons
		button3.style.display = "block";	// show restart button
		d = "left";		// goldsnake's default direction
		create_goldsnake();	// now we can see the goldsnake			
		create_food(); 	// now we can see the food particle	for goldsnake
		score = 0;		// let's display the score for goldsnake
	}
	// create the stage for bluesnake
	function bluesnake() {
		nd = "right";	// bluesnake's default direction
		create_bluesnake();// now we can see the bluesnake
		create_food2();	// now we can see the food particle	for bluesnake
		score2 = 0;		// lets display the score for bluesnake
	}

	// start the game with 1 player
	function init() {
		goldsnake();		// call function goldsnake
		// let's move the goldsnake now using a timer which will trigger the paint function every 90ms
		if (typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 110);
	}
	// start the game with 2 players
	function init2() {
		goldsnake();		// call function goldsnake
		bluesnake();		// call function bluesnake
		// let's move the goldsnake and bluesnake now using a timer which will trigger the paint function every 90ms
		if (typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint2, 200);
	}

	// back to the beginning stage when press restart button
	function reloadPage() {
		location.reload();
	}

	button.addEventListener('click', init);			// call function init when goldsnake button pressed
	button2.addEventListener('click', init2);		// call function init2 when bluesnake button pressed
	button3.addEventListener('click', reloadPage);	// call function reloadPage when restart button pressed  

	// create goldsnake 
	function create_goldsnake() {
		var length = 5;	
		goldsnake_array = [];
		for(var i = 0 ; i <= length-1; i++) {
			goldsnake_array.push({x:i+49, y:49});		// set the snake's moving start from bottom right corner
		}
	}

	// create bluesnake
	function create_bluesnake() {
		var length = 5;	
		bluesnake_array = [];
		for(var i = length-1; i >= 0; i--) {
			bluesnake_array.push({x:i, y:0});			// set the snake's moving start from top left corner
		}
	}
	// create random food position
	function  randomFood() {
			return  {
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw)
		};
	}
	// let's create the food or goldsnake now
	function create_food() {
		food = randomFood();
		// this will create a cell with x/y between 0-44, because there are 45(450/10) positions across the rows and columns
	}
	// let's create the food for bluesnake
	function create_food2() {
		food2 = randomFood();
		// this will create a cell with x/y between 0-44, because there are 45(450/10) positions across the rows and columns
	}

	// paint the stage area and stroke color
	function stageColor() {
		// let's  paint the canvas now
		ctx.fillRect (0,0,w,h);
		ctx.strokeStyle = "black";
		ctx.strokeRect (0,0,w,h);
	}
	function goldScore() {
		//let's paint the score
		var score_text = "Gold's Score: " + score;
		ctx.font = '14pt Calibri';
		ctx.fillStyle = 'brown';
		ctx.fillText(score_text, 250, h-100);
	}
	

	function snakeMove() {
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

			if (ifPlayer2 == false) {
				init2();
			} else {
				init();
			}
			// let's organize the code a bit 
			audio3.play();		// sound effect when the snake hits walls 
			audio3.volume = .2;	// turn down the sound volume
			return;
		} 
		// let's write the code to make the goldsnake eat the food
		// the logic is simple
		// if the new head position matches with that of the food
		// create a new head instead of moving the tail
		if(nx == food.x && ny == food.y) {
			var tail = {x: nx, y: ny};
			score++;	
			audio2.play();		// sound effect when snake eat food
			create_food();		// create new food
		}  else {
			var tail = goldsnake_array.pop(); // pops out the last xell
			tail.x = nx; tail.y = ny;
			audio.play();		// background music when the snake moves
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
	// lets paint the snake now
	function paint() {
		ctx.fillStyle = "#afa";
		stageColor();
		// to avoid the snake trail we need to paint the BG on every frame
		snakeMove();
		goldScore();
	}
	function paint2() {
		// to avoid the snake trail we need to paint the BG on every frame
		// lets  paint the canvas now
		ctx.fillStyle = "#fef";
		stageColor();
		ifPlayer2 = false;
		snakeMove();
		goldScore();

		// the movement code for the bluesnake
		var n2x = bluesnake_array[0].x;
		var n2y = bluesnake_array[0].y;
		// there were the position of head cell of the snake 2 
		if (nd == "right") n2x++;
		else if (nd == "left") n2x--;
		else if (nd == "up") n2y--;
		else if(nd == "down") n2y++;

		// lets add the game over clause now
		// this will restart the game if the snake hits thw wall
		// lets add the code for body collision
		// now is the head of the snake bumps into the body, the game will restart
		
		if (n2x == -1 || n2x == w/cw || n2y == -1 || n2y == h/cw || check_collision(n2x, n2y, bluesnake_array) )  {
			// restart game
			init2();
			// lets organize the code a bit 
			audio3.play();		// sound effect when the snake hits walls 
			audio3.volume = .2;	// turn down the sound volume
			return;
		}
		// lets write the code to make the snake eat the food
		// the logic is simple
		// if the new head position matches with that of tthe food
		// create a new head instead of moving the tail
		if (n2x == food2.x && n2y == food2.y) {
			var tail2 = {x: n2x, y: n2y};
			score2++;
			audio2.play();	// sound effect when snake eat food
			create_food2();	// create new food
		} else {
			var tail2 = bluesnake_array.pop(); // pops out the last xell
			tail2.x = n2x; tail2.y = n2y;
		}
		// the bluesnake can now eat food
		bluesnake_array.unshift(tail2); // puts back the tail as the first cell
		//	 the bluesnake 
		for(var i=0; i < bluesnake_array.length; i++) {
			var c2 = bluesnake_array[i];
			// let's paint 10px wide cells
			paint_cell2(c2.x, c2.y);
		}
		// bluesnake
		paint_cell2(food2.x, food2.y);
		//let's paint the score
		var score2_text = "Blue's Score: " + score2;
		// ctx.font = '14pt Calibri';
		ctx.fillStyle = 'blue';
		// ctx.fillText(score2_text, 250, h-100);
		ctx.fillText(score2_text, 50, h-100);
	}
	// let's first create a generic function to paint goldsnake cells
	function paint_cell(x, y) {
		ctx.fillStyle = "gold";
		ctx.fillRect (x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "blue";
		ctx.strokeRect (x*cw, y*cw, cw, cw);
	}
	// let's first create a generic function to paint bluesnake cells
	function paint_cell2(x, y) {
		ctx.fillStyle = "blue";
		ctx.fillRect (x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "write";
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
		// using keyboard characters "w", "a", "d", and "x"
		if (key == "65" && nd != "right") nd = "left";
		else if (key == "87" && nd != "down") nd = "up";
		else if (key == "68" && nd != "left") nd = "right";
		else if (key == "83" && nd != "up") nd = "down";
		// the snakes are now keyboard controllable
	})
})




























