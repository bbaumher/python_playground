from english_words import get_english_words_set
import time
from trie import Trie
from wordList_parse import load_words
 
DICT_FILE = './engmix.txt'
def getWordTrie(word_list):
	t = Trie()
	# Construct trie
	for word in word_list: 
		if "-" not in word:
			t.insert(word)
			# count += 1
	return t

def getEnglishTrie():
	english = get_english_words_set(['web2'], lower=True)
	return getWordTrie(english)

def getTxtFileTrie():
	english = load_words()
	return getWordTrie(english)



class SpellingBee():
		
	def __init__(self, characters, main_char='', use_txt=True):
		self.main_letter = main_char
		self.characters = characters
		if use_txt:
			self.trie = getTxtFileTrie()
		else:
			self.trie = getEnglishTrie()
		self.words = []
		self.panagrams = []
		self.score = 0
	
	def getCharacters(self):
		return self.characters
	
	def getMainCharacter(self):
		return self.main_letter
	
	def legal_words(self):
		if len(self.words) > 0:
			return self.words
		words = self.trie.wordlist(self.characters)
		good_words = []
		for word in words:
			if self.main_letter not in word:
				continue
			if len(word) > 3:
				good_words.append(word)
		self.words = good_words
		return good_words
	
	def getPanagrams(self):
		#if panagrams computed, return
		if len(self.panagrams) > 0:
			return self.panagrams
		
		# if legal_words not yet computed, compute
		if len(self.words) == 0:
			self.legal_words()

		panagrams = self.words.copy()

		for gw in self.words:
			if len(gw) < len(self.characters):
				panagrams.remove(gw)
				continue
			for char in self.characters:
				if char not in gw:
					panagrams.remove(gw)
					break
		self.panagrams = panagrams
		return panagrams

	def getTotalScore(self):
		score = 0
		if self.score > 0:
			return self.score
		
		if len(self.words) == 0:
			self.legal_words()

		for gw in self.words:
			if len(gw) == 4:
				score += 1
			elif len(gw) > 4:
				score += len(gw)

		if len(self.panagrams) == 0:
			self.getPanagrams()

		score += 7 * len(self.panagrams)
		self.score = score
		return score
	
	def print_game(self):
		alph = sorted(self.characters)
		str = self.getMainCharacter().upper() + "- "
		tot = len(alph) - 1
		cnt = 0
		for char in alph:
			if not char == self.getMainCharacter():
				cnt += 1
				str +=char
				if not cnt == tot:
					str += ", "
		return str

		








def is_ascii_lower(c):
    return 97 <= ord(c) <= 122


def main():
	print("hello")


	
if __name__ == '__main__':
	main()

