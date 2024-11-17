from datetime import datetime
import os

from dateutil import tz
from flask import Flask, abort, redirect, render_template, request, url_for

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

# Parse a puzzle file line and return a parsed 3-tuple or None.
# Format: "<date> <letters> <main-letter>"
# e.g. "2024-11-14 abcdefg a"
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

# Parse the puzzle file and return a dict of datetime.date to SpellingBee objects.
def parse_puzzle_file(puzzle_file, add_default=False):
    puzzles = {}

    if add_default:
        puzzles[parse_date('0001-01-01')] = SpellingBee(['c', 'h', 'a', 'n', 'g', 't', 'i'], 't', True)

    if puzzle_file is None:
        return puzzles

    with open(puzzle_file) as f:
        lines = f.readlines()
        for line in lines:
            if line.startswith('#'):
                continue
            puzzle = parse_puzzle(line)
            if puzzle is not None:
                puzzles[puzzle[0]] = SpellingBee(puzzle[1], puzzle[2], True)

    return puzzles

app = Flask(__name__, static_url_path='/games/static')

puzzle_file = os.environ.get('BEE_PUZZLE_FILE') or 'puzzles.txt'
puzzles = parse_puzzle_file(puzzle_file)

# Mapping of datetime.date objects to games.
# Lazily compute these as requested to avoid doing it all on startup.
rendered_games = {}

# Helper to render the bee HTML page for a given date.
def render_bee(date):
    # If date is None or not a puzzle we know about, return 404.
    if date not in puzzles:
        abort(404)
        return

    # Render game if it hasn't yet been requested.
    if date not in rendered_games:
        rendered_games[date] = create_game(puzzles[date])

    return render_template('bee.html', date=str(date), game=rendered_games[date])

# Return the current date in the US/Eastern timezone.
def date_now():
    return datetime.now(tz=tz.gettz('US/Eastern')).date()

@app.route('/')
def index():
    return redirect(url_for('games'))

@app.route('/games')
def games():
    return render_template('games.html')

@app.route('/games/bee')
def archive():
    now = date_now()
    # Don't display future puzzles.
    dates = [d for d in puzzles.keys() if d <= now]
    return render_template('bee_archive.html', dates=dates)

@app.route('/games/bee/today')
def today():
    return render_bee(date_now())

@app.route('/games/bee/<id>')
def bee(id):
    now = date_now()
    date = parse_date(id)
    # Don't serve future puzzles.
    if date > now:
        abort(404)
        return
    return render_bee(date)
