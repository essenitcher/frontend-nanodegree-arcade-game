/*** MESSAGES CONTROL FUNCTIONS */

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
	gameStarted = true;

}

function changeLives(){
	
	var lives = $('input[name=lives]').val();
	
	if(lives%1 != 0){
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

function lose(){
	//add lose msg
	$("#title").text("Game Over");
	//add status
	$("#results").text("Congratulations! You've reached level " +  game.level + " with a total score of " +  game.score +  " points")
	//Show the div	
	$("#button").removeClass("newGame-invisible");	
	$("#button").addClass("newGame");
	$("#d").removeClass("d-invisible");	
	$("#d").addClass("d-visible");
	gameStarted = false;
}

function stop(){
	moveEnemies = !moveEnemies;
}

$(function(){
	//Listener to clicking the button
	$("#button").click(newGame);
	
	$("#lives").change(changeLives);
	
	$("#stop").click(stop);
});
