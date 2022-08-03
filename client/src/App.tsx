import { useState, useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
// IMPORT COMPONENTS
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginContext } from "./components/LoginContext";
import Header from "./components/header/Header";
// IMPORT PAGES
import Register from "./pages/register/Register";
import Players from "./pages/players/Players";
import Player from "./pages/player/Player";
import Home from "./pages/home/Home";
import NotFound from "./pages/not_found/NotFound";
import Login from "./pages/login/Login";
import RequireAuth from "./components/RequireAuth";
import { api_urls } from "./utils/config";

interface DecodedJWT {
   exp: number;
   iat: number;
   id: string;
}
interface ValidateTokenData {
   auth: boolean;
   decoded: DecodedJWT;
}
interface ValidateTokenResponse extends AxiosResponse {
   data: ValidateTokenData;
}

const App = () => {
   const [auth, setAuth] = useState<boolean>(false);
   const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

   useEffect(() => {
      (async () => {
         try {
            setCheckingAuth(true);
            const { data }: ValidateTokenResponse = await axios.get(api_urls.validateToken, { withCredentials: true });
            setAuth(data.auth);
            setCheckingAuth(false);
         } catch ({ response }: any) {
            const { data }: any = response;
            setAuth(data.auth);
            setCheckingAuth(false);
         }
      })();
   }, [auth]);

   return (
      <BrowserRouter>
         <LoginContext.Provider value={{ auth, setAuth }}>
            <Header />
            <Routes>
               <Route path="*" element={<NotFound />} />
               <Route path="/" element={<Home />} />
               <Route path="login" element={<Login />} />
               <Route path="register" element={<Register />} />
               <Route
                  path="players"
                  element={
                     <RequireAuth auth={auth} checking={checkingAuth}>
                        <Players player_status="all" />
                     </RequireAuth>
                  }
               />
               <Route
                  path="players/preseleccionados"
                  element={
                     <RequireAuth auth={auth} checking={checkingAuth}>
                        <Players player_status="preselected" />
                     </RequireAuth>
                  }
               />
               <Route
                  path="players/preeliminados"
                  element={
                     <RequireAuth auth={auth} checking={checkingAuth}>
                        <Players player_status="predeleted" />
                     </RequireAuth>
                  }
               />
               <Route
                  path="player/:id"
                  element={
                     <RequireAuth auth={auth} checking={checkingAuth}>
                        <Player />
                     </RequireAuth>
                  }
               />
            </Routes>
         </LoginContext.Provider>
      </BrowserRouter>
   );
};
export default App;
