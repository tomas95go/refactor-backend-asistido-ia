import request from 'supertest';
import dotenv from "dotenv";
import { Server } from "node:http";
import { createServer } from '../../app';

dotenv.config({ path: '.env.test' });

describe('Status endpoint', () => {
    let server: Server;

    beforeAll(() => {
        const SERVER_PORT = process.env.SERVER_PORT;
        const DATABASE_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

        if(!DATABASE_CONNECTION_STRING || !SERVER_PORT) {
            console.error('Missing environment variables');
            process.exit(1);
        }

        server = createServer(SERVER_PORT, DATABASE_CONNECTION_STRING)
    });

    afterAll(() => {
        server.close();
    })


    it('checks API health', async () => {
        const response = await request(server).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
});