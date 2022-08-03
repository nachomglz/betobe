import { useContext, useEffect } from "react";
import { LoginContext } from "./LoginContext";

interface Props {
   path: string;
   element: JSX.Element;
}

const PrivateRoute = ({ path, element }: Props) => {
   // Get the authorization object from the context
   const auth = useContext(LoginContext);
};
export default PrivateRoute;
