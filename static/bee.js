


// On Load
function init() {
	let stored = getLocalStorage();
	if (!stored) {
		// Legacy code, keeping for beta users
		// Delete soon. convert cookie to localstorage
		if (checkCookieExists("guessed")) {
			guessed = getCookie("guessed");
			samePuzzle = true;
			guessed.forEach(word => {
				if (!game.words.includes(word)) {
					samePuzzle = false;
				}
			});
			if (samePuzzle) {
				setLocalStorage(guessed);
				delete_cookie("guessed");
			}
		}
	}
	// check localstorage for stored guesses
	stored = getLocalStorage();
	if (stored) {
		guessed = stored;
		var words = document.getElementById('words');
		guessed.forEach(word => {
			var l = document.createElement('li');
			l.innerHTML = word;
			words.prepend(l);
		});
		document.getElementById('score').innerHTML = calculate_score();
		level = game_level();
		initProgressBar(level);
	} else {
		initProgressBar(0);
	}
	cnt = 0;
	ele_cnt = 0;
	var hex = document.getElementById('hexagon-container');
	//letters = game.letters.remove(game.main_letter);
	const divChildren = Array.from(hex.childNodes) // Convert NodeList to Array
  .filter(node => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV'); 

	divChildren.forEach(child => {
		var l = document.createElement('div');
		l.classList.add("hex-item");
		l.classList.add("big");
		var p = document.createElement('p');
		char = "";
		if (ele_cnt == 3) {
			char = game.main_letter;
			child.classList.add("special-hex");
		} else {
			if (game.letters[cnt] == game.main_letter) {
				cnt ++;
			}
			char = game.letters[cnt];
			cnt += 1;
		}

		p.innerHTML = char.toUpperCase();
		l.appendChild(p);
		l.onclick = function () { onLetterBoxClick(l.firstChild.innerHTML); }
		if (char == game.main_letter) {
			child.classList.add("special-hex");
			//l.classList.add("special-letter");
		}
		child.appendChild(l);
		ele_cnt++;
	}); 


	// Straight line letters
	/** 
	var letters = document.getElementById('letters');
	game.letters.forEach(letter => {
		var l = document.createElement('div');
		l.classList.add("flex-item");
		var p = document.createElement('p');
		p.innerHTML = letter.toUpperCase();
		l.appendChild(p);
		l.onclick = function () { onLetterBoxClick(letter); }
		if (letter == game.main_letter) {
			l.classList.add("special-letter");
		}
		letters.appendChild(l);
	});
*/
	document.addEventListener('keyup', function (evt) {
		evt = (evt) ? evt : window.event;
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		// Enter key
		if (charCode === 13) {
			update(guessed);
			return;
		} else if (charCode === 8) {
			// this is backspace keyCode
			backspace();
		} else {
			// Non alpha character
			//if (charCode > 31 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
			if (!(charCode > 64 && charCode < 91) && !(charCode > 96 && charCode < 123)) {
				console.log(charCode)
				return;
			}
			// display character
			onAlphaKeyPress(evt);
		}
	});

	// Share button
	const btn = document.getElementById('share-btn');
	const resultPara = document.querySelector('.result');
	btn.addEventListener('click', () => {
		let url = window.location.href;
		let level = document.getElementById("qual_score").innerHTML;
		let words = document.getElementById("words").childNodes.length;
		on_share(url, level, words, resultPara)
	});

}

function initProgressBar(level) {
	bar = document.getElementById("line");
	var score_el = document.getElementById('score');
	bar.removeChild(score_el);

	for (let i = 0; i < 9; i++) {
		var dot = document.createElement('span');
		dot.classList.add("dot");
		if (i < level) {
			dot.classList.add("past-level");
		} else if (level == i) {
			dot.classList.add("current");
			dot.appendChild(score_el);
		}
		// last level
		if (i == 8) {
			dot.classList.add("last-level");
		}
		bar.appendChild(dot);
	}
}

function progressBar(level) {
	bar = document.getElementById("line");
	dots = bar.children;
	let score = parseInt(document.getElementById('score').innerHTML);
	let score_el;
	for(let i = 0; i < dots.length; i++){
		if (i < level) {
			if (dots[i].classList.contains("current")) {
				dots[i].classList.remove("current");
				dots[i].classList.add("past-level");
				score_el = dots[i].firstChild;
				dots[i].removeChild(score_el);
			}
		} else if (i == level) {
			dots[i].classList.add("current");
			score_el.innerHTML = score;
			dots[i].appendChild(score_el);
		}
	}
}


// Game Play Logic
function update(guessed) {
	message = checkWord(guessed);
	if (message.length > 0) {
		ephemeral_message(message);
	}
	level = game_level();
	document.getElementById("display").innerHTML = "";
}

function checkWord() {
	let guess = document.getElementById("display").innerHTML;
	let score = parseInt(document.getElementById('score').innerHTML);

	guess = ignoreCase(guess);

	let message = "";
	if (game.words.includes(guess)) {
		if (guessed.indexOf(guess) === -1) {
			guessed.push(guess);
			setLocalStorage(guessed);
			add_word(guess);
			if (game.pangrams.includes(guess)) {
				score += 7;
				message = "You found a pangram!";
			}
			if (guess.length == 4) {
				score += 1;
			} else if (guess.length > 4) {
				score += guess.length;
			}
		} else {
			message = "Already Guessed!";
		}
	} else if (guess.length < 4) {
		message = "Word is too short";
	} else if (!containsLetters(guess)) {
		message = "Used not allowed letters";
	} else if (!containsSpecialChar(guess)) {
		message = "Missing special letter";
	} else {
		message = "Not a word :/"
	}
	document.getElementById('score').innerHTML = score;
	
	return message;
}

function game_level() {
	total = game.total_score;
	level1 = 0;
	level2 = Math.min(total * 0.1, 15);
	level3 = Math.min(total * 0.2, 30);
	level4 = Math.min(total * 0.3, 50);
	level5 = total * 0.5;
	level6 = total * 0.6;
	level7 = total * 0.7;
	level8 = total * 0.8;
	level9 = total * 0.9;
	level10 = total
	let score = parseInt(document.getElementById('score').innerHTML);
	let levelNum = 0;
	let old_level = document.getElementById("qual_score").innerHTML;
	let level = "";


	if (score == level10) {
		level = "Queen Bee!";
		levelNum = 9;
	} else if (score > level9) {
		level = "Genius";
		levelNum = 8;
	} else if (score > level8) {
		level = "Amazing";
		levelNum = 7;
	} else if (score > level7) {
		level = "Great";
		levelNum = 6;
	} else if (score > level6) {
		level = "Nice";
		levelNum = 5;
	} else if (score > level5) {
		level = "Solid";
		levelNum = 4;
	} else if (score > level4) {
		level = "Good";
		levelNum = 3;
	} else if (score > level3) {
		level = "Moving Up";
		levelNum = 2;
	} else if (score > level2) {
		level = "Good Start";
		levelNum = 1;
	} else if (score > level1) {
		level = "Beginner";
		levelNum = 0;
	}
	document.getElementById("qual_score").innerHTML = level;
	if (level.valueOf() != old_level.valueOf()) {
		console.log("progress");
		progressBar(levelNum);
	}

	return levelNum;
}

function containsLetters(guess) {
	for (let i = 0; i < guess.length; i++) {
		if (game.letters.indexOf(guess[i]) === -1) {
			return false;
		}
	}
	return true;
}

function containsSpecialChar(guess) {
	return guess.includes(game.main_letter);
}

function score_word(word) {
	score = 0;

	if (word.length == 4) {
		return 1;
	}
	// Longer Word
	if (word.length > 4) {
		score = word.length;
		if (game.pangrams.includes(word)) {
			score += 7;
		}
	}
	return score;
}

function calculate_score() {
	score = 0;
	guessed.forEach(guess => {
		score += score_word(guess);
	});
	return score;
}

// Helper Functions for characters
function ignoreCase(word) {
	return word.toLowerCase();
}

// UI Functions

// UI Actions
// Share Button Action
function on_share(url, level, words) {

	let text = "I found " + words + " words and achieved level " + level + "!";
	let shareData = {
		title: 'Spelling Bee by gRab',
		text: text,
		url: url,
	};

	if (!navigator.canShare) {
		resultPara.textContent = 'Web Share API not available';
		return;
	}
	if (!navigator.canShare(shareData)) {
		resultPara.textContent = 'Share data unsupported, disallowed, or invalid';
		return;
	}
	navigator.share(shareData)
		.then(() =>
			resultPara.textContent = 'shared successfully'
		)
		.catch((e) =>
			resultPara.textContent = 'Error: ' + e
		);
}

//Shuffle Button Action
/** 
function shuffle() {
	letters = document.getElementById('letters')
	let array = document.getElementById('letters').children;
	// Iterate over the array in reverse order
	for (let i = array.length - 1; i > 0; i--) {

		var clonedElement1 = array[i].cloneNode(true);
		// Generate Random Index
		const j = Math.floor(Math.random() * (i + 1));

		// Swap elements
		var clonedElement2 = array[j].cloneNode(true);

		letters.replaceChild(clonedElement1, array[j]);
		letters.replaceChild(clonedElement2, array[i]);
	}
	var children = [...letters.children];

	children.forEach(letter => {
		letter.onclick = function () { click_letter(letter.firstChild.innerHTML); }
	});
}
*/
function shuffle() {
	array = game.letters;
	// Iterate over the array in reverse order
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	  }
	  game.letters = array;
	rerenderHex(array);
}

