/* actor.js - Theatre blocking JavaScript */
"use strict";
console.log('actor.js')  // log to the JavaScript console.

// Function to remove all blocking parts from current window
function removeAllBlocks() {
	blocks.innerHTML = ''
}

/* Function to add a blocking part to browser window */
function addScriptPart(scriptText, startChar, endChar, position) {
	const scriptPartText = scriptText.slice(startChar, endChar + 1);
	const part = blocks.children.length + 1

	const html = `<h4>Part ${part}</h4>
          <p><em>"${scriptPartText}"</em></p>
          <p>Stage Position: <strong>${position}</strong></p>`

    const block = document.createElement('div'); block.className = 'col-lg-12';
    block.innerHTML = html;
    blocks.appendChild(block)
}

function displaymsg(msg){
	const html = `<p><em>"${msg}"</em></p>`
	const block = document.createElement('div'); block.className = 'col-lg-12';
	block.innerHTML = html;
	blocks.appendChild(block)
}

// Function to add the example block (when clicking the example block button)
function getExampleBlock() {
	const url = '/example';

	// A 'fetch' AJAX call to the server.
    fetch(url)
    	.then((res) => {
    		//// Do not write any code here
	        return res.json()
	        //// Do not write any code here
	    })
	    .then((jsonResult) => {
	    	// This is where the JSON result (jsonResult) from the server can be accessed and used.
	        console.log('Result:', jsonResult)
	        // Use the JSON to add a script part
	        addScriptPart(jsonResult[0], jsonResult[1], jsonResult[2], jsonResult[3])
	    }).catch((error) => {
	    	// if an error occured it will be logged to the JavaScript console here.
	        console.log("An error occured with fetch:", error)
	    })
}

/* Write the code to get the blocking for a particular script and actor */
function getBlocking() {
	var part = 0;
	// Remove any existing blocks
	removeAllBlocks();

	// Get the script and actor numbers from the text box.
	const scriptNumber = scriptNumText.value;
	const actorNumber = actorText.value;
	console.log(`Get blocking for script number ${scriptNumber} for actor ${actorNumber}`)

	/* Add code below to get JSON from the server and display it appropriately. */
			if (isNaN(scriptNumber) | scriptNumber <= 0 | scriptNumber[0] == ' '){
				displaymsg("User input(s) not valid, please re-enter !")
				return;
			}
		  fetch(`/script/${scriptNumber}`)
			  .then((res) => {
				  return res.json()
			  })
			  .then((jsonResult) => {
					if (jsonResult == "Invalid Script ID"){
						displaymsg("User input(s) not valid, please re-enter !")
						return;
					}
					if (actorNumber > Object.keys(jsonResult['actor']).length |
					 isNaN(actorNumber) | actorNumber <= 0 | actorNumber[0] == ' '){
						displaymsg("User input(s) not valid, please re-enter !")
						return;
					}
				  console.log('Result:', jsonResult)
					var actors, act;
					for (actors in jsonResult['actor']){
						if (actors.includes(actorNumber)){
							act = actors;
						}
					}
					while (part < jsonResult['part'].length / 2){
				  	addScriptPart(jsonResult['content'],
						 parseInt(jsonResult['part'][part * 2], 10),
						  parseInt(jsonResult['part'][part * 2 + 1], 10),
							 jsonResult["actor"][act][part])
				  	part += 1;}
			  }).catch((error) => {
				// if an error occured it will be logged to the JavaScript console here.
					  console.log("An error occured with fetch:", error)
			  })
}
