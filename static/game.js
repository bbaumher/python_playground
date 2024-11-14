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

function update() {
	game_score();
	game_level();
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