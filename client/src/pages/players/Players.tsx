// IMPORT TYPES
import { IPlayerResponse, IPlayer, IPlayerProps, IPlayersResponse, PlayerStatus } from "../../utils/types";
// IMPORT REACT HOOKS
import { MutableRefObject, useEffect, useRef, useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
// IMPORT LIBRARIES
import axios from "axios";
import Swal from "sweetalert2";
// IMPORT UTILS
import { api_urls } from "../../utils/config";
// IMPORT CSS
import IndexStyles from "../../index.module.css";
import PlayersStyles from "./players.module.css";
//IMPORT COMPONENTS
import PlayerItem from "../../components/PlayerItem/PlayerItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import FiltersMenu, { Filters } from "../../components/player_filters/FiltersMenu";
import { LoginContext } from "../../components/LoginContext";

const Players: React.FC<IPlayerProps> = ({ player_status }) => {
   const navigate = useNavigate();
   const { auth } = useContext(LoginContext);

   // States
   const [loading, setLoading] = useState<boolean>(false);
   const [players, setPlayers] = useState<IPlayer[]>();
   const [showAvailability, setShowAvailability] = useState<boolean>(false);
   const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);

   const openFiltersButtonRef = useRef() as MutableRefObject<HTMLButtonElement>;

   // Gets all the players from the database
   const getPlayersList = async (): Promise<IPlayer[]> => {
      // Query api and get all the players
      setLoading(true);
      let url: string = "";
      if (player_status === "preselected") url = api_urls.getPreselectedPlayers;
      else if (player_status === "predeleted") url = api_urls.getPredeletedPlayers;
      else url = api_urls.getPlayers;

      try {
         setLoading(true);
         const { data }: IPlayersResponse = await axios.get(url, { withCredentials: true });

         let players: IPlayer[] = data.players;

         // Add age to the players // THERE'S AN ERROR HERE
         players.forEach((player) => {
            const now = new Date();
            const playerBirthdate = new Date(player.birthdate);
            const yearDifference = now.getFullYear() - playerBirthdate.getFullYear();
            const monthDifference = now.getMonth() - playerBirthdate.getFullYear();
            player.age = monthDifference < 0 ? yearDifference - 1 : yearDifference;
         });

         setLoading(false);
         return players;
      } catch (e: any) {
         setLoading(false);
         Swal.fire("Ops...", "Ha ocurrido un error inesperado!", "error");
         return [];
      }
   };

   const getPlayersCallback: () => Promise<IPlayer[]> = useCallback(getPlayersList, [player_status]);

   useEffect(() => {
      getPlayersCallback().then((res: IPlayer[]) => {
         setPlayers(res);
      });
   }, [player_status, getPlayersCallback, auth]);

   const changeStatus = async (player: IPlayer, player_status: PlayerStatus) => {
      // Set the status of the player to predeleted in the DB
      try {
         const { data, status }: IPlayerResponse = await axios.put(
            api_urls.changeStatus + player._id + "/" + player_status,
            {},
            { withCredentials: true }
         );
         if (status === 200 && data.status === "success") {
            setPlayers((players) => players?.filter((player: IPlayer) => player._id !== data.player?._id));
            Swal.fire("Hecho!", "Se ha cambiado el jugador!", "success");
         }
      } catch (e: unknown) {
         Swal.fire("Oops...", "Ha ocurrido un error inesperado!", "error");
      }
   };

   const deletePlayer = async (player: IPlayer) => {
      // Remove player from DB
      try {
         const { data, status }: IPlayerResponse = await axios.delete(api_urls.deletePlayer + player._id, {
            withCredentials: true,
         });

         if (status === 200 && data.status === "success") {
            setPlayers((players) => players?.filter((player: IPlayer) => player._id !== data.player?._id));
            Swal.fire("Hecho!", "Se ha eliminado el jugador!", "success");
         }
      } catch (e: unknown) {
         Swal.fire("Oops...", "Ha ocurrido un error inesperado!", "error");
      }
   };

   const filterPlayers = async (filters: Filters): Promise<void> => {
      // we get the filters from the child component everytime the client presses the apply filters button
      // 1. Get the list of players from db, to filter from all the players and not the previous filter
      let playersList: IPlayer[] = await getPlayersCallback();

      // filter age
      if (filters.age > 0) {
         playersList = playersList.filter((player) => player.age == filters.age);
      }

      // fiter height
      if (filters.maxHeight > 0) {
         playersList = playersList.filter((player) => player.height <= filters.maxHeight);
      }
      if (filters.minHeight > 0) {
         playersList = playersList.filter((player) => player.height >= filters.minHeight);
      }

      // filter weight
      if (filters.minWeight > 0) {
         playersList = playersList.filter((player) => player.weight >= filters.minWeight);
      }
      if (filters.maxWeight > 0) {
         playersList = playersList.filter((player) => player.weight >= filters.maxWeight);
      }

      // filter position
      if (filters.position !== null) {
         playersList = playersList.filter(
            (player) => player.position.toLowerCase() === filters.position?.toLowerCase()
         );
      }

      // filter laterality
      if (filters.laterality !== null) {
         playersList = playersList.filter(
            (player) => player.laterality.toLowerCase() === filters.laterality?.toLowerCase()
         );
      }

      // filtera availability
      if (filters.available) {
         playersList = playersList.filter(
            (player) => player.current_team === "" || player.current_team === null || player.current_team === undefined
         );
      }
      setPlayers(playersList);
   };

   return (
      <div className={IndexStyles.container}>
         <FiltersMenu
            filtersButtonRef={openFiltersButtonRef}
            isMenuOpened={isFilterMenuOpen}
            onApplyFilters={filterPlayers}
            closeMenu={() => setIsFilterMenuOpen(false)}
         />
         <div className={PlayersStyles["players-top-section"]}>
            <div className={PlayersStyles["filter-availability-container"]}>
               <div className={PlayersStyles["custom-checkbox"]}>
                  <input
                     type="checkbox"
                     id="show-availability-trigger"
                     onChange={({ target }) => setShowAvailability(target.checked)}
                  />
                  <label htmlFor="show-availability-trigger">
                     <div>
                        <div></div>
                     </div>
                  </label>
               </div>
               Mostrar disponibilidad
            </div>
            <div className={PlayersStyles["filter-trigger-container"]}>
               <button
                  className={PlayersStyles["filter-trigger-button"]}
                  onClick={() => setIsFilterMenuOpen((isOpen) => !isOpen)}
                  ref={openFiltersButtonRef}
               >
                  <FontAwesomeIcon icon={faFilter} />
               </button>
            </div>
         </div>

         {loading ? (
            <h1>Cargando jugadores...</h1>
         ) : (
            <div className={PlayersStyles["players-container"]}>
               {players?.length === 0 || players == null ? (
                  <div className={PlayersStyles["no-players-found-container"]}>
                     <h2>No hay jugadores</h2>
                  </div>
               ) : (
                  players.map((player: IPlayer, index: number) => (
                     <PlayerItem
                        key={index}
                        player={player}
                        player_status={player_status}
                        onChangeStatus={changeStatus}
                        onDelete={deletePlayer}
                        showAvailability={showAvailability}
                     />
                  ))
               )}
            </div>
         )}
      </div>
   );
};

export default Players;
