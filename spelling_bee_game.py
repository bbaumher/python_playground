from english_words import get_english_words_set
import time
from trie import Trie
from wordList_parse import load_words
from spellingBee import big_test
from spellingBee import is_ascii_lower
from spellingBee import SpellingBee


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
	keys, special_char = big_test()
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

	seconds = time.time()

	test_bee = SpellingBee(keys, special_char, use_txt=False)

	# constructing bee time
	after_time = time.time()
	print("construction time: ", after_time - seconds)

	words = test_bee.legal_words()

	words.sort()
	print(len(words))
	print(words)

	pg = test_bee.getPanagrams()
	print(len(pg))
	print(pg)

	guessed = []
	score = 0
	print("you may begin guessing")
	while (True):
		guess = input(": ")
		if words.__contains__(guess):
			print("correct!")
			score += 1
			guessed.append(guess)
		else:
			print("this is not a word")









	
if __name__ == '__main__':
	main()

