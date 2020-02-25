/* actor.js - Theatre blocking JavaScript */
"use strict";
console.log('lighting.js')  // log to the JavaScript console.

// Function to remove all blocking parts from current window
function removeAllBlocks() {
	blocks.innerHTML = ''
}

/* Function to add a blocking part to browser window */
function addScriptPart(scriptText, startChar, endChar, positions) {
	const scriptPartText = scriptText.slice(startChar, endChar + 1);
	const part = blocks.children.length + 1
	const html = `<h4>Part ${part}</h4>
          <p><em>"${scriptPartText}"</em></p>
					<p>The Position(s) Need Light: <strong>${positions}</strong></p>`

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

/* Write the code to get the blocking for a particular script and actor */
function getBlocking() {
	// Remove any existing blocks
	removeAllBlocks();

	// Get the script and actor numbers from the text box.
	const scriptNumber = scriptNumText.value;
	console.log(`Get blocking for script number ${scriptNumber}`)

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
				  console.log('Result:', jsonResult)
					var part_lst = part_dividing(jsonResult)
					var index = 0;
					while (index < jsonResult['part'].length / 2){
				  	addScriptPart(jsonResult['content'],
						 parseInt(jsonResult['part'][index * 2], 10),
						  parseInt(jsonResult['part'][index * 2 + 1], 10),
							 part_lst[index])
				  	index += 1;
					}
			  }).catch((error) => {
				// if an error occured it will be logged to the JavaScript console here.
					  console.log("An error occured with fetch:", error)
			  })
}

function part_dividing(jsonObject) {
	var parts_num, index;
	parts_num = jsonObject['part'].length / 2;
	index = 0;
	var result = new Array();
	while (index < parts_num){
		var part = new Array();
		for (var key in jsonObject['actor']){
			var temp = parseInt(jsonObject['actor'][key][index])
			if (temp != 0){
				part.push(temp)
			}
		}
		result.push(part.sort())
		index += 1
	}
	return result
}
