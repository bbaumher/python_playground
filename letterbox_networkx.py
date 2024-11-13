import matplotlib.pyplot as plt
import networkx as nx
from networkx import Graph
from networkx.algorithms import bipartite
from spellingBee import SpellingBee
from trie import Trie

def charToIndex(ch):
		# private helper function
		# Converts key current character into index
		# use only 'a' through 'z' and lower case
		
		return ord(ch)-ord('a')

def build_lb_graph():
	side1 = ['u', 'b', 'x']
	side2 = ['r', 'c', 'l']
	side3 = ['t', 'a', 'i']
	side4 = ['p', 'e', 'd']
	return [side1, side2, side3, side4]
# blue etcetera axle ubx rcl ta e   dpi
def positionNodes(graph, pos):
	nodes = graph.nodes()
	# for each of the parts create a set 
	nodes_0  = set([n for n in nodes if  graph.nodes[n]['bipartite']==0])
	nodes_1  = set([n for n in nodes if  graph.nodes[n]['bipartite']==1])
	nodes_2  = set([n for n in nodes if  graph.nodes[n]['bipartite']==2])
	nodes_3  = set([n for n in nodes if  graph.nodes[n]['bipartite']==3])

	# set the location of the nodes for each set
  
	pos.update( (n, (-1, i+1)) for i, n in enumerate(nodes_0) ) # put nodes from X at x=1
	pos.update( (n, (3, i+1)) for i, n in enumerate(nodes_1) ) # put nodes from Y at x=2
	pos.update( (n, (i, 0)) for i, n in enumerate(nodes_2) ) # put nodes from X at x=1
	pos.update( (n, (i, 4)) for i, n in enumerate(nodes_3) ) # put nodes from X at x=1

def accepts(g, path):
	return all([(path[i],path[i+1]) in g.edges() for i in range(len(path)-1)])

def order_words(words):
	return Trie(words)

def main():
	T = nx.Graph()

	# add nodes
	lb = build_lb_graph()
	count = 0
	for side in lb:
		T.add_nodes_from(side, bipartite=count)
		count +=1

	# add edges
	edge_list = []
	for side1 in lb:
		for side2 in lb:
			if side1 == side2:
				continue
			for chr1 in side1:
				for chr2 in side2:     
					edge_list.append((chr1, chr2))
					
	T.add_edges_from(edge_list)

	pos = dict()
	positionNodes(T, pos)

	# characters into one list for spelling bee
	all_chars = list()
	for chrs in lb:
		all_chars += chrs 

	print(all_chars)

	#spelling bee now
	words = SpellingBee(all_chars, '')
	legal = words.legal_words()
	print(words.getPanagrams())

	#print(legal)  
	print("all words ", len(legal))

	by_first = [None]*26
	by_last = [None]*26
	count = 0
	for w in legal:
		if (accepts(T, list(w))):
			count +=1
			first = w[0]
			last = w[-1]
			if not by_first[charToIndex(first)]:
				by_first[charToIndex(first)] = []
			by_first[charToIndex(first)].append(w)

			if not by_last[charToIndex(last)]:
				by_last[charToIndex(last)] = []
			by_last[charToIndex(last)].append(w)
	
	print("paths: ", count)
	print("first letters: ")
	for l in by_first:
		if l is not None:
			print(l[0][0], " ", len(l))
			#if l[0][0] is 'd':
			#	print(l)
		
	print("last chars: ")
	for l in by_last:
		if l is not None:
			print(l[0][-1], " ", len(l))

	for words in by_first:
		for w in words:
			chars = all_chars
			for ch in list(w):
				chars.remove(ch)
			for r in by_first[charToIndex(w[-1])]:
				if any(list(r) in chars):
					print(r)





	""""
	path_words = Trie()
	count = 0
	for w in legal:
		if (accepts(T, list(w))):
			path_words.insert(w)
			count += 1


	#print(path_words)
	print("vaid walks", count)
	ordered = path_words.dfs_full()
	count = 0
	ord_char = ord('a')
	by_first = []*26
	by_last = []*26
	by_first = [None]*26
	by_last = [None]*26
	for word in ordered:
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
	"""
		

		


	# now we need to link words
	""""
	links = []
	ord_char = ord('a')
	word_list = []
	dict_new = path_words.sort()
	for word in dict_new:
		if (word[0] == chr(ord_char)):
			word_list.append(word)
		else:
			print(word_list)
			print(len(word_list))
			word_list = []
	"""

	nx.draw(T, pos=pos, with_labels=True)
	plt.show()



if __name__ == '__main__':
	main()




		
	
