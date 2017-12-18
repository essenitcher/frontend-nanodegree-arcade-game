/** GAME CONTROL */
var moveEnemies = false;
var allEnemies;
var game;
var player;
var heart;
var gameStarted = false;

//Initialises the game's objects
function initGame(diff, lives){
	game = new Game(diff);
	//add enemies
	initiateEnemies();
	//Create player
	player = new Player(215, 460, 68, 90, lives, game.character + '.png');
	//Create heart
	heart = new Heart(0, 0, 89, 75, 'images/Heart.png');
	moveEnemies = false;
}



/**
	BASE Entity
**/

// Base class for all entities
var Entity = function(x, y, width, height, sprite) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.sprite = sprite;
};

// Draw the entity on the screen, required method for game
Entity.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};


//Check if two images are overlapping 
Entity.prototype.areOverlapping = function (anotherItem){
	return this.x < anotherItem.x + (anotherItem.width*0.9)  && this.x + (this.width*0.9)  > anotherItem.x &&
				this.y < anotherItem.y + (anotherItem.height*0.9) && this.y + (this.height*0.9) > anotherItem.y;
};

/**
PLAYER Entity
**/
var Player = function(x, y, width, height, lives, sprite) {
	Entity.call(this, x, y, width, height, sprite);
	this.lives = lives;
	this.targetX = null;
	this.targetY = null;
};
//Inherit methods
Player.prototype = Object.create(Entity.prototype);
Player.constructor = Player;


// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {

	var speed = 600;
	//Check if the player has reached the water
	if(moveEnemies && player.y <= 61){
		this.sprite = game.character + '-win.png';
		moveEnemies = false;
		this.targetY = null;
		this.targetX = null;
		//Wait two seconds and move to the next level
		setTimeout(function(){
			game.nextLevel();}, 2000);		
	}

	if(moveEnemies){
		//Move the character horizontally
		if(this.targetX !== null){
			if( this.targetX > this.x){
				this.x  += speed*dt;
				//Did i reach?
				if(this.x >= this.targetX){
					this.x = this.targetX;
					this.targetX = null;
				}			
			}else{
				this.x  -= speed*dt;
				//Did i reach?
				if(this.x <= this.targetX){
					this.x = this.targetX;
					this.targetX = null;
				}			
			}
		}
		
		//Move the character vertically
		if(this.targetY !== null){
			if( this.targetY > this.y){
				this.y  += speed*dt;
				//Did i reach?
				if(this.y >= this.targetY){
					this.y = this.targetY;
					this.targetY = null;
				}
					
			}else{
				this.y  -= speed*dt;
				//Did i reach?
				if(this.y <= this.targetY){
					this.y = this.targetY;
					this.targetY = null;
				}			
			}		
		}
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
	//Loses 10 points
	game.score -= 10;
	if(game.score < 0){
		game.score = 0;
	}
	if(player.lives > 0){
		this.targetX = null;
		this.targetY = null;
		this.backToStart();	
		moveEnemies = true;
	}else{
		lose();
	}
};



// Draw the enemy on the screen, required method for game
Player.prototype.handleInput = function(direction) {
	if(moveEnemies && this.targetX === null && this.targetY === null){
		if(direction == 'up'  && this.y > 0){
			this.targetY = this.y -83;
		}
		if (direction == 'down'  && this.y < 405){
			this.targetY = this.y +83;
		}
		if(direction == 'left'  && this.x > 101){
			this.targetX = this.x - 101;
		}
		if(direction == 'right'  && this.x < 404){
			this.targetX = this.x + 101;
		}
	}
	
};

//Checks if the player collided with an enemy
Player.prototype.collided = function(){
	for(var enem of allEnemies){
		if (this.areOverlapping(enem)) {
			return true;
		}		
	}
	return false;
};


/** ENEMY Entity
**/

// Enemies our player must avoid
var Enemy = function(id, x, y, width, height, sprite) {

	// Variables applied to each of our instances go here,
	// we've provided one for you to get started
	Entity.call(this, x, y, width, height, sprite);
	this.id = id;

};

//Inherit methods
Enemy.prototype = Object.create(Entity.prototype);
Enemy.constructor = Enemy;

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
		if(this.x > 504){
			//Randomly assign a row and the distance to the left where it will begin to appear
			this.assignNewPosition();
		}
	}
	
};


