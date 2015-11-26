$(document).ready(function (){

	var button = document.getElementById("btn");
	var button2 = document.getElementById("btn2");
	var board = document.getElementById("board");

	// canvas build
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();

	// lets save the cell width in a variable for easy control
	var cw =  10;
	var d;
	var food;
	var food2;
	var score;
	var score2;

	// create sound effect
	var audio = new Audio('Coin_Drop.mp3');
	var audio2 = new Audio('House-music.mp3');
	var audio3 = new Audio('Falling_Off.mp3');


	/// lets build the snake
	var snake_array;  // an array of cells to make up the snake
	var snake2_array;

	function init() {
		board.style.display = "none";
		d = "left"; // default direction
		create_snake();			
		create_food(); 	// now we can see the food particle	
		// lets display the score
		score = 0;

		// lets movethe snake now using a timer which will trigger the pair
		//every 60ms
		if (typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 100);
	}
	function init2() {
		board.style.display = "none";
		d = "left"; // default direction
		create_snake();			
		create_food(); 	// now we can see the food particle	
		// lets display the score
		score = 0;

		// create second snake
		nd = "right";
		create_snake2();
		create_food2();
		score2 = 0;

		// lets movethe snake now using a timer which will trigger the pair
		//every 60ms
		if (typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint2, 100);
	}
	button.addEventListener('click', init);
	button2.addEventListener('click', init2);
	// init();

	// create snake 
	function create_snake() {
		var length = 5;	
		snake_array = [];
		for(var i = 0 ; i <= length-1; i++) {
			// console.log(i);
			snake_array.push({x:i+49, y:49});
			// console.log(snake_array[i]);
		}
	}

	// create snake 2
	function create_snake2() {
		var length = 5;	
		snake2_array = [];
		for(var i = length-1; i >= 0; i--) {
			// console.log(i);
			snake2_array.push({x:i, y:0});
			// console.log(snake2_array[i]);
		}
	}
	// create DIY code
	function  randomFood (){
			return  {
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw)
		};
	}
	// lets create the food now
	function create_food() {
		food = randomFood();
		// this will create a cell with x/y between 0-44
		// because there are 45(450/10) positions across the rows and columns
	}
	// lets create the food for snake 2
	function create_food2() {
		food2 = randomFood();
		// this will create a cell with x/y between 0-44
		// because there are 45(450/10) positions across the rows and columns
	}
	// lets paint the snake now
	function paint() {
		// to avoid the snake trail we need to paint the BG on every frame
		// lets  paint the canvas now
		ctx.fillStyle = "#ffa";
		ctx.fillRect (0,0,w,h);
		ctx.strokeStyle = "black";
		ctx.strokeRect (0,0,w,h);

		// the movement code for the snake to come here
		// the logic is simple
		// pop out the ail cell and place it infront of the head cell
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;

		// there were the position of the head cell
		// we will increment it to get the new head position
		// lets add proper direction based movement now
		if (d == "right") nx++;
		else if (d == "left") nx--;
		else if (d == "up") ny--;
		else if(d == "down") ny++;


		// lets add the game over clause now
		// this will restart the game if the snake hits thw wall
		// lets add the code for body collision
		// now is the head of the snake bumps into the body, the game will restart
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array) )  {
			// restart game
			init();
			// lets organize the code a bit 
			// sound effect when the snake hits walls 
			audio3.play();
			audio3.volume = .2;
			return;
		} 

		// lets write the code to make the snake eat the food
		// the logic is simple
		// if the new head position matches with that of tthe food
		// create a new head instead of moving the tail
		if(nx == food.x && ny == food.y) {
			var tail = {x: nx, y: ny};
			score++;
			// sound effect when snake eat food
			audio.play();
			// create new food
			create_food();
		}  else {
			var tail = snake_array.pop(); // pops out the last xell
			tail.x = nx; tail.y = ny;
			// background music when the snake moves
			audio2.play();
			audio2.volume = 0.3;
		} 

		// the snake can now eat food
		snake_array.unshift(tail); // puts back the tail as the first cell


		for(var i=0; i < snake_array.length; i++) {
			var c = snake_array[i];
			// lets paint 10px wide cells
			paint_cell(c.x, c.y);
		}

		// lets paint the food
		paint_cell(food.x, food.y);

		//lets paint the score
		// var score_text = "Blue's Score: " + score2;
		// snake 2
		var score2_text = "Gold's Score: " + score;

		ctx.font = '14pt Calibri';
		ctx.fillStyle = 'red';
		ctx.fillText(score2_text, 250, h-100);
		// ctx.fillText(score_text, 50, h-100);
	}
	function paint2() {
		// to avoid the snake trail we need to paint the BG on every frame
		// lets  paint the canvas now
		ctx.fillStyle = "#ffa";
		ctx.fillRect (0,0,w,h);
		ctx.strokeStyle = "black";
		ctx.strokeRect (0,0,w,h);

		// the movement code for the snake to come here
		// the logic is simple
		// pop out the ail cell and place it infront of the head cell
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;

		// there were the position of the head cell
		// we will increment it to get the new head position
		// lets add proper direction based movement now
		if (d == "right") nx++;
		else if (d == "left") nx--;
		else if (d == "up") ny--;
		else if(d == "down") ny++;


		// the movement code for the snake2
		var n2x = snake2_array[0].x;
		var n2y = snake2_array[0].y;
		// there were the position of head cell of the snake 2 
		if (nd == "right") n2x++;
		else if (nd == "left") n2x--;
		else if (nd == "up") n2y--;
		else if(nd == "down") n2y++;

		// lets add the game over clause now
		// this will restart the game if the snake hits thw wall
		// lets add the code for body collision
		// now is the head of the snake bumps into the body, the game will restart
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array) )  {
			// restart game
			init();
			// lets organize the code a bit 
			// sound effect when the snake hits walls 
			audio3.play();
			audio3.volume = .2;
			return;
		} 
		 if (n2x == -1 || n2x == w/cw || n2y == -1 || n2y == h/cw || check_collision(n2x, n2y, snake2_array) )  {
			// restart game
			init();
			// lets organize the code a bit 
			// sound effect when the snake hits walls 
			audio3.play();
			audio3.volume = .2;
			return;
		}

		// lets write the code to make the snake eat the food
		// the logic is simple
		// if the new head position matches with that of tthe food
		// create a new head instead of moving the tail
		if(nx == food.x && ny == food.y) {
			var tail = {x: nx, y: ny};
			score++;
			// sound effect when snake eat food
			audio.play();
			// create new food
			create_food();
		}  else {
			var tail = snake_array.pop(); // pops out the last xell
			tail.x = nx; tail.y = ny;
			// background music when the snake moves
			audio2.play();
			audio2.volume = 0.3;
		} 

		if (n2x == food2.x && n2y == food2.y) {
			var tail2 = {x: n2x, y: n2y};
			score2++;
			// sound effect when snake eat food
			audio.play();
			// create new food
			create_food2();
		} else {
			var tail2 = snake2_array.pop(); // pops out the last xell
			tail2.x = n2x; tail2.y = n2y;
		}
		// the snake can now eat food
		snake_array.unshift(tail); // puts back the tail as the first cell

		// the snake2 can now eat food
		snake2_array.unshift(tail2); // puts back the tail as the first cell

		for(var i=0; i < snake_array.length; i++) {
			var c = snake_array[i];
			// lets paint 10px wide cells
			paint_cell(c.x, c.y);
		}
		//	 the snake2 
		for(var i=0; i < snake2_array.length; i++) {
			var c2 = snake2_array[i];
			// lets paint 10px wide cells
			paint_cell2(c2.x, c2.y);
		}

		// lets paint the food
		paint_cell(food.x, food.y);
		// snake 2
		paint_cell2(food2.x, food2.y);
		//lets paint the score
		var score_text = "Blue's Score: " + score2;
		// snake 2
		var score2_text = "Gold's Score: " + score;

		ctx.font = '14pt Calibri';
		ctx.fillStyle = 'red';
		ctx.fillText(score2_text, 250, h-100);
		ctx.fillText(score_text, 50, h-100);
	}
	// lets first create a generic function to paint cells
	function paint_cell(x,y) {
		ctx.fillStyle = "gold";
		ctx.fillRect (x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "blue";
		ctx.strokeRect (x*cw, y*cw, cw, cw);
	}
	// lets first create a generic function to paint  snake2 cells
	function paint_cell2(x,y) {
		ctx.fillStyle = "blue";
		ctx.fillRect (x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "write";
		ctx.strokeRect (x*cw, y*cw, cw, cw);
	}
	function check_collision(x,y,array) {
		// this function will check if the provided x/y coordinates exist
		// in an array of cells or not

		for(var i=0; i < array.length; i++) {
			if(array[i].x == x && array[i].y == y)
				return true;
		}
		return false;
	}

	// lets add the keyboard controls
	$(document).keydown(function (e) {
		var key = e.which;
		// we will add another clause to prevent reverse gear
		// using keyboard characters "w", "a", "d", and "x"
		if (key == "37" && d != "right") d = "left";
		else if (key == "38" && d != "down") d = "up";
		else if (key == "39" && d != "left") d = "right";
		else if (key == "40" && d != "up") d = "down";

		if (key == "65" && nd != "right") nd = "left";
		else if (key == "87" && nd != "down") nd = "up";
		else if (key == "68" && nd != "left") nd = "right";
		else if (key == "83" && nd != "up") nd = "down";
		// the snake is now keyboard controllable

	})
	// lets add the keyboard controls for snake 2
})


































