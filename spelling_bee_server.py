from flask import Flask, render_template

from spellingBee import SpellingBee

bee = SpellingBee(['c', 'h', 'a', 'n', 'g', 't', 'i'], 't', True)
game = dict(
	letters=bee.characters,
    main_letter=bee.main_letter,
    words=bee.legal_words(),
    pangrams=bee.getPangrams(),
    total_score=bee.getTotalScore(),
)

app = Flask(__name__, static_url_path='/games/static')

@app.route('/games/bee')
def index():
	return render_template('bee.html', game=game)
