import { config } from "dotenv";
config();
export default { secret: process.env.TOKEN_SECRET as string };
