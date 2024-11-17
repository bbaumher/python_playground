FROM --platform=linux/amd64 python:3.12-slim

WORKDIR /app

# Install requirements.
COPY requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt

# Copy relevant app sources.
COPY \
    words.txt \
    puzzles.txt \
    spellingBee.py \
    spelling_bee_server.py \
    wordList_parse.py \
    trie.py \
    /app

# Copying directories is special.
COPY templates /app/templates
COPY static /app/static

EXPOSE 2000

# Set our entrypoint and allow configurable CLI options.
ENTRYPOINT ["flask", "--app", "spelling_bee_server", "run"]
CMD ["--host", "0.0.0.0", "--port", "2000"]
