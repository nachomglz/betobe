import requests
import random
import datetime
import names
import json
from faker import Faker

# register api endpoint
URL = "http://localhost:8080/api/player/save"

def send_request():
   fake = Faker()
   birthdate = fake.date_between_dates(datetime.datetime(1990, 1, 1), datetime.datetime(2004, 1, 1))
   birthdate = birthdate.strftime('%Y-%m-%d')
   positions = ["centrocampista", "portero", "defensa", "delantero", "medio"]
   lateralities = ["zurdo", "diestro", "ambidiestro"]
   # create request body
   body = {
      "name": names.get_first_name(),
      "surname": names.get_last_name() + " " + names.get_last_name(),
      "email": fake.email(),
      "country": fake.country(),
      "birthdate": birthdate,
      "image": "",
      "description": fake.text(max_nb_chars = 40),
      "position": random.choice(positions),
      "laterality": random.choice(lateralities),
      "height": random.uniform(1.40, 2.20),
      "weight":random.uniform(70, 120)
   } 
   videos = [
      { "video_name": fake.word(), "video_url": "youtu.be/watch?asd1"},
      { "video_name": fake.word(), "video_url": "youtu.be/watch?asd2"},
      { "video_name": fake.word(), "video_url": "youtu.be/watch?asd3"}
   ]
   body["videos"] = videos   

   passports = [
      { "country": fake.country() },
      { "country": fake.country() },
      { "country": fake.country() }
   ]
   body["passports"] = passports
   # make request and send body
   res = requests.post(URL, json=body).json()
   print()

   if res["status"] == "success":
     print("jugador registrado correctamente, id = {}".format(res["player"]["_id"])) 
   
def create_players():
   times = int(input("how many players?: "))
   for i in range(times):
      send_request()
def delete_players():
   print("not yet")



create_players();
