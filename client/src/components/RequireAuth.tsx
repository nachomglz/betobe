import { useNavigate } from "react-router-dom";
import RedirectToHome from "./RedirectToHome";

interface Props {
   auth: boolean;
   checking: boolean;
   children: JSX.Element;
}

const RequireAuth = ({ children, auth, checking }: Props): JSX.Element => {
   const navigate = useNavigate();
   return !checking ? auth ? children : <RedirectToHome /> : <></>;
};

export default RequireAuth;
