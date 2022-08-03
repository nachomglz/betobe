// Import types
import type { IPlayerItemProps } from "../../utils/types";
// Import libraries and functions
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Import urls
import { api_urls } from "../../utils/config";
import { faCrosshairs, faInfoCircle, faMale, faShoePrints, faWeight } from "@fortawesome/free-solid-svg-icons";
// import css modules
import IndexStyles from "../../index.module.css";
import PlayerItemStyles from "./playerItem.module.css";

const PlayerItem = ({ player, player_status, showAvailability, onChangeStatus, onDelete }: IPlayerItemProps) => {
   return (
      <div
         className={`${PlayerItemStyles.player} ${showAvailability ? PlayerItemStyles.showAvailability : ""} ${
            player.current_team === "" || !player.current_team
               ? PlayerItemStyles.available
               : PlayerItemStyles["not-available"]
         }`}
      >
         <img src={api_urls.getImage + player.image?.replaceAll("/", "slash")} alt="player" />
         <Link to={`/player/${player._id}`} className={PlayerItemStyles["player__info-btn"]}>
            <FontAwesomeIcon icon={faInfoCircle} />
         </Link>
         <p className={PlayerItemStyles["player__name"]}>{player.name}</p>
         <p className={PlayerItemStyles["player__surname"]}>
            {player.surname}, {player.age}
         </p>
         <div className={PlayerItemStyles["player__measures__caracteristics"]}>
            <div className={PlayerItemStyles["player__measures"]}>
               <p className={PlayerItemStyles["player__measures-height"]}>
                  <FontAwesomeIcon icon={faMale} />
                  {player.height.toFixed(2)}
               </p>
               <p className={PlayerItemStyles["player__measures-weight"]}>
                  <FontAwesomeIcon icon={faWeight} />
                  {player.weight.toFixed(2)}
               </p>
            </div>
            <div className={PlayerItemStyles["player__caracteristics"]}>
               <p className={PlayerItemStyles["player__caracteristics-laterality"]}>
                  <FontAwesomeIcon icon={faShoePrints} />
                  {player.laterality}
               </p>
               <p className={PlayerItemStyles["player__caracteristics-position"]}>
                  <FontAwesomeIcon icon={faCrosshairs} />
                  {player.position}
               </p>
            </div>
         </div>

         <div className={PlayerItemStyles["player__options"]}>
            {player_status === "preselected" ? (
               <button
                  className={`${IndexStyles.btn} ${IndexStyles["btn-transparent"]}`}
                  onClick={() => onChangeStatus(player, "return")}
               >
                  Devolver
               </button>
            ) : player_status === "predeleted" ? (
               <>
                  <button
                     className={`${IndexStyles.btn} ${IndexStyles["btn-transparent"]}`}
                     onClick={() => onChangeStatus(player, "return")}
                  >
                     Devolver
                  </button>
                  <button
                     className={`${IndexStyles.btn} ${IndexStyles["btn-orange"]}`}
                     onClick={() => (onDelete ? onDelete(player) : null)}
                  >
                     Eliminar
                  </button>
               </>
            ) : (
               <>
                  <button
                     className={`${IndexStyles.btn} ${IndexStyles["btn-transparent"]}`}
                     onClick={() => onChangeStatus(player, "predeleted")}
                  >
                     Eliminar
                  </button>
                  <button
                     className={`${IndexStyles.btn} ${IndexStyles["btn-orange"]}`}
                     onClick={() => onChangeStatus(player, "preselected")}
                  >
                     Seleccionar
                  </button>
               </>
            )}
         </div>
      </div>
   );
};

export default PlayerItem;
