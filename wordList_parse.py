def load_words(path='./engmix.txt'):
    with open(path, encoding='ISO-8859-1') as f:
        lines = f.readlines()

    dictionary = []
    for word in lines:
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
