from flask import Flask, render_template

from spellingBee import SpellingBee

bee = SpellingBee(['c', 'h', 'a', 'n', 'g', 't', 'i'], 't', False)
game = dict(
	letters=bee.characters,
    main_letter=bee.main_letter,
    words=bee.legal_words(),
    pangrams=bee.getPanagrams(),
    total_score=bee.getTotalScore(),
)

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html', game=game)
