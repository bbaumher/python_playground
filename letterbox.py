class Side:
	def __init__(self, chr1, chr2, chr3):
		self.chr1 = chr1
		self.chr2 = chr2
		self.chr3 = chr3		


class Box:
	
	# Box node class
    # we want 4 sets of 3 characters
    # all characters must be unique
    # some way to check these conditions.
	def __init__(self):
		self.children = [Side()]*4


print(C.number_of_edges())
print(C.number_of_nodes())
print(C)
plt.show()



g = nx.Graph()

for layer in range(N_LAYERS - 1):
    for u in range(N_NODES):
        for v in range(N_NODES):
            g.add_edge((u,layer),(v,layer+1))

  
 
B = nx.Graph()
B.add_nodes_from([1,2,3], bipartite=0) # Add the node attribute "bipartite"
B.add_nodes_from(['a','b','c'], bipartite=1)
B.add_edges_from([(1,'a'), (1,'b'), (2,'b'), (2,'c'), (3,'c'), (3,'a')])

# Separate by group
l, r = nx.bipartite.sets(B)
pos = {}

# Update position for node from each group
pos.update((node, (1, index)) for index, node in enumerate(l))
pos.update((node, (2, index)) for index, node in enumerate(r))
labels = nx.get_node_attributes(B, 'size') 
nx.draw(B, with_labels=True, pos=pos)
  
C = nx.complete_bipartite_graph(3,3)
# nx.draw(C, with_labels=True)
#plt.
		
    

		
    
