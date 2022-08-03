import json
import requests

json_countries = requests.get("https://restcountries.com/v3.1/all").text
print(json_countries)

