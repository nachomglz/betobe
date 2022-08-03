// IMPORT LIBRARIES
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
// IMPORT HOOKS
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// IMPORT CSS MODULES
import styles from "./Login.module.css";
import IndexStyles from "../../index.module.css";
import { api_urls } from "../../utils/config";
import { LoginContext } from "../../components/LoginContext";

interface SignInResponse {
   status: "failed" | "success";
   message: string;
}

interface Auth {
   auth: boolean;
   setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login = () => {
   const navigate = useNavigate();
   const { auth, setAuth } = useContext<Auth>(LoginContext);

   const [username, setUsername] = useState<string>("");
   const [password, setPassword] = useState<string>("");

   const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      try {
         const { data }: AxiosResponse = await axios.post(
            api_urls.signIn,
            { username, password },
            { withCredentials: true }
         );

         const { status }: SignInResponse = data;

         if (status === "success") {
            // save auth in context
            setAuth(true);

            // the user has logged in, redirect to players page
            navigate("/players", { replace: true });
         }
      } catch ({ response }: any) {
         const { request }: any = response;
         if (request.status === 401) {
            Swal.fire("Error", "Los datos introducidos no son correctos", "warning");
         } else {
            Swal.fire("Error", "Ha ocurrido un error inesperado, contacta con el desarrollador", "error");
         }
      }
   };

   return (
      <div className={styles["login-page-container"]}>
         <form className={styles.loginForm}>
            <div className={styles.formFieldset}>
               <label htmlFor="username">Usuario:</label>
               <input type="text" name="username" id="username" onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className={styles.formFieldset}>
               <label htmlFor="password">Contraseña:</label>
               <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className={styles.formFieldset}>
               <button className={`${IndexStyles.btn} ${IndexStyles["btn-orange"]}`} onClick={handleSubmit}>
                  Iniciar sesión
               </button>
            </div>
         </form>
      </div>
   );
};
export default Login;
