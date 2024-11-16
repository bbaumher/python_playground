// On Load
function init() {

	// check cookies and load words if available
	if (checkCookieExists("guessed")) {
		guessed = getCookie("guessed");
		var words = document.getElementById('words');
		guessed.forEach(word => {
			var l = document.createElement('li');
			l.innerHTML = word;
			words.prepend(l);
		});
		document.getElementById('score').innerHTML = calculate_score();
		game_level();
	}
	var letters = document.getElementById('letters');
	game.letters.forEach(letter => {
		var l = document.createElement('div');
		l.classList.add("flex-item");
		var p = document.createElement('p');
		p.innerHTML = letter.toUpperCase();
		l.appendChild(p);
		l.onclick = function () { click_letter(letter); }
		if (letter == game.main_letter) {
			l.classList.add("special-letter");
		}
		letters.appendChild(l);
	});

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
			document.getElementById("ephemeral").innerHTML = "";
			document.getElementById("ephemeral").classList.remove("fade");
			document.getElementById("display").innerHTML += String.fromCharCode(evt.keyCode).toUpperCase();
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


// Game Play Logic
function update(guessed) {
	message = checkWord(guessed);
	if (message.length > 0) {
		ephemeral_message(message);
	}
	game_level();
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
			document.cookie = ('guessed=' + JSON.stringify(guessed));
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
	let level = "Beginner"

	if (score == level10) {
		level = "Queen Bee!";
	} else if (score > level9) {
		level = "Genius";
	} else if (score > level8) {
		level = "Amazing";
	} else if (score > level7) {
		level = "Great";
	} else if (score > level6) {
		level = "Nice";
	} else if (score > level5) {
		level = "Solid";
	} else if (score > level4) {
		level = "Good";
	} else if (score > level3) {
		level = "Moving Up";
	} else if (score > level2) {
		level = "Good Start";
	} else if (score > level1) {
		level = "Beginner";
	}
	document.getElementById("qual_score").innerHTML = level;
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
			resultPara.textContent = 'MDN shared successfully'
		)
		.catch((e) =>
			resultPara.textContent = 'Error: ' + e
		);
}

function click_letter(l) {
	document.getElementById("display").innerHTML += l.toUpperCase();
}

//Shuffle Button Action
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

// Shows message of why word did not work
function ephemeral_message(message) {
	message_el = document.getElementById("ephemeral");
	message_el.innerHTML = message;
	message_el.classList.add('fade');
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

// Cookie Features
function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		return JSON.parse(parts.pop().split(';').shift());
	}
}

function checkCookieExists(cookieName) {
	if (document.cookie.split(';').some(item => item.trim().startsWith(cookieName + '='))) {
		return true;
	}
	return false;
}