//method to place the enemy in a new position of the screen (Called when it reached the right margin) and a random row
Enemy.prototype.assignNewPosition = function (){
	//Randomly Change the row
	this.y = 135 + (83 *Math.floor(Math.random()*3));
	
	var newPos;
	var isCollision = true;
	
	var iteration = 0;
	//If there is collision I gotta do repeat the same
	do{
		iteration++;
		isCollision = false;
		//I check the iteration in order to avoid entering an infinite loop in the case that there are too many enemies in the same line and a new one does not fit
		if(iteration < 3){
			newPos = (1+Math.floor(Math.random()*5))*-102;
		}else{
			newPos -= 202;
		}
		//check if it is not ovelapping with other enemies
		for(var enemy of allEnemies){
			//if it is another enemy and it is the same row, and it is not visible
			if(enemy.id != this.id && this.y == enemy.y &&  enemy.x < 0){
				if((newPos < (enemy.x + enemy.width))  && ((newPos + enemy.width)  > enemy.x)){
					isCollision = true;
				}
			}
		}	

	}while(isCollision);
	
	this.x = newPos;

};

/** HEART Entity
**/

/** HEART  */
var Heart = function(x, y, width, height, sprite) {
	Entity.call(this, x, y, width, height, sprite);
	this.visible = false;
	this.notYetShownInLevel = true;
	this.startTime = undefined;
	this.checkTime = performance.now();
};

//Inherit methods
Heart.prototype = Object.create(Entity.prototype);
Heart.constructor = Heart;

// Update the hearts's position, required method for game
// Parameter: dt, a time delta between ticks
Heart.prototype.update = function(dt) {
	//If the game is running
	if(moveEnemies){
		//every second, check if we must generate the heart
		var now = performance.now();
		if(now - this.checkTime >= 1000)
			{
				//if it is still not visible and it hasn't been shown in the level
				if(this.notYetShownInLevel && !this.visible){
					//Decide if it will show up (chances are 1 in 20)
					var randomNumber = Math.floor(Math.random()*10);
					if(randomNumber == 5){
						//Generate one random place to show
						this.y = 134 + (84*Math.floor(Math.random()*3));
						this.x = 5 + (101 *Math.floor(Math.random()*5));
						this.visible = true;
						this.notYetShownInLevel = false;
						this.startTime = performance.now();
					}
				}
			//Reset to check again in 5 seconds
			this.checkTime = performance.now();
		}
		//If it is showing, check that I don't have to hide it (after 2 seconds)
		now = performance.now();
		if(this.visible && now - this.startTime > 10000){
			this.visible = false;
		}
	}
	
};

// Draw the enemy on the screen, required method for game
Heart.prototype.render = function() {
	if(this.visible){
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
	}
};


/** Object for the game
**/
var Game = function(diff) {
	// Variables applied to each of our instances go here,
	this.character = 'images/char-boy2';
	this.level = 1;
	this.score = 0;
	if(diff == 'E'){
		this.enemies = 2;
		this.speed = 40;		
	} else if(diff == 'N'){
		this.enemies = 3;
		this.speed = 60;		
	} else if(diff == 'H'){
		this.enemies = 5;
		this.speed = 80;		
	}
};


// Move on to the next Level
Game.prototype.nextLevel = function() {
	game.increaseDifficulty();
	player.backToStart();
	//Alow movement again
	moveEnemies = true;
	//Enable hearts again
	heart.visible = false;
	//Decide randomly if this level will have a heart
	heart.notYetShownInLevel = (Math.random() > 0.5);
	this.score +=1000;
};


// Move on to the next Level
Game.prototype.increaseDifficulty = function() {
	game.level++;
	
	//Add more speed or more enemies depending on the # of level
	if(game.level % 2 === 0){
		//Add speed
		this.speed += 30;
	}else{
		var enemyWidth = 101;
		var enemyHeight = 73;
		
		// The image/sprite for our enemies, this uses
		// a helper we've provided to easily load images
		var  enemySprite = 'images/enemy-bug2.png';	
		
		//Add enemies
		this.enemies++;
		
		var newEnemy = new Enemy(this.enemies, 0, 0, enemyWidth, enemyHeight, enemySprite);
		
		//Randomly assing the distance to the left where it will begin to appear
		newEnemy.assignNewPosition();
		
		allEnemies.push(newEnemy);
	}
};

function initiateEnemies(){
	allEnemies = [];

	//ENemy's size
	var enemyWidth = 101;
	var enemyHeight = 73;
	
	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	var  enemySprite = 'images/enemy-bug2.png';	
	
	for(var i = 0; i < game.enemies; i++){
		allEnemies[i] = new Enemy(i+1, 0, 0, enemyWidth, enemyHeight, enemySprite);
		//Randomly assing the distance to the left where it will begin to appear
		allEnemies[i].assignNewPosition();
	}	
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
initGame('N',3);


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
