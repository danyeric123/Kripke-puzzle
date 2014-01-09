/*
I did the following extra credits: I made the pieces moved in an animated slow way.
I kept track of the moves one made and the time elapsed. I also had a "win" background image
appear when the player completed the puzzle.
*/
$(function() {
	//making all the puzzle pieces have the class "puzzlepiece"
	$("#puzzlearea > div").addClass("puzzlepiece"); 
	var start,
		positionLeft = 0,
		positionBackgroundX = 400,
		positionTop = 0,
		positionBackgroundY = 0,
		numberOfMoves = 0,
		onTry = 1,
		finished = false,
		keepTrack = document.createElement("p"),
		keepRecord = document.createElement("ul");
	$(keepTrack).addClass("records");
	$("#controls").append(keepTrack);
	$(keepRecord).addClass("records");
	$("#controls").append(keepRecord);
	
	//place all the pieces in the right place first
	for(var i = 1; i<16; i++) {
		var element = $("div")[i];
		element.style.left = positionLeft + "px";
		element.style.top = positionTop + "px";
		element.style.backgroundImage = "url(kripke.png)"; 
		element.style.backgroundPosition = positionBackgroundX + "px " + positionBackgroundY + "px";
	
		if(positionLeft < 300) {
			positionLeft = positionLeft + 100;
			positionBackgroundX = positionBackgroundX - 100;
		}
		else {
			positionLeft = 0;
			positionBackgroundX = 400;
			positionTop = positionTop + 100;
			positionBackgroundY = positionBackgroundY - 100;
		}
	}

	// then mark off the empty space and shuffle things up and set up the buttons
	var positionEmptyTop = positionTop;
	var positionEmptyLeft = positionLeft;
	shuffle();
	setInterval(bottomDisplay, 100);
	setInterval(checkComplete, 1000);
	$("#shufflebutton").click(shuffle);
	$(".puzzlepiece").click(move);
	$(".puzzlepiece").mouseover(movable);
	
	//all of the functions
	
	//moves things around based on whether it is near an empty space
	function shuffle() {
		for(var i = 1000; i>0; i--) {
			var int = parseInt(Math.random()*14);
			element = $(".puzzlepiece")[int];
			if(checkMove($(element))) {
				reposition(element, positionEmptyLeft, positionEmptyTop, false);
			}
		}
		start = new Date();
		numberOfMoves = 0;
		finished = false;
		$("body").css("background-image", "none");
	}
	
	// moves the puzzle piece into the nearby empty spot
	function move() {
		var oldPositionLeft = $(this).position().left,
			oldPositionTop = $(this).position().top,
			newPositionLeft,
			newPositionTop;
		if(checkMove($(this)) == 'E') {
			newPositionLeft = oldPositionLeft + 100;
			reposition(this, newPositionLeft, oldPositionTop, true);
		}
		else if(checkMove($(this)) == 'W') {
			newPositionLeft = oldPositionLeft -100;
			reposition(this, newPositionLeft, oldPositionTop, true);
		}
		else if(checkMove($(this)) == 'N') {
			newPositionTop = oldPositionTop -100;
			reposition(this, oldPositionLeft, newPositionTop, true);
		}
		else if(checkMove($(this)) == 'S') {
			newPositionTop = oldPositionTop +100;
			reposition(this, oldPositionLeft, newPositionTop, true);
		}
	}
	
	//checks whether pieces is movable to add class
	function movable(){
		if(!(checkMove($(this)) === "")) {
			$(this).addClass("movablepiece");
		}
		else{
			$(this).removeClass("movablepiece");
		}
	}
	
	//checks whether piece can move by returning the direction it can move
	function checkMove(elem) {
		var oldPositionLeft = elem.position().left,
			oldPositionTop = elem.position().top;
		var direction = "";
		if(positionEmptyLeft - oldPositionLeft == 100 && positionEmptyTop == oldPositionTop) {
			direction = "E";
		}
		else if(positionEmptyLeft - oldPositionLeft == -100 && positionEmptyTop == oldPositionTop) {
			direction = "W";
		}
		else if(positionEmptyTop - oldPositionTop == -100 && positionEmptyLeft == oldPositionLeft) {
			direction = "N";
		}
		else if(positionEmptyTop - oldPositionTop == 100 && positionEmptyLeft == oldPositionLeft) {
			direction = "S";
		}
		return direction;
	}
	
	//repositions the puzzle pieces either by having a transition or not. 
	function reposition(element, positionX, positionY, transition) {
			var oldPositionLeft = $(element).position().left,
				oldPositionTop = $(element).position().top;
			if(!transition) {
				element.style.left = positionX + "px";
				element.style.top = positionY + "px";
			}
			else {
				$(element).animate({'left' : positionX+"px", 'top' : positionY + "px" }, {duration : 400});
				numberOfMoves++;
				bottomDisplay();
			}
			positionEmptyLeft = oldPositionLeft;
			positionEmptyTop = oldPositionTop;
	}
	
	//sets the bottom display
	function bottomDisplay() {
		var end = new Date(),
		difference = parseInt((end - start)/1000);
		keepTrack.innerHTML = "Number of moves: " + numberOfMoves + " Time: " + difference + " seconds";
		if(checkComplete() && !finished) {
			var newRecord = document.createElement("li");
			$(keepRecord).append(newRecord);
			newRecord.innerHTML = "On try " + onTry + " you had " + numberOfMoves + 
			" number of moves in " + difference + " seconds";
			onTry++;
			finished = true;
		}
		
	}
	
	//checks whether the puzzle is complete; this method is called every second
	function checkComplete() {
		var works = false,
			rightX = 0,
			rightY = 0;
		for(var i = 0; i<15; i++) {
			element = $(".puzzlepiece")[i];
			if($(element).position().left == rightX && $(element).position().top == rightY) {
				works = true;
			}
			else {
				works = false;
				break;
			}
			if(rightX < 300) {
				rightX = rightX + 100;
			}
			else {
				rightX = 0;
				rightY = rightY + 100;
			}
		}
		if(works) {
			$("body").css("background-image", "url(http://www.getentrepreneurial.com/images2/winner-win.jpg)");
		}
		return works;
	}
});