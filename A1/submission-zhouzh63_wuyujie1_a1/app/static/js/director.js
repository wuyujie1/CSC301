/* director.js - Theatre blocking JavaScript */
"use strict";
console.log('director.js') // log to the JavaScript console.

/* UI functions below - DO NOT change them */
var saveOK = 0;
// Function to remove all blocking parts from current window
function removeAllBlocks() {
	blocks.innerHTML = '';
	setScriptNumber('');
}

function displaymsg(msg){
	const html = `<p><em>"${msg}"</em></p>`
	const block = document.createElement('div'); block.className = 'col-lg-12';
	block.innerHTML = html;
	blocks.appendChild(block)
}

/* This function returns a JavaScript array with the information about blocking displayed
in the browser window.*/
function getBlockingDetailsOnScreen() {

	// this array will hold
	const allBlocks = []
	// go through all of the script parts and scrape the blocking informatio on the screen
	for (let i = 0; i < blocks.children.length; i++) {
		const block = {};  const blockElement = blocks.children[i]
		block.part = i + 1;
		block.text = blockElement.children[1].textContent;
		block.actors = []
		const actors = blockElement.children[2].children
		for (let j = 0; j < actors.length; j++) {
			block.actors.push([actors[j].textContent, actors[j].children[0].value])
		}
		allBlocks.push(block)
	}

	// Look in the JavaScript console to see the result of calling this function
	return allBlocks;
}

function setScriptNumber(num) {
	const scriptNum = document.querySelector('#scriptNum')
	scriptNum.innerHTML = `${num}`
}

function getScriptNumber(num) {
	return document.querySelector('#scriptNum').innerHTML
}

/* Function to add the blocking parts to browser window */
function addBlockToScreen(scriptText, startChar, endChar, actors, positions) {

	const scriptPartText = scriptText.slice(startChar, endChar + 1);
	const html = `<h4>Part ${blocks.children.length + 1}</h4>
      <p><em>"${scriptPartText}"</em></p>
      <div class='actors'></div>`

    const block = document.createElement('div')
    block.className = 'col-lg-12'
    block.innerHTML = html;
    for (let j = 0; j < actors.length; j++) {
    	const actorHtml = `${actors[j]}<input id='scriptText' style="width: 40px;" type="text" name="" value="${positions[j]}">`
    	const actorContainer = document.createElement('p');
    	actorContainer.innerHTML = actorHtml;
    	block.children[2].appendChild(actorContainer)
	}

    console.log(block)
    blocks.appendChild(block)

}

/* UI functions above */


// Adding example script blocking
// (the blocks should be removed from the screen when getting a script from the server)
addBlockToScreen(`That's it Claudius, I'm leaving!Fine! Oh..he left already..`, 0, 31, ['Hamlet', 'Claudius'], [5, 2])
addBlockToScreen(`That's it Claudius, I'm leaving!Fine! Oh..he left already..`, 32, 58, ['Hamlet', 'Claudius'], ['', 3])
setScriptNumber('example')

//////////////
// The two functions below should make calls to the server
// You will have to edit these functions.

function getBlocking() {
	saveOK = 0;
	removeAllBlocks();
	var part = 1;
	const scriptNumber = scriptNumText.value;
	setScriptNumber(scriptNumber)
	console.log(`Get blocking for script number ${scriptNumber}`)

	console.log('Getting ')
	/// Make a GET call (using fetch()) to get your script and blocking info from the server,
	// and use the functions above to add the elements to the browser window.
	// (similar to actor.js)
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
			while (part <= Object.keys(jsonResult['part']).length / 2){
				var act = [];
				var actpo = [];
				for (var i in jsonResult['actor']){
					act.push(i.slice(i.indexOf(' ')));
					actpo.push(jsonResult["actor"][i][part - 1]);

				}
				addBlockToScreen(jsonResult['content'],
				 parseInt(jsonResult['part'][(part - 1) * 2], 10),
				  parseInt(jsonResult['part'][(part - 1) * 2 + 1], 10), act, actpo)
				part += 1;
			}
			saveOK = 1;
		}).catch((error) => {
		// if an error occured it will be logged to the JavaScript console here.
				console.log("An error occured with fetch:", error)
		})

}

function changeScript() {
	// You can make a POST call with all of the
	// blocking data to save it on the server
	if (!saveOK){
		removeAllBlocks();
		displaymsg("Please load a script first")
		return;
	}

	const url = '/script';

	var info = getBlockingDetailsOnScreen()
	console.log(info)
	var actor_dic = {}
	var content = ""
	var part_time = []
	var curr_time = 0
	for (var block in info){
		content += info[block]["text"].slice(1,-1)
		part_time.push(curr_time.toString())
		part_time.push((curr_time+info[block]["text"].length-3).toString())
		curr_time += info[block]["text"].length-2
		for (var act in info[block]["actors"]){
			if (info[block]["actors"][act][0].trim() in actor_dic) {
				actor_dic[info[block]["actors"][act][0].trim()].push(parseInt(info[block]["actors"][act][1], 10).toString())
			} else {
				actor_dic[info[block]["actors"][act][0].trim()] = [parseInt(info[block]["actors"][act][1], 10).toString()]
			}
		}
	}
	// The data we are going to send in our request
	// It is a Javascript Object that will be converted to JSON
	let data = {
		scriptNum: getScriptNumber(),
		// What else do you need to send to the server?
		actor_info: actor_dic,
		content_info: content,
		part: part_time
	}
		console.log('Data: ', data)

    // Create the request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

		var flag = 0;
		var pt, actors;
		for (pt = 0; pt < data['part'].length / 2; pt++){
			var actlst = [];
			var result = [];
			for (actors in data['actor_info']){
				if (actlst.includes(data['actor_info'][actors][pt])){
					if (flag == 0){
						removeAllBlocks();
					}
					flag = 1;
					result.push(data['actor_info'][actors][pt]);
				} else{
					actlst.push(data['actor_info'][actors][pt]);}
				if (data['actor_info'][actors][pt][0] == ' ' || isNaN(data['actor_info'][actors][pt])
				 || parseInt(data['actor_info'][actors][pt], 10) < 0 ||
				  parseInt(data['actor_info'][actors][pt], 10) > 8){
					if (flag == 0){
						removeAllBlocks();
					}
					displaymsg(`User input(s) for ${actors} in part ${parseInt(pt, 10) + 1} not valid, please re-enter !`);
					flag = 1;
				}
			}
			for (var element in result){
				displaymsg(`User input(s) for position ${data['actor_info'][actors][pt]} in part ${parseInt(pt, 10) + 1} has duplicates, please re-enter !`);
			}
		}
		if (flag == 1){
			saveOK = 0;
			return;
		}

    // Send the request
    fetch(request)
    	.then((res) => {
    		//// Do not write any code here
    		// Logs success if server accepted the request
    		//   You should still check to make sure the blocking was saved properly
    		//   to the text files on the server.
    		console.log('Success')
	        return res.json()
	        ////
	    })
	    .then((jsonResult) => {
	    	// Although this is a post request, sometimes you might return JSON as well
	        console.log('Result:', jsonResult)

	    }).catch((error) => {
	    	// if an error occured it will be logged to the JavaScript console here.
	        console.log("An error occured with fetch:", error)
	    })
}
