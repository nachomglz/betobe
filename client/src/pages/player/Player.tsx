// IMPORT TYPES
import { IPlayerResponse, IPlayer } from "../../utils/types";
// Import hooks
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// IMPORT LIBRARIES
import axios, { AxiosResponse } from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faMale,
   faWeight,
   faShoePrints,
   faCrosshairs,
   faVideoCamera,
   faPassport,
   faEnvelope,
   faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
// IMPORT UTILS
import { api_urls } from "../../utils/config";
// IMPORT STYLESHEETS
import IndexStyles from "../../index.module.css";
import PlayerStyles from "./player.module.css";

import { LoginContext } from "../../components/LoginContext";
import Swal from "sweetalert2";

interface PlayerResponseData {
   status: string;
   player: IPlayer;
}

interface PlayerResponse extends AxiosResponse {
   data: PlayerResponseData;
}

const Player: React.FC = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { auth } = useContext(LoginContext);

   const [player, setPlayer] = useState<IPlayer>();

   useEffect(() => {
      if (!auth) navigate("/", { replace: true });
   });

   useEffect(() => {
      (async () => {
         // Get the player from the API
         try {
            const { data }: PlayerResponse = await axios.get(api_urls.getPlayer + id, { withCredentials: true });
            if (data.status === "success") {
               setPlayer(data.player);
            }
         } catch (e) {
            Swal.fire(
               "Error",
               "Ha ocurrido un error al obtener los datos del jugador, inténtalo de nuevo más tarde",
               "error"
            );
         }
      })();
   }, [id]);

   return (
      <div className={IndexStyles.container}>
         {player === null ? (
            <h2>Ups... Ese jugador no existe!</h2>
         ) : (
            <div className={PlayerStyles["player-container"]}>
               <div className={PlayerStyles["player-container__goback"]} onClick={() => navigate(-1)}>
                  <FontAwesomeIcon icon={faArrowLeft} />
               </div>
               <div className={PlayerStyles["player-container__left"]}>
                  <div className={PlayerStyles["player-container__left-image"]}>
                     <img src={api_urls.getImage + player?.image?.replaceAll("/", "slash")} alt="" />
                  </div>
                  <div className={PlayerStyles["player-container__left-info"]}>
                     <div className={PlayerStyles["player-container__left-info-name"]}>
                        <p>{player?.name}</p>
                        <p>
                           <b>{player?.surname}</b>
                        </p>
                     </div>
                     <div className={PlayerStyles["player-container__left-info-email"]}>
                        <p>
                           <FontAwesomeIcon icon={faEnvelope} />
                           {player?.email}
                        </p>
                     </div>
                     <div className={PlayerStyles["player-container__left-info-extra"]}>
                        <div className={PlayerStyles["player__measures"]}>
                           <p className={PlayerStyles["player__measures-height"]}>
                              <FontAwesomeIcon icon={faMale} />
                              {player?.height}
                           </p>
                           <p className={PlayerStyles["player__measures-weight"]}>
                              <FontAwesomeIcon icon={faWeight} />
                              {player?.weight}
                           </p>
                        </div>
                        <div className={PlayerStyles["player__caracteristics"]}>
                           <p className={PlayerStyles["player__caracteristics-laterality"]}>
                              <FontAwesomeIcon icon={faShoePrints} />
                              {player?.laterality}
                           </p>
                           <p className={PlayerStyles["player__caracteristics-position"]}>
                              <FontAwesomeIcon icon={faCrosshairs} />
                              {player?.position}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className={PlayerStyles["player-container__right"]}>
                  <div className={PlayerStyles["player-container__right-info"]}>
                     <div className={PlayerStyles["player-container__right-description"]}>
                        <h3>Descripción</h3>
                        <p>{player?.description}</p>
                     </div>
                     {player?.videos.length !== undefined && player?.videos.length > 0 && (
                        <div className={PlayerStyles["player-container__right-videos"]}>
                           <h3>Videos del jugador</h3>
                           {player?.videos.map((video, index) => (
                              <div className={PlayerStyles["player-video-item"]} key={index}>
                                 <FontAwesomeIcon icon={faVideoCamera} />
                                 <a
                                    href={
                                       video.video_url.indexOf("https") === -1
                                          ? "https://" + video.video_url
                                          : video.video_url
                                    }
                                    target={"_blank"}
                                    rel={"noreferrer"}
                                 >
                                    {video.video_name}
                                 </a>
                              </div>
                           ))}
                        </div>
                     )}
                     <div className={PlayerStyles["player-container__right-passports"]}>
                        <h3>Pasaportes del jugador</h3>
                        {player?.passports.length === 0 || player?.passports === null ? (
                           <small>Este jugador no ha subido ningún pasaporte...</small>
                        ) : (
                           player?.passports.map((passport, index) => (
                              <div className={PlayerStyles["player-passport-item"]} key={index}>
                                 <FontAwesomeIcon icon={faPassport} />
                                 {passport.country}
                              </div>
                           ))
                        )}
                     </div>
                     {player?.agency !== undefined && (
                        <div className={PlayerStyles["player-container__right-agency"]}>
                           <h3>Agencia del jugador</h3>
                           {player?.agency?.agency_name !== undefined &&
                              player?.agency?.agency_name !== "" &&
                              player?.agency?.agency_name !== null && (
                                 <div>
                                    <h4>Nombre</h4>
                                    {player?.agency?.agency_name}
                                 </div>
                              )}

                           {player?.agency?.agency_email !== undefined &&
                              player?.agency?.agency_email !== "" &&
                              player?.agency?.agency_email !== null && (
                                 <div>
                                    <h4>Email</h4>
                                    {player?.agency?.agency_email}
                                 </div>
                              )}

                           {player?.agency?.agency_phone !== undefined &&
                              player?.agency?.agency_phone !== "" &&
                              player?.agency?.agency_phone !== null && (
                                 <div>
                                    <h4>Teléfono de contacto</h4>
                                    {player?.agency?.agency_phone}
                                 </div>
                              )}

                           {player?.agency?.agency_description !== undefined &&
                              player?.agency?.agency_description !== "" &&
                              player?.agency?.agency_description !== null && (
                                 <div>
                                    <h4>Descripción</h4>
                                    {player?.agency?.agency_description}
                                 </div>
                              )}
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default Player;
