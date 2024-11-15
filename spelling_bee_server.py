from datetime import datetime
import os
from flask import Flask, render_template, abort

from spellingBee import SpellingBee

# Render a game from an instance of a SpellingBee.
def create_game(bee):
    return dict(
        letters=bee.characters,
        main_letter=bee.main_letter,
        words=bee.legal_words(),
        pangrams=bee.getPangrams(),
        total_score=bee.getTotalScore(),
    )

# Parse a date formatted as YYYY-MM-DD or return None.
def parse_date(s):
    try:
        return datetime.strptime(s, '%Y-%m-%d').date()
    except ValueError:
        return None

def parse_puzzle(line):
    def warn(msg):
        print('warning: ignoring puzzle: {0}: {1}'.format(msg, line.strip()))

    parts = line.strip().split()
    if len(parts) < 3:
        warn('not enough fields')
        return None

    date = parse_date(parts[0])
    if date is None:
        warn('date is invalid')
        return None

    letters = list(parts[1])
    if len(letters) != 7:
        warn('invalid number of letters')
        return None

    main_letter = parts[2]
    if len(main_letter) != 1:
        warn('main letter should be a single character')
        return None

    if main_letter not in letters:
        warn('main letter is not in letters')
        return None

    return (date, letters, main_letter)



app = Flask(__name__, static_url_path='/games/static')

puzzle_file = os.environ.get('BEE_PUZZLE_FILE') or 'puzzles.txt'
default_date = parse_date('0001-01-01')

# Mapping of datetime.date objects to SpellingBee objects.
puzzles = {
    default_date: SpellingBee(['c', 'h', 'a', 'n', 'g', 't', 'i'], 't', True)
}

if puzzle_file is not None:
    with open(puzzle_file) as f:
        lines = f.readlines()
    for line in lines:
        if line.startswith('#'):
            continue
        puzzle = parse_puzzle(line)
        if puzzle is not None:
            puzzles[puzzle[0]] = SpellingBee(puzzle[1], puzzle[2], True)

# Mapping of datetime.date objects to games.
# Lazily compute these as requested to avoid doing it all on startup.
games = {}

@app.route('/games/bee')
def index():
    return render_template('index.html', dates=puzzles.keys())

@app.route('/games/bee/<id>')
def bee(id):
    # Formatted as YYYY-MM-DD
    date = parse_date(id)

    # If date is None or not a puzzle we know about, return 404.
    if date not in puzzles:
        abort(404)

    # Render game if it hasn't yet been requested.
    if date not in games:
        games[date] = create_game(puzzles[date])

    return render_template('bee.html', date=str(date), game=games[date])
