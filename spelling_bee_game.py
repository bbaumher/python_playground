from english_words import get_english_words_set
import time
from trie import Trie
from wordList_parse import load_words
from spellingBee import is_ascii_lower
from spellingBee import SpellingBee

def default_bee():
	return ['a', 'c', 't', 'h', 'i', 'n', 'g']

def update_score(word, pangram, score):
	if len(word) == 4:
		score += 1
	else:
		score += len(word)
	if pangram:
		score += 7
	return score

def contains_correct_letters(guess, chars):
	for char in guess:
		if char not in chars:
			return False
	return True

def contains_special_char(guess, char):
	return char in guess


# driver function
def main():
	use_new = False
	while(True):
		usr_input = input("would you like to enter your own characters? Enter y or n.\n")
		if(usr_input == 'y'):
			use_new = True
			break
		if (usr_input == 'n'):
			break
		else:
			print("please only enter y or n.")

	# default character list:
	#keys, special_char = big_test()
	if (use_new):
		count = 0
		chrs = []
		print("please enter one character at a time.")
		while count < 7:
			chr = input("character " + str(count) + ": ")
			if not is_ascii_lower(chr) or len(chr) > 1:
				print("not a character")
			elif chr in chrs:
				print("already using ", chr)
			else:
				chrs.append(chr)
				count += 1
		searching = True
		main_char = ''
		while(searching):
			special = input("which character is the special character? ")
			if special not in chrs:
				print("please enter a valid character")
			else:
				main_char = special
				searching = False
		keys = chrs
		special_char = main_char
	else:
		keys = default_bee()
		special_char = 't'

	seconds = time.time()

	test_bee = SpellingBee(keys, special_char, use_txt=True)

	# constructing bee time
	after_time = time.time()
	print("construction time: ", after_time - seconds)
	letters = test_bee.print_game()
	print(letters)

	words = test_bee.legal_words()


	words.sort()
	print(len(words))

	pg = test_bee.getPangrams()
	print(len(pg))

	
	total_score = test_bee.getTotalScore()
	print("high score is: " + str(total_score))

	guessed = []
	score = 0
	print("begin!")
	while (True):
		pangram = False
		guess = input("your letters are [" + letters + "]: ")
		if words.__contains__(guess):
			if guessed.__contains__(guess):
				print("You already found this word :(")
			else:
				print("correct!")
				if pg.__contains__(guess):
					pangram = True
					print("you found a pangram!")
				guessed.append(guess)
				score = update_score(guess, pangram, score)
				print("score: " + str(score))
			
		elif len(guess) < 4:
			print("too short")
		elif not contains_correct_letters(guess, keys):
			print("you used a letter not in game")
		elif not contains_special_char(guess, special_char):
			print("missing special letter!")
		else:
			print("not a valid word")









	
if __name__ == '__main__':
	main()

