// IMPORT REACT LIBRARIES AND MODULES
import { NavLink } from "react-router-dom";
// IMPORT HOOKS
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// IMPORT LOGO
import Logo from "../../assets/logos/orange_white_logo.png";
// IMPORT CSS
import IndexStyles from "../../index.module.css";
import HeaderStyles from "./header.module.css";

import { LoginContext } from "../LoginContext";
import Swal from "sweetalert2";
import { api_urls } from "../../utils/config";
import axios from "axios";

const Header = () => {
   const navigate = useNavigate();

   const { auth, setAuth } = useContext(LoginContext);

   const [isBurgerOpen, setIsBurgerOpen] = useState<boolean>(false);

   const closeSession = async (): Promise<void> => {
      try {
         const { data } = await axios.post(api_urls.signOut, {}, { withCredentials: true });
         if (data.status === "success") {
            // set the context auth to false and redirect to the login page
            setAuth(false);
            navigate("/login", { replace: true });
         }
      } catch (e) {
         Swal.fire("Error", "Ha ocurrido un error cerrando la sesión", "error");
      }
   };

   return (
      <header className={HeaderStyles.header}>
         <div className={`${HeaderStyles.container} ${HeaderStyles["header-container"]}`}>
            <NavLink to={"/"} className={HeaderStyles["header-logo"]}>
               <img src={Logo} alt="Betobe company logo" />
            </NavLink>
            <nav className={HeaderStyles["navigation-container"]}>
               {auth && (
                  <>
                     <NavLink to={"/players"} className={({ isActive }) => (isActive ? HeaderStyles.active : null)}>
                        Jugadores
                     </NavLink>
                     <NavLink
                        to={"players/preseleccionados"}
                        className={({ isActive }) => (isActive ? HeaderStyles.active : null)}
                     >
                        Seleccionados
                     </NavLink>
                     <NavLink
                        to={"players/preeliminados"}
                        className={({ isActive }) => (isActive ? HeaderStyles.active : null)}
                     >
                        Descartado
                     </NavLink>
                  </>
               )}

               <NavLink to={"/register"} className={({ isActive }) => (isActive ? HeaderStyles.active : null)}>
                  Registro
               </NavLink>

               {!auth && (
                  <NavLink to={"/login"} className={({ isActive }) => (isActive ? HeaderStyles.active : null)}>
                     Login
                  </NavLink>
               )}

               {auth && (
                  <button
                     className={`${IndexStyles.btn} ${IndexStyles["btn-orange"]} ${HeaderStyles["btn-close"]}`}
                     onClick={closeSession}
                  >
                     Cerrar sesión
                  </button>
               )}
            </nav>

            <div
               className={`${HeaderStyles["burger-menu-trigger"]} ${isBurgerOpen ? HeaderStyles.open : ""}`}
               onClick={() => setIsBurgerOpen((value) => !value)}
            >
               <span></span>
               <span></span>
            </div>
         </div>
         <div className={`${HeaderStyles["mobile-navigation-container"]} ${isBurgerOpen ? HeaderStyles.open : ""}`}>
            {auth && (
               <>
                  <NavLink to={"/players"} onClick={() => setIsBurgerOpen(false)}>
                     Jugadores
                  </NavLink>
                  <NavLink to={"/players/preseleccionados"} onClick={() => setIsBurgerOpen(false)}>
                     Seleccionados
                  </NavLink>
                  <NavLink to={"/players/preeliminados"} onClick={() => setIsBurgerOpen(false)}>
                     Descartado
                  </NavLink>
               </>
            )}

            <NavLink to={"/register"} onClick={() => setIsBurgerOpen(false)}>
               Registro
            </NavLink>
         </div>
      </header>
   );
};

export default Header;
