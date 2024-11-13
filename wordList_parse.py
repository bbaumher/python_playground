import pandas as pd

#read_file = pd.read_csv ('./engmix.txt', encoding = 'utf8')
#read_file.to_csv 
def load_words(path='./engmix.txt'):

    df = pd.read_csv(path, encoding='ISO-8859-1', sep=' ', header=None, names=['word'])
   # df.str.encode('ascii', 'ignore').str.decode('ascii')

    dictionary = []
    for index, row in df.iterrows():
        word = row['word']
        if(type(word) is not str):
            #print("non string? ", word)
            continue
        badchar = False
        for c in list(word):
            if ord(c) < 97 or ord(c) > 122:
                #print(word)
                badchar = True
                break
        if(len(word) > 2 and not badchar):
            dictionary.append(word)
    print("dict length ", len(dictionary))
    return dictionary
