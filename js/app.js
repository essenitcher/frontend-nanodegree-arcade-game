var moveEnemies = true;

function collided(){
	for(enem of allEnemies){
		if (player.x < enem.x + enem.width  && player.x + player.width  > enem.x &&
				player.y < enem.y + enem.height && player.y + player.height > enem.y) {
			// The objects are touching
				console.log(player.x + "/" + player.y + "/" +  player.width  + "/" + player.height + "/"+ 
					enem.x + "/" + enem.y + "/" +  enem.width + "/" + enem.height );
			return true;
		}		
	}
	return false;
}

function reachedWater(){
	return (player.y == 45);
}


// Enemies our player must avoid
var Enemy = function(id) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
	this.id = id;
	//Randomly assing the distance to the left where it will begin to appear
	this.x = Math.floor(Math.random()*5)*-100;
	//Randomly assign the row
	this.y = 135 + (83 *Math.floor(Math.random()*3));
	this.width = 101;
	this.height = 73;
	
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug2.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	//If we are not searching collision, we should not update the enemies.
	if(moveEnemies){
		// You should multiply any movement by the dt parameter
		// which will ensure the game runs at the same speed for
		// all computers.
		this.x  += game.speed*dt;
		//It is out of the screen
		if(this.x > 504)
		{
			//Randomly Change the row
			this.y = 135 + (83 *Math.floor(Math.random()*3));
			//Randomly assing the distance to the left where it will begin to appear
			this.x = Math.floor(Math.random()*5)*-100;
		}
	};
	
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = game.character + '.png';
	this.x = 215;
	this.y = 460;
	this.width = 68;
	this.height = 90;
	this.lives = 3;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	if(moveEnemies && collided()){
		this.sprite = game.character + '-dead.png';
		moveEnemies = false;
		setTimeout(function(){
			player.loseLife()}, 2000);
	}
	if(moveEnemies && reachedWater()){
		this.sprite = game.character + '-win.png';
		moveEnemies = false;
		//Wait two seconds and move to the next level
		setTimeout(function(){
			game.nextLevel()}, 2000);		
	}
	
};

// Moves the player back to the start
Player.prototype.backToStart = function() {
    this.sprite = game.character + '.png';
	this.x = 215;
	this.y = 460;
};

// Player lose one life
Player.prototype.loseLife = function() {
    player.lives--;
	if(player.lives > 0){
		this.backToStart();
		//Redraw the hearts
		var hearts ="";	
		for(var i = 0; i < player.lives; i++){
			hearts += '<img src="images/heart.png">';
		}
		$("#hearts").html(hearts);
		
		moveEnemies = true;
	}else{
		$("#hearts").html("");
		alert("YOU LOSE");
	}
};

// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

// Draw the enemy on the screen, required method for game
Player.prototype.handleInput = function(direction) {
	if(moveEnemies){
		if(direction == 'up'  && this.y > 0){
			this.y -= 83;
		}
		if(direction == 'down'  && this.y < 405){
			this.y += 83;
		}
		if(direction == 'left'  && this.x > 0){
			this.x -= 101;
		}
		if(direction == 'right'  && this.x < 404){
			this.x += 101;
		}
	}
	
};

// Object for the game
var Game = function(id) {
    // Variables applied to each of our instances go here,
	this.character = 'images/char-boy2';
	this.level = 1;
	this.score = 0;
	this.enemies = 5;
	this.speed = 60;
};


// Move on to the next Level
Game.prototype.nextLevel = function() {
	game.increaseDifficulty();
	player.backToStart();
	//Alow movement again
	moveEnemies = true;
};


// Move on to the next Level
Game.prototype.increaseDifficulty = function() {
	game.level++;
	//Change level in the screen
	$("#level").text("Level "+ game.level);
	
	//Add more speed or more enemies depending on the # of level
	if(game.level % 2 == 0){
		//Add speed
		this.speed += 30;
	}else{
		//Add enemies
		this.enemies++;
		allEnemies.push(new Enemy(this.enemies-1));
	}
};

function initiateEnemies(){
	allEnemies = [];
	for(var i = 0; i < game.enemies; i++){
		allEnemies[i] = new Enemy(i+1);
	}	
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var game = new Game();
var allEnemies;
//add enemies
initiateEnemies();

var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
