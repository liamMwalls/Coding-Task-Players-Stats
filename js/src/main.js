var playerDropdown = document.getElementById('playerSelect');

var request = new XMLHttpRequest();
request.open('GET', '/js/data/player-stats.json', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // Success!
    data = JSON.parse(request.responseText),
	playersData = data.players;

    console.log(playersData)
    console.log(playersData.length)

    //looping through players adding options to select
    for(var i=0; i < playersData.length; i++){
    	playerOption = document.createElement('option');
    	playerOption.value = i;
    	playerOption.text = playersData[i].player.name.first + " " + playersData[i].player.name.last;
    	playerDropdown.add(playerOption)
    }

    //Call stats create function
    statsObjCreate(0);

  } else {
    console.log("Failed to request data")
  }
};

//Event listener on change for select playerDropdown
playerDropdown.addEventListener("change", changePlayer);

function changePlayer() {
	var indexVal = playerDropdown.value;

	statsObjCreate(indexVal);
}

function statsObjCreate(indexId) {
	var statsObj= {};

    for (var i = 0; i < playersData[indexId].stats.length; i++) {
    	var name = playersData[indexId].stats[i].name,
    		value = playersData[indexId].stats[i].value;

		statsObj[name] = value;
    };

    var playersName = playersData[indexId].player.name.first + " " + playersData[indexId].player.name.last,
    	playersPosition = playersData[indexId].player.info.position,
    	teamId = playersData[indexId].player.currentTeam.id,
    	imageId = playersData[indexId].player.id;

    	//Changing position letter to text
    	if (playersPosition == "G") {
    		playersPosition = "Goalkeeper";
    	} else if (playersPosition == "D") {
    		playersPosition = "Defender";
    	} else if (playersPosition == "M") {
    		playersPosition = "Midfielder";
    	} else if (playersPosition == "F") {
    		playersPosition = "Forward";
    	}

    //Passing the stats Object and created stats to player stats function 
	playerStats(statsObj, playersName, playersPosition, teamId, imageId);
}

//Creates the stats for the player selected
function playerStats(stats, name, position, teamId, image) {

	//changing image depending on the team id
	document.getElementById('player').className = "c-player team-" + teamId;
	document.getElementById("playerImage").src="/img/p" + image + ".png";

	//Create averages from stats passed in from data
	var goalsPerMatch = (stats.goals / stats.appearances).toFixed(2),
		passesPerMin = ((stats.fwd_pass + stats.backward_pass) / stats.mins_played).toFixed(2);

	//creating array of elements and variables to loop over
	var elements = [
		{
			element: "playerName",
			variable: name
		},
		{
			element: "playerPosition",
			variable: position
		},
		{
			element: "appearanceValue",
			variable: stats.appearances
		},
		{
			element: "goalsValue",
			variable: stats.goals
		},
		{
			element: "assistsValue",
			variable: stats.goal_assist
		},
		{
			element: "goalsPMValue",
			variable: goalsPerMatch
		},
		{
			element: "passesPMValue",
			variable: passesPerMin
		}
	]

	for (i=0; i < elements.length; i++) {
		//If stat isnt present make it 0
		if(elements[i].variable == null) {
			elements[i].variable = "0";
		} 		

		//Add stat to each element passed into the array
		var text = document.createTextNode(elements[i].variable),
			item = document.getElementById(elements[i].element);;

		if (item.childNodes.length > 0) {
			item.removeChild(item.childNodes[0]);
	 	}

	 	item.appendChild(text);
	}	
}

request.send();