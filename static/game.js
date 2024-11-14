function init() {
	var letters = document.getElementById('letters');
	game.letters.forEach(letter => {
		var l = document.createElement('li');
		l.innerHTML = letter;
		if (letter == game.main_letter) {
			l.style.color = 'gold';
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