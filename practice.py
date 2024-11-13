
from english_words import get_english_words_set
import matplotlib.pyplot as plt
import networkx as nx
from networkx import Graph
from networkx.algorithms import bipartite
from spellingBee import SpellingBee
import pandas as pd
import codecs
from trie import Trie


def english_word_test():
	english = get_english_words_set(['web2'], lower=True)
	print(len(english))

def txt_file_test():
	path = 'engmix.txt'

	#open it with utf-8 encoding 
	f=codecs.open(path,"r",encoding='utf-8')

	#check the encoding type
	print( type(f)) #it's unicode

	#read the file to unicode string
	sfile=f.read()

	#unicode should be encoded to standard string to display it properly
	print (sfile.encode('utf-8'))
	#check the type of encoded string

	print (type(sfile.encode('utf-8')))

def networkx_test():
	BG = nx.Graph()
	users = ['u', 'b', 'x']
	products = ['r', 'c', 'l']
	reviews = ['t', 'a', 'i']
	side4 = ['p', 'e', 'd']

	lb = [users, products, reviews, side4]

	edge_list = []
	for side1 in lb:
		for side2 in lb:
			if side1 == side2:
				continue
			for chr1 in side1:
				for chr2 in side2:     
					edge_list.append((chr1, chr2))

	# add nodes here
	BG.add_nodes_from(users, bipartite=0)
	BG.add_nodes_from(products, bipartite=1)
	BG.add_nodes_from(reviews, bipartite=2)
	BG.add_nodes_from(side4, bipartite=3)


	# add edges here
	BG.add_edges_from(edge_list)


	nodes = BG.nodes()
	# for each of the parts create a set 
	nodes_0  = set([n for n in nodes if  BG.nodes[n]['bipartite']==0])
	nodes_1  = set([n for n in nodes if  BG.nodes[n]['bipartite']==1])
	nodes_2  = set([n for n in nodes if  BG.nodes[n]['bipartite']==2])
	nodes_3  = set([n for n in nodes if  BG.nodes[n]['bipartite']==3])



	# set the location of the nodes for each set
	pos = dict()
	pos.update( (n, (-1, i+1)) for i, n in enumerate(nodes_0) ) # put nodes from X at x=1
	pos.update( (n, (3, i+1)) for i, n in enumerate(nodes_1) ) # put nodes from Y at x=2
	pos.update( (n, (i, 0)) for i, n in enumerate(nodes_2) ) # put nodes from X at x=1
	pos.update( (n, (i, 4)) for i, n in enumerate(nodes_3) ) # put nodes from X at x=1


	nx.draw(BG, pos=pos, with_labels=True)
	plt.show()

# recursion exercises
def fun(n):
	if n > 2:
		fun(n-1)
		fun(n-2)
		fun(n-3)
	print(n)

def func(n, ans,res):
	if n <=1:
		print(ans)
		return ans
	for i in range(2,9):
		if n % i == 0:
			func(n//i,ans+str(i),res)
	return res

def func1(n):
	if n <= 1:
		yield []
		return

	for i in range(2,9):
		if n % i == 0:
			for ans in func1(n // i):
				yield [i, *ans]
	
# testing char <-> int
def practice():
	a = ord('a') - ord('a')
	z = ord('z')- ord('a')
	t = ord('t')- ord('a')

	print (func(98, '',[]))
	print(list(func1(98)))
	print(chr(t + ord('a')))

# testing graph build
def build_lb_graph():
	side1 = ['u', 'b', 'x']
	side2 = ['r', 'c', 'l']
	side3 = ['t', 'a', 'i']
	side4 = ['p', 'e', 'd']
	return [side1, side2, side3, side4]

def list_join_test():
	lb = build_lb_graph()

	all_chars = []
	for l in lb:
		all_chars +=  l

	chr = ''

	print (chr not in "hello")
	print(all_chars)

	word = "hello"
	print(word)
	print(type(word))
	chrs = list(word)
	print(chrs)

def is_ascii_lower(c):
	return 97 <= ord(c) <= 122

def user_input_test():
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
		print("characters: ", chrs)
		print("special char: ", main_char)

def small_dictionary():
	return ["the","a","there","anaswe","any",
			"by","their", "word", "act", "tact", "caca", "tata"]

def charToIndex(ch):
		
		# private helper function
		# Converts key current character into index
		# use only 'a' through 'z' and lower case
		
		return ord(ch)-ord('a')
			
def main():
	T = Trie()
	for word in small_dictionary():
		T.insert(word)
	store = T.dfs_full()
	print(store)

	by_first = [None]*26
	by_last = [None]*26
	for word in store:
		first = word[0]
		last = word[-1]
		print(word, " ", first, " ", last)
		# if current character is not present
		if not by_first[charToIndex(first)]:
			by_first[charToIndex(first)] = []
		by_first[charToIndex(first)].append(word)

		if not by_last[charToIndex(last)]:
			by_last[charToIndex(last)] = []
		by_last[charToIndex(last)].append(word)

	for l in by_first:
		print(len(l))
		print(l)


	





if __name__ == '__main__':
	main()        