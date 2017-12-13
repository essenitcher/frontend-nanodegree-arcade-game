var searchCollision = true;

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

//Avoid to enemies to be overlaped
function calculateOverlap(enemy){
	var overlap = false;
	for(enem of allEnemies){
		//if it is not the same enemy
		if(enem.id != enemy.id){
			//If they are in the same row and in negative position
			if(enem.y == enemy.y){
				//If they overlap
				if(enemy.x <0){
					if((enem.x >= enemy.x) && (enemy.x +101)> enem.x){
					//	alert("1 . New is" +enem.x +"and the other " + enemy.x);
						enemy.x  = enem.x - 101;
						overlap = true;
					}
					if((enem.x <= enemy.x) && (enem.x +101)> enemy.x){
					//	alert("2 . New is" +enem.x +"and the other " + enemy.x);
						enemy.x  = enem.x - 101;
						overlap = true;
					}	
				}				
			}
			
		}
	}
	//if it was overlap, then call it again to check that moving it didn't put the enemy on top of another enemy
	if(overlap){
		calculateOverlap(enemy);
	}
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
	
	//Avoid to enemies to be overlaped
	calculateOverlap(this);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug2.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	//If we are not searching collision, we should not update the enemies.
	if(searchCollision){
		// You should multiply any movement by the dt parameter
		// which will ensure the game runs at the same speed for
		// all computers.
		this.x  += 60*dt;
		//It is out of the screen
		if(this.x > 504)
		{
			//Randomly Change the row
			this.y = 135 + (83 *Math.floor(Math.random()*3));
			
			calculateOverlap(this);
			this.x = -100;
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
    this.sprite = 'images/char-boy2.png';
	this.x = 215;
	this.y = 460;
	this.width = 73;
	this.height = 90;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	if(searchCollision && collided()){
		this.sprite = 'images/char-boy2-dead.png';
		searchCollision = false;
	}
	
};

// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

// Draw the enemy on the screen, required method for game
Player.prototype.handleInput = function(direction) {
	if(searchCollision){
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
//add 5 enemies
for(var i = 0; i < 5; i++){
	allEnemies[i] = new Enemy(i+1);
}
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
