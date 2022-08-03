import type { AxiosResponse } from "axios";

export type PlayerStatus = "predeleted" | "preselected" | "all" | "return";
type RequestStatus = "success" | "failed";

export interface IVideo {
   _id?: string;
   video_name: string;
   video_url: string;
}

export interface IPassport {
   _id?: string;
   country: string;
}

export interface IAgency {
   agency_name: string;
   agency_email: string;
   agency_phone: string;
   agency_description: string;
}

export interface IPlayer {
   _id: string;
   __v: number;
   name: string;
   surname: string;
   email: string;
   country: string;
   birthdate: Date;
   age?: number;
   image?: string;
   description: string;
   phone: string;
   position: string;
   laterality: string;
   current_team: string;
   agency?: IAgency;
   height: number;
   weight: number;
   videos: IVideo[];
   passports: IPassport[];
   player_status?: PlayerStatus;
   uploaded: Date;
}

export interface IPlayerResponse extends AxiosResponse {
   data: IApiPlayerResponse;
}

export interface IApiPlayerResponse {
   status: RequestStatus;
   player?: IPlayer;
   errors?: Array<any>;
}

export interface IPlayersResponse extends AxiosResponse {
   data: IApiPlayersResponse;
   auth?: boolean;
}

export interface IApiPlayersResponse {
   status: RequestStatus;
   players: IPlayer[];
}

export interface IPlayerProps {
   player_status: PlayerStatus;
}

export interface IPlayerItemProps {
   player: IPlayer;
   player_status: PlayerStatus;
   showAvailability: boolean;
   onChangeStatus: (player: IPlayer, player_status: PlayerStatus) => void;
   onDelete?: (player: IPlayer) => void;
}
