export interface IApiUrls {
   getPlayers: string;
   getPlayer: string;
   getPredeletedPlayers: string;
   getPreselectedPlayers: string;
   getImage: string;
   changeStatus: string;
   deletePlayer: string;
   registerPlayer: string;
   uploadImage: string;
   validateToken: string;
   signIn: string;
   signOut: string;
}
const api_urls: IApiUrls = {
   getPlayers: "http://localhost:8080/api/players/get",
   getPlayer: "http://localhost:8080/api/players/get/",
   getPredeletedPlayers: "http://localhost:8080/api/players/predeleted",
   getPreselectedPlayers: "http://localhost:8080/api/players/preselected",
   getImage: "http://localhost:8080/api/players/image/",
   changeStatus: "http://localhost:8080/api/player/set/",
   deletePlayer: "http://localhost:8080/api/player/delete/",
   registerPlayer: "http://localhost:8080/api/player/save/",
   uploadImage: "http://localhost:8080/api/player/postImage/",
   validateToken: "http://localhost:8080/api/validate-token",
   signIn: "http://localhost:8080/api/admin/signin",
   signOut: "http://localhost:8080/api/admin/signout",
};

export { api_urls };
