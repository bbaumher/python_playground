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
}

function game_score() {
	let word = document.getElementById("guess").value;
	let score = parseInt(document.getElementById('score').innerHTML);
	if (game.words.includes(word)) {
		if (word.length == 4) {
			score += 1;
		} else if (word.length > 4) {
			score += word.length;
		}
		if (game.pangrams.includes(word)) {
			score += 7;
		}
	}

	document.getElementById('score').innerHTML = score;
}

function later() {
	if (game.words.includes(word)) {
		if (word.length == 4) {
			score += 1;
		} else if (word.length > 4) {
			score += word.length;
		}
		if (game.pangrams.includes(word)) {
			score += 7;
		}
	}
}