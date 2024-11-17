import json

class TrieNode:
	
	# Trie node class
	def __init__(self):
		self.children = [None]*26

		# isEndOfWord is True if node represent the end of the word
		self.isEndOfWord = False

class Trie:
	
	# Trie data structure class
	def __init__(self):
		self.root = self.getNode()

	def getNode(self):
	
		# Returns new trie node (initialized to NULLs)
		return TrieNode()

	def _charToIndex(self,ch):
		
		# private helper function
		# Converts key current character into index
		# use only 'a' through 'z' and lower case
		
		return ord(ch)-ord('a')
	
	def _indexToChar(self,ch):
		
		# private helper function
		# Converts key current character into index
		# use only 'a' through 'z' and lower case
		
		return chr(ch + ord('a'))


	def insert(self,key):
		
		# If not present, inserts key into trie
		# If the key is prefix of trie node,
		# just marks leaf node
		pCrawl = self.root
		length = len(key)
		for level in range(length):
			index = self._charToIndex(key[level])

			# if current character is not present
			if not pCrawl.children[index]:
				pCrawl.children[index] = self.getNode()
			pCrawl = pCrawl.children[index]

		# mark last node as leaf
		pCrawl.isEndOfWord = True

	def search(self, key):
		
		# Search key in the trie
		# Returns true if key presents
		# in trie, else false
		pCrawl = self.root
		length = len(key)
		for level in range(length):
			index = self._charToIndex(key[level])
			if not pCrawl.children[index]:
				return False
			pCrawl = pCrawl.children[index]

		return pCrawl.isEndOfWord
	

	
	def dfs(self, node= None, prefix=''):
		""" Depth-first traversal of the trie
		Args:
			- node: the node to start with
			- prefix: the current prefix, for tracing a
				word while traversing the trie
		"""
		if node.isEndOfWord:
			yield ''
		
		for index in range(len(node.children)): 
			if(node.children[index] is not None):
				for ans in self.dfs(node.children[index]):
					yield self._indexToChar(index) + ans
		return
	
	def dfs_full(self):
		return list(self.dfs(self.root, ''))

	def wlr(self, node, indices):
		if node.isEndOfWord:
			yield ''
		
		for index in indices: 
			if(node.children[index]):
				for ans in self.wlr(node.children[index], indices):
					yield self._indexToChar(index) + ans
		return
	
	def wordlist(self, letters):
		indicies = []
		for letter in letters:
			indicies.append(self._charToIndex(letter))

		return list(set(self.wlr(self.root, indicies)))
	
	# for another time
	def to_json(self):
		return json.dumps(self, indent=4)
		