function rerenderHex(letters) {
	cnt = 0;
	ele_cnt = 0;
	var hex = document.getElementById('hexagon-container');
	//letters = game.letters.remove(game.main_letter);
	const divChildren = Array.from(hex.childNodes) // Convert NodeList to Array
  .filter(node => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV'); 

	divChildren.forEach(child => {
		l = child.children[0];
		p = l.children[0];
		char = "";
		if (ele_cnt == 3) {
			char = game.main_letter;
			child.classList.add("special-hex");
		} else {
			if (game.letters[cnt] == game.main_letter) {
				cnt ++;
			}
			char = game.letters[cnt];
			cnt += 1;
		}

		p.innerHTML = char.toUpperCase();
		ele_cnt++;
	}); 

}
// Shows message of why word did not work
function ephemeral_message(message) {
	message_el = document.getElementById("ephemeral");
	message_el.innerHTML = message;
	message_el.classList.add('fade');
}

function appendLetter(letter) {
	letter = letter.toUpperCase();
	if (document.getElementById("display").innerHTML.length < 1) {
		document.getElementById("ephemeral").innerHTML = "";
		document.getElementById("ephemeral").classList.remove("fade");
	}
	document.getElementById("display").innerHTML += letter;
}

// Letter Key Pressed
function onAlphaKeyPress(event) {
	appendLetter(String.fromCharCode(event.keyCode));

}

// Display the letter clicked on
function onLetterBoxClick(l) {
	appendLetter(l);
}

// Adds correct word to visibly show
function add_word(word) {
	var words = document.getElementById('words');

	var l = document.createElement('li');
	l.innerHTML = word;

	words.prepend(l);
}

// User Input
function backspace() {
	str = document.getElementById("display").innerHTML;
	document.getElementById("display").innerHTML = str.slice(0, -1);
}

// Local Storage Helpers
function setLocalStorage(value) {
	localStorage.setItem("bee-"+date, JSON.stringify(value));
}

function getLocalStorage() {
	return JSON.parse(localStorage.getItem("bee-"+date));
}



// Cookie Features
function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		return JSON.parse(parts.pop().split(';').shift());
	}
}

function removeCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		return JSON.parse(parts.pop().split(';').shift());
	}
}

function get_cookie(name){
    return document.cookie.split(';').some(c => {
        return c.trim().startsWith(name + '=');
    });
}

function delete_cookie( name, path, domain ) {
	if( get_cookie( name ) ) {
	  document.cookie = name + "=" +
		((path) ? ";path="+path:"")+
		((domain)?";domain="+domain:"") +
		";expires=Thu, 01 Jan 1970 00:00:01 GMT";
	}
  }

function checkCookieExists(cookieName) {
	if (document.cookie.split(';').some(item => item.trim().startsWith(cookieName + '='))) {
		return true;
	}
	return false;
}
