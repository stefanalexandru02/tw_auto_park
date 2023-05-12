import { decodeToken, loginUser, registerUser } from "./login.js";
import {getParams} from '../utilities.js';
import { GetJudete, GetStatistics, GetCategorii, GetAni } from "./statistics.js";

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
    } else if(req.method === 'POST' && req.url === '/api/register_user'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();

            const auth_payload = JSON.parse(body);
            const username = auth_payload["USERNAME"];
            const password = auth_payload["PASSWORD"];

            registerUser(username, password, (status) => {
                response.write(status);
                response.end();
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
            (rows, rowsCount) => {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.write(
                    JSON.stringify({
                        'elements': rows,
                        'totalCount': rowsCount
                    })
                );
                response.end();
            }
        );
    } else if(req.method === 'GET' && req.url === '/api/statistics/judete') {
        GetJudete((rows)=>{
            const judete = [];
            for( let i=0;i<rows.length;i++)
                judete.push(rows[i]["judet"]);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(judete));
            response.end();
        });
    } else if(req.method === 'GET' && req.url === '/api/statistics/categorii') {
        GetCategorii((rows)=>{
            const categorii = [];
            for( let i=0;i<rows.length;i++)
                categorii.push(rows[i]["categorie"]);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(categorii));
            response.end();
        });
    } else if(req.method === 'GET' && req.url === '/api/statistics/ani') {
        GetAni((rows)=>{
            const ani = [];
            for( let i=0;i<rows.length;i++)
                ani.push(rows[i]["an"]);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(ani));
            response.end();
        });
    } else if(req.method === 'GET' && req.url === '/api/check_auth') {
        try {
            const authorizationToken = req.headers['authorization'].replace("Bearer ", "");
            console.log(decodeToken(authorizationToken));

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.write('OK');
            response.end();
        } catch(ex) {
            response.writeHead(401, { 'Content-Type': 'application/json' });
            response.write('');
            response.end();
        }
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