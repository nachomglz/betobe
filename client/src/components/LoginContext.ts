import React, { createContext } from "react";
interface Auth {
   auth: boolean;
   setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}
export const LoginContext: React.Context<Auth> = createContext<Auth>({ auth: false, setAuth: () => {} });
