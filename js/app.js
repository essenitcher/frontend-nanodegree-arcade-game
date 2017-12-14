var moveEnemies = true;

function areOverlapping(item, anotherItem){
	return item.x < anotherItem.x + (anotherItem.width*0.9)  && item.x + (item.width*0.9)  > anotherItem.x &&
				item.y < anotherItem.y + anotherItem.height && item.y + item.height > anotherItem.y;
}


function collided(){
	for(enem of allEnemies){
		if (areOverlapping(player, enem)) {
			return true;
		}		
	}
	return false;
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

// Update the player's position, required method for game
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
	if(moveEnemies && player.y == 45){
		this.sprite = game.character + '-win.png';
		moveEnemies = false;
		//Wait two seconds and move to the next level
		setTimeout(function(){
			game.nextLevel()}, 2000);		
	}
	
	//Check if found heart
	if(heart.visible && areOverlapping(this,heart)){
		console.log(this.y + "," + heart.y+ "," +  heart.height + "," + this.height)
		this.lives++;
		heart.visible = false;
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


/** HEART  */
var Heart = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/Heart.png';
	this.x = 0;
	this.y = 0;
	this.width = 89;
	this.height = 75;
	this.visible = false;
	this.notYetShownInLevel = true;
	this.startTime;
};

// Update the hearts's position, required method for game
// Parameter: dt, a time delta between ticks
Heart.prototype.update = function(dt) {
	//if it is still not visible and it hasn't been shown in the level
	if(this.notYetShownInLevel && !this.visible){
		//Decide if it will show up (chances are 1 in 50)
		var randomNumber = 1;
		if(randomNumber == 1){
			//Generate one random place to show
			var mover = Math.floor(Math.random()*3);
			//this.y = 125 + (125 *Math.floor(Math.random()*3));
			this.y = 134 + (84*Math.floor(Math.random()*3));
			this.x = 5 + (101 *Math.floor(Math.random()*5));
			this.visible = true;
			//this.notYetShownInLevel = false;
			this.startTime = performance.now();
		}
	}
	//If it is showing, check that I don't have to hide it (after 2 seconds)
	var now = performance.now();
	if(this.visible && now - this.startTime > 5000){
		this.visible = false;
	}
	
};

// Draw the enemy on the screen, required method for game
Heart.prototype.render = function() {
	if(this.visible){
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
	}
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
		if(direction == 'left'  && this.x > 101){
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
	this.enemies = 0;
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
//add enemies
var allEnemies;
initiateEnemies();
//Create player
var player = new Player();
//Create heart
var heart = new Heart();


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
