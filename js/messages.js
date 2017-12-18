/*** MESSAGES CONTROL FUNCTIONS */

//Creates a new game
function newGame(){
	
	var diff = $('input[name=difficulty]:checked').val();
	var lives = $('input[name=lives]').val();
	
	initGame(diff, lives);
	
	//Display enemies and player
	moveEnemies = true;
	//hide div
	$("#button").removeClass("newGame");
	$("#button").addClass("newGame-invisible");	
	$("#d").removeClass("d-visible");
	$("#d").addClass("d-invisible");
	$("#joystick").removeClass("invisible");
	
	gameStarted = true;

}

//Changes the qty of lives that the player will start the game with
function changeLives(){
	
	var lives = $('input[name=lives]').val();
	
	if(lives%1 !== 0){
		lives = Math.floor(lives);
	}
	if(lives > 5){
		lives = 5;
	}
	if(lives < 1){
		lives = 1;
	}
	$('input[name=lives]').val(lives);
	
	var html = "";
	for(var i = 0; i < lives ; i++){
		html += '<img class="heartImg" src="images/Heart.png">';		
	}
	$("#hearts").html(html);
}

//Shows the game over pop up
function lose(){
	//add lose msg
	$("#title").text("Game Over");
	//add status
	$("#results").text("Congratulations! You've reached level " +  game.level + " with a total score of " +  game.score +  " points");
	//Show the div	
	$("#button").removeClass("newGame-invisible");	
	$("#button").addClass("newGame");
	$("#d").removeClass("d-invisible");	
	$("#d").addClass("d-visible");
	$("#joystick").addClass("invisible");
	gameStarted = false;
}

//Hides and shows the joystick buttons (helpful while playing from a portable device)
function showHideJoystick(){
	if($("#joystickButtons2").hasClass("invisible")){
		$("#joystickButtons2").removeClass("invisible");
		$("#showHide").text("Hide Joystick");
	}else{
		$("#joystickButtons2").addClass("invisible");
		$("#showHide").text("Show Joystick");
	}
	
	if($("#joystickButtons1").hasClass("invisible")){
		$("#joystickButtons1").removeClass("invisible");
	}else{
		$("#joystickButtons1").addClass("invisible");
	}
}

$(function(){
	//Listener to clicking the button
	$("#button").click(newGame);
	
	$("#lives").change(changeLives);
	
	$("#showHide").click(showHideJoystick);
	
	$("#up").click(function(){
		player.handleInput('up');
	});	
	$("#down").click(function(){
		player.handleInput('down');
	});
	$("#left").click(function(){
		player.handleInput('left');
	});
	$("#right").click(function(){
		player.handleInput('right');
	});
});
