import { decodeToken, loginUser } from "./login.js";
import {getParams} from '../utilities.js';
import { GetStatistics } from "./statistics.js";

export const routeRequest = (req, response) => {
    if(req.method === 'POST' && req.url === '/api/authenticate_user') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();

            const auth_payload = JSON.parse(body);
            const username = auth_payload["USERNAME"];
            const password = auth_payload["PASSWORD"];

            loginUser(username, password, (token) => {
                if(token === "NOT_AUTHORIZED") {
                    response.writeHead(401, { 'Content-Type': 'application/json' });
                    response.write(token);
                    response.end();
                } else {
                    response.write(token);
                    response.end();
                }
            });
        });
    } else if(req.method === 'GET' && req.url.includes('/api/get_statistics')) {
        const params = getParams(req);
        GetStatistics(
            params['an'],
            params['judet'],
            params['categorie'],
            params['categorie_com'],
            params['marca'],
            params['combustibil'],
            params['pageIndex'],
            params['pageSize'],
            (rows) => {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.write(JSON.stringify(rows));
                response.end();
            }
        );
    } else {
        try {
            const authorizationToken = req.headers['authorization'].replace("Bearer ", "");
            console.log(decodeToken(authorizationToken));

            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.write('');
            response.end();
        } catch(ex) {
            response.writeHead(401, { 'Content-Type': 'application/json' });
            response.write('');
            response.end();
        }
    }
}