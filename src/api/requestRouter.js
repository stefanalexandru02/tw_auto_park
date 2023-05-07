import { loginUser } from "./login.js";

export const routeRequest = (req, response) => {
    if(req.method === 'POST' && req.url === '/api/authenticate_user') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();

            const auth_payload = JSON.parse(body);
            const username = auth_payload["USERNAME"];
            const password = auth_payload["PASSWORD"];

            const token = loginUser(username, password);
            response.write(token);
            response.end();
        });
    } else {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.write('');
        response.end();
    }
}