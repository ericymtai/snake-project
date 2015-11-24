$(document).ready(function (){

	// canvas build
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();

	// lets save the cell width in a variable for easy control
	var cw =  10;
	var d;
	var food;
	var score;

	var audio = new Audio('Coin_Drop.mp3');
	var audio2 = new Audio('House-music-logo.mp3');
	var audio3 = new Audio('Falling_Off.mp3');


	/// lets build the snake
	var snake_array;  // an array of cells to make up the snake

	function init() {
		d = "up"; // default direction
		create_snake();
		create_food(); 	// now we can see the food particle
		// lets display the score
		score = 0;

		// lets movethe snake now using a timer which will trigger the pair
	//every 60ms
	if (typeof game_loop != "undefined") clearInterval(game_loop);
	game_loop = setInterval(paint, 100);
	}
	init();

	// function create_snake() {
	// 	var length = 5;	
	// 	snake_array = [];
	// 	for(var i = length-1; i >= 0; i--) {
	// 		console.log(i);
	// 		snake_array.push({x:i, y:49});
	// 		console.log(snake_array[i]);
	// 	}
	// }
	function create_snake() {
		var length = 5;	
		snake_array = [];
		for(var i = 0 ; i <= length-1; i++) {
			console.log(i);
			snake_array.push({x:i, y:49});
			console.log(snake_array[i]);

		}
	}
	// lets create the food now
	function create_food(){
		food = {
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw)
		};
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
	if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))  {
		// restart game
		init();
		// lets organize the code a bit noe
		// audio3.play();
		return;
	}

	// lets write the code to make the snake eat the food
	// the logic is simple
	// if the new head position matches with that of tthe food
	// create a new head instead of moving the tail
	if(nx == food.x && ny == food.y) {
		var tail = {x: nx, y: ny};
		score++;
		// audio.play();
		// create new food
		create_food();
	}
	else {
		var tail = snake_array.pop(); // pops out the last xell
		tail.x = nx; tail.y = ny;
		// audio2.play();
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
	var score_text = "Score: " + score;
	ctx.font = '16pt Calibri';
	ctx.fillStyle = 'blue';
	ctx.fillText(score_text, 50, h-50);
}
	// lets first create a generic function to paint cells
	function paint_cell(x,y){
		ctx.fillStyle = "gold";
		ctx.fillRect (x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "blue";
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
		if (key == "65" && d != "right") d = "left";
		else if (key == "87" && d != "down") d = "up";
		else if (key == "68" && d != "left") d = "right";
		else if (key == "88" && d != "up") d = "down";
		// the snake is now keyboard controllable

	})
})



































