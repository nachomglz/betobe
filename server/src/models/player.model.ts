import { Schema, model } from "mongoose";

const PlayerSchema = new Schema({
   name: String,
   surname: String,
   description: String,
   email: String,
   phone: String,
   birthdate: Date,
   weight: Number,
   height: Number,
   country: String,
   image: { type: String, default: "profile_placeholder.jpg" },
   agency: {
      agency_name: String,
      agency_phone: String,
      agency_email: String,
      agency_description: String,
   },
   laterality: String,
   position: String,
   passports: [{ country: String }],
   videos: [{ video_name: String, video_url: String }],
   current_team: { type: String, default: null },
   player_status: { type: String, default: null },
   uploaded: { type: Date, default: Date.now },
});

export default model("Player", PlayerSchema);
