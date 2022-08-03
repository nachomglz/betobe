import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
// Import player model
import Player from "../models/player.model";
// IMPORT TYPES

interface CustomFilters {
   height?: number;
   weight?: number;
   birthdate?:
      | string
      | {
           $gte: string;
        };
   country?: string;
   position?: string;
   laterality?: string;
   player_status?: string | null;
}

const controller = {
   savePlayer: (req: Request, res: Response) => {
      // Create player object from model and save the player
      const player = new Player(req.body);
      player.save((err: any, player: any) => {
         if (err || !player) {
            res.status(500).send({
               status: "failed",
               message: "Ha ocurrido un error en el registro, por favor, inténtelo más tarde.",
            });
         } else {
            res.status(200).send({
               status: "success",
               message: "Jugador guardado correctamente",
               player,
            });
         }
      });
   },

   getPlayers: async (req: Request, res: Response) => {
      let filters: any = {};
      // Do Find in mongoDB
      if (req.query.filters) {
         filters = JSON.parse(<any>req.query.filters);
         if (filters.birthdate) {
            filters.birthdate = {
               $gte: new Date(filters.birthdate as string).toISOString(),
            };
         }

         for (let i in filters) {
            if (!isNaN(filters[i])) {
               filters[i] = { $gte: parseFloat(filters[i]) };
            }
         }
         filters.player_status = null;
      }

      try {
         const players = await Player.find({
            $or: [{ player_status: "" }, { player_status: null }],
            ...filters,
         }).sort("-updated");
         return res.send({
            status: "success",
            players,
         });
      } catch (e) {
         console.log(e);
         return res.status(500).send({
            status: "failed",
            message: "Error al obtener los jugadores",
         });
      }
   },

   getPlayer: async (req: Request, res: Response) => {
      const { id } = req.params;
      try {
         const player = await Player.findById(id);
         return res.send({
            status: "success",
            player,
         });
      } catch (e) {
         console.log(e);
         return res.status(500).send({
            status: "failed",
            message: "Error al obtener el jugador",
         });
      }
   },

   getPredeleted: async (req: Request, res: Response) => {
      // Do Find in mongoDB
      try {
         const players = await Player.find({
            player_status: "predeleted",
         }).sort("-updated");
         return res.status(200).send({
            status: "success",
            players,
         });
      } catch (e) {
         console.log(e);
         return res.status(500).send({
            status: "failed",
            message: "Error al obtener los jugadores",
         });
      }
   },

   getPreselected: async (req: Request, res: Response) => {
      try {
         const players: Array<unknown> = await Player.find({
            player_status: "preselected",
         }).sort("-updated");

         return res.status(200).send({
            status: "success",
            players,
         });
      } catch (e) {
         console.log(e);
         return res.status(500).send({
            status: "failed",
            message: "Error al obtener los jugadores",
         });
      }
   },

   getImage: async (req: Request, res: Response) => {
      const { image_name } = req.params;
      try {
         const image_path = "./uploads/players/" + image_name;
         const default_image = "./img/profile_placeholder.jpg";

         if (
            image_name === undefined ||
            image_name === "profile_placeholder.jpg" ||
            image_name === null ||
            image_name === "" ||
            !fs.existsSync(image_path)
         ) {
            return res.sendFile(path.resolve(default_image));
         } else {
            return res.sendFile(path.resolve(image_path));
         }
      } catch (e) {
         console.log(e);
         res.status(500).send({
            status: "failed",
            message: "Error al obtener la imagen",
         });
      }
   },

   changeStatus: async (req: Request, res: Response) => {
      const { id, status } = req.params;

      // If the status is not valid, return error
      if (!["predeleted", "preselected", "return"].includes(status)) {
         return res.status(422).send({
            status: "failed",
            message: "El estado no es válido",
         });
      }

      try {
         // Find the player and update it, the "new" parameter is used to return the updated version of the player, and the player status depends, if the status requested is "return" it means that the status has to go null
         const result = await Player.findByIdAndUpdate(
            id,
            {
               player_status: status === "return" ? null : status,
            },
            { new: true }
         );

         if (result === null) {
            return res.status(404).send({
               status: "failed",
               message: "El jugador no existe",
            });
         }

         return res.status(200).send({
            status: "success",
            message: "Se ha cambiado el estado del jugador",
            player: result,
         });
      } catch (err: unknown) {
         return res.status(500).send({
            status: "failed",
            message: "Error al cambiar el estado del jugador",
         });
      }
   },

   deletePlayer: async (req: Request, res: Response) => {
      const { id } = req.params;

      Player.findByIdAndDelete(id, {}, (err, player) => {
         if(err)  {
            return res.status(500).send({
               status: "failed",
               message: "Error al eliminar el jugador",
            });
         }

         if (!player) { 
            return res.status(404).send({ 
               status: "failed",
               message: "El jugador no existe",
            });
         }

         // remove player's image
         const imagePath: string = path.join("uploads", "players", player.image)
         if(fs.existsSync(imagePath)){
            fs.unlinkSync(imagePath)
         }

         return res.status(200).send({
            status: "success",
            message: "Se ha eliminado el jugador",
            player
         });

      })

   },

   // POST IMAGE
   postImage: async (req: Request, res: Response) => {
      try {
         const { id } = req.params;

         if (!req.file) {
            return res.status(400).send({
               status: "failed",
               message: "No se ha subido ninguna imagen",
            });
         }
         
         // The name of the input field (i.e. "image") is used to retrieve the uploaded file
         const { filename, mimetype, path }: any = req.file;
         // const imagen: any = req.file;

         // If the player already has an image, we have to delete the old one and then update to the new one
         const player = await Player.findById(id);

         if (!player) {
            // Delete the uploaded image
            if(fs.existsSync(path)) {
               fs.unlinkSync(path)
            }
            return res.status(404).send({
               status: "failed",
               message: "Invalid ID, the user doesn't exist",
            });
         }

         // If the user has an image already, we have to delete the old one
         if (player.image && player.image !== "") {
            const oldImage = "./uploads/players/" + player.image;
            if (fs.existsSync(oldImage)) {
               fs.unlinkSync(oldImage);
            }
         }

         // Once deleted, update the player with the new image
         Player.updateOne({ _id: id}, { image: filename }, {}, (err, res)=> {
            console.error(err)
            console.log(player)
         })

         return res.status(200).send({
            status: "success",
            message: "Se ha subido la imagen correctamente",
            data: {
               name: filename,
               mimetype
            },
         });
      } catch (e: any) {
         console.error(e)
         return res.status(500).send({
            status: "failed",
            message: "Error al subir la imagen",
         });
      }
   },
};

export default controller;
