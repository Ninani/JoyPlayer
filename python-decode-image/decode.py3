import json
import urllib.request

# need python >=3.4

with open('img.json') as data_file:    
    data = json.load(data_file)
    image = data['image']

    sth = urllib.request.urlopen(image)
    with open('img.jpg', 'wb') as f:
        f.write(sth.fp.read())