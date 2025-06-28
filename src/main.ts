import dotenv from "dotenv";
import { createServer } from "./app";

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

export const DATABASE_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
export const SERVER_PORT = process.env.SERVER_PORT;

console.log(process.env.NODE_ENV);

if(!DATABASE_CONNECTION_STRING || !SERVER_PORT) {
    console.error('Missing environment variables');
    process.exit(1);
}

createServer(SERVER_PORT, DATABASE_CONNECTION_STRING).then(server => server);