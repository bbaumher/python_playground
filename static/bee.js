function init() {
	var letters = document.getElementById('letters');
	game.letters.forEach(letter => {
		var l = document.createElement('div');
		l.classList.add("flex-item");
		var p = document.createElement('p');
		p.innerHTML = letter;
		l.appendChild(p);
		l.onclick = function () { click_letter(letter); }
		if (letter == game.main_letter) {
			l.classList.add("special-letter");
		}
		letters.appendChild(l);
	});
	// Adding keypress event listener to the password input
	document.getElementById("guess").addEventListener("keypress", function (event) {
		if (event.keyCode === 13) {
			// Triggering click event on button when Enter key is pressed
			document.getElementById("btn").click();
		}
	});
	const btn = document.getElementById('share-btn');
	const resultPara = document.querySelector('.result');
	btn.addEventListener('click', () => {
		on_share()
      });
}

function click_letter(l) {
	document.getElementById("guess").value += l
}

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

function on_share() {
	let url = window.location.href;
	let level = document.getElementById("qual_score").innerHTML;
	let words = document.getElementById("words").childNodes.length;
	let text = "I found " + words + " words and achieved level " + level + "!";
	let shareData = {
		title: 'Spelling Bee by gRab',
		text: text,
		url: url,
	};

	const btn = document.getElementById('share-btn');
	const resultPara = document.querySelector('.result');

	btn.addEventListener('click', () => {
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
			)
	});

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

function add_word(word) {
	var words = document.getElementById('words');

	var l = document.createElement('li');
	l.innerHTML = word;

	words.appendChild(l);
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


function checkWord() {
	let guess = document.getElementById("guess").value;
	let score = parseInt(document.getElementById('score').innerHTML);

	let message = "";
	if (game.words.includes(guess)) {
		if (guessed.indexOf(guess) === -1) {
			guessed.push(guess);
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

function update(guessed) {
	message = checkWord(guessed);
	if (message.length > 0) {
		alert(message);
	}
	game_level();
	document.getElementById("guess").value = "";
}
