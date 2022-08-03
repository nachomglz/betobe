import { useState } from "react";
import { IPlayer } from "../utils/types";

const useForm = <T>(): [T, (e: any) => void, (e: any) => void] => {
   const [state, setState] = useState<T>({} as T);

   const handleChange = (e: any) => {
      setState((state: T) => ({ ...state, [e.target.name]: e.target.value }));
   };

   const handleAgencyChange = (agencyInfo: any) => {
      setState((state: T) => ({ ...state, agency: agencyInfo }));
   };

   return [state, handleChange, handleAgencyChange];
};

export default useForm;
