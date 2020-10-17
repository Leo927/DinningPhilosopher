function drawPhilosophers (number, radius) {
	console.log('adding philosophers');
	const step = 2*Math.PI/number;

	for (var i = 0; i < number; i++) {
		var rotate = Math.PI/2- i*step;
		var position = calPosition(i);
		var philosopher = $("<img></img>")
							.attr("src", "assets/phi-face.svg")
							.attr("id", "philosopher"+i)
							.addClass("image")
							.addClass("philosopher")
							.css({top: position.top+"%", left: position.left + '%'})
							.attr("no", i)
							.attr("status",STATUS.THINKING);
		$('#canvas').append(philosopher);
	}
	
}

function addChopSticks(){
	console.log('addHiddenChopsticksToPhs');
	const step = 2*Math.PI/NUM_PHI;
	for (var i = 0; i< NUM_PHI; i++) {
		var position = calPosition(i+0.5);
		var rotate = Math.PI/2- (i+0.5)*step;
		var chopstick = $("<img></img>")
							.attr("src", "assets/chopstick.svg")
							.attr("id", "chopstick"+(i))
							.addClass("image")
							.addClass("chopstick")
							.css({top: position.top+"%", left: position.left + '%'})
							.css({transform : 'translate(-50%, -50%) rotate('+rotate+'rad) '})
							.attr("avaiable",1)
							.attr("no", i);
		$('#canvas').append(chopstick);
	}
}

//Handle Pushing Start Button
function start () {	
	playing = !playing;
	console.log($("#start"))
	if(playing)
	{
		$("#start").text("Pause");
		$("#start").removeClass("btn-success");
		$("#start").addClass("btn-danger");
	}
	else{
		$("#start").text("Play");
		$("#start").removeClass("btn-danger");
		$("#start").addClass("btn-success")
	}
}

function autoPlayer () {
	if(playing)
		next();
	setTimeout(autoPlayer, 300);
}

//Handle Pushing Next Button
function next () {	
	//for philospher 0 to 4
	//if is thinking
		//get left and right chopsticks
		//if they are not avaible, goto next philosopher;
		//mark them as unavaiable
		//move those chopsticks to the philosopher
		//add eating icon
		//change status to eating
	//if is eating
		//remove eating icons
		//move left and right chopsticks back to center
		//mark those chopsticks as avaiable
		//change status to thinking
	
	phiAction(currentP);	
}

function phiAction(i){
	currentP = i + 1 - (i>=(NUM_PHI - 1))*NUM_PHI;
	if(i>=NUM_PHI || i <0)
		return;
	phi = $("#philosopher"+i);
	chopsticks = getMyChopSticks(i);
		switch ($(phi).attr("status")) {
			case STATUS.THINKING:				
				if (checkChopsticksAvaiable(chopsticks)==false){
					writeLog('philosopher '+i+' no chopsticks', ['text-danger']);
					return;
				}
				setChopstickStatus(chopsticks, 0);
				moveChopSticksToPhi(phi);
				addEatingIcon(phi);
				$(phi).attr("status", STATUS.EATING);
				writeLog('philosopher '+i+' is eating', ['text-success']);				
				break;
			case STATUS.EATING:
				$(".eatingIcon").remove();
				chopsticks.forEach(releaseChopstick);
				$(phi).attr("status", STATUS.THINKING);
				writeLog('philosopher '+i+' done eating', ['text-info']);
				break;
			default:
				console.log('error','incorrect philosopher status');
				break;
		}
	
}

function writeLog (message, classes) {
	var line = $("<p></p>").addClass("m-0")
							.text(message);
	if(classes!=undefined)	{
		for (var i = classes.length - 1; i >= 0; i--) {
			line.addClass(classes[i])
		}
	}
	$("#log").append(line);
	$("#log").scrollTop($('#log').prop("scrollHeight"));
}

function releaseChopstick (chopstick) {
	const step = 2*Math.PI/NUM_PHI;
	var no = parseInt($(chopstick).attr("no"));
	var position = calPosition(no+0.5);
	$(chopstick).animate({top: position.top+"%", left: position.left + '%'})
	$(chopstick).attr("avaiable", 1);
}


function checkChopsticksAvaiable (chopsticks) {
	for (var j = chopsticks.length - 1; j >= 0; j--) {
		if(chopsticks[j].attr("avaiable")==false)
			return false;
	}
	return true;
}

function setChopstickStatus (chopsticks, status) {
	for (var j = chopsticks.length - 1; j >= 0; j--) {					
		chopsticks[j].attr("avaiable", status);	
	}
}

function moveChopSticksToPhi(phi){
	phiNo = $(phi).attr("no");
	const distance = 0.1;
	chopsticks = getMyChopSticks(phiNo);
	chopsticks.forEach(function (chop, index) {
		no = parseFloat(phiNo) + (index - 0.5)/0.5*distance;
		position = calPosition(no);
		chop.animate({top:position.top+"%", left:position.left+"%"});
	});
}

function addEatingIcon (phi) {
	console.log('adding eating icon')
	const iconSize = 30;
	var position = calPosition(phi.attr("no"));
	var eatingIcon = $("<img></img>")
							.attr("src", "assets/eating.svg")
							.addClass("eatingIcon")
							.addClass("image")
							.css({top: (position.top + 12 )+"%", left: position.left+"%"})
							.css({transform : 'translate(-50%, -50%)'})
							.width("30px")
							.height("30px");
	$("#canvas").prepend(eatingIcon);
}

function calPosition(i){
	const step = 2*Math.PI/NUM_PHI;
	var left = 50+RADIUS*Math.sin(i*step);
	var top = 50+RADIUS*Math.cos(i*step);
	return {left:left, top:top};
}

function getMyChopSticks(no){
	var left = (no-1) + (no==0)*NUM_PHI;
	var right = no;
	return [$("#chopstick"+left),$("#chopstick"+right)];
}

//Handle Pushing Pause Button
function pause () {
	playing = false;
}

function reset () {
	currentP = 0;
	playing = false;
	console.log('reset in progress');
	$("#canvas").empty();
	drawPhilosophers(NUM_PHI, RADIUS);
	addChopSticks(NUM_PHI, RADIUS);
	phiStatus = new Array(NUM_PHI);
	for (var i = 0; i < NUM_PHI; i++) {
		phiStatus[i] = STATUS.THINKING;
	}
	$("#log").text("")
}

const STATUS = {
	EATING: "eating",
	THINKING: "thinking"
}
var playing ;
var currentP;
const NUM_PHI = 5;
const RADIUS = 30;
var phiStatus = [];
$(document).ready(function () {	
	reset();
	autoPlayer();
	$("#reset").on("click", reset);
	$("#next").on("click", next);
	$("#start").on("click", start);
});


