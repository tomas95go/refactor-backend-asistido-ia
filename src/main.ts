import dotenv from "dotenv";
import { createServer } from "./app";
import {Messenger} from "./order/domain/messenger/messenger";
import {Factory} from "./factory";

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

export const DATABASE_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
export const SERVER_PORT = process.env.SERVER_PORT;

if(!DATABASE_CONNECTION_STRING || !SERVER_PORT) {
    console.error('Missing environment variables');
    process.exit(1);
}

const mailjet: Messenger = Factory.createMailjetMessenger();

createServer(SERVER_PORT, mailjet).then(server => server);