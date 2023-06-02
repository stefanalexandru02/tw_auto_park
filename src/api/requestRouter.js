import { decodeToken, loginUser, registerUser } from "./login.js";
import {getParams} from '../utilities.js';
import { GetJudete, GetMarca, GetCombustibil, GetStatistics, GetCategorii, GetAni, GetGraphicsTotalJudete, GetGraphicsTotalCategorii, GetGraphicsTotalAn, SaveSearchForUser, GetSearchesForUser, GetStatisticsRegisterUsers } from "./statistics.js";
import fs from 'fs';
import crypto from 'crypto';
import { AddNewMessage, GetMesaje } from "./messages.js";
import formidable from "formidable";

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
    } else if(req.method === 'POST' && req.url === '/api/register_user') {
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
    } else if(req.method === 'GET' && req.url === '/api/get_admin_statistics_register_users') {
        GetStatisticsRegisterUsers(
            (rows) => {
                const judete = [];
                for( let i=0;i<rows.length;i++)
                    judete.push(rows[i]);
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.write(JSON.stringify(judete));
                response.end();
            });
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
    } else if(req.method === 'GET' && req.url === '/api/statistics/marca') {
        GetMarca((rows)=>{
            const marci = [];
            for( let i=0;i<rows.length;i++)
                marci.push(rows[i]["marca"]);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(marci));
            response.end();
        });
    } else if(req.method === 'GET' && req.url === '/api/statistics/combustibil') {
        GetCombustibil((rows)=>{
            const combustibil = [];
            for( let i=0;i<rows.length;i++)
                combustibil.push(rows[i]["combustibil"]);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(combustibil));
            response.end();
        });
    } else if(req.method === 'POST' && req.url === '/api/statistics/generate_csv') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();

            const params = JSON.parse(body);
            GetStatistics(
                params['an'],
                params['judet'],
                params['categorie'],
                params['categorie_com'],
                params['marca'],
                params['combustibil'],
                undefined,
                undefined,
                (rows, rowsCount) => {
                    const file = `${crypto.randomUUID()}.txt`;
                    try { fs.mkdirSync('static/files'); } catch(e) { }
                    let csv_table = `an;judet;categorie;categorie_com;marca;desc;combustibil;total\n`;
                    for(let i = 0; i < rows.length; i++) {
                        const row = rows[i];
                        csv_table += `${row['an']};${row['judet']};${row['categorie']};${row['categorie_com']};${row['marca']};${row['desc']};${row['combustibil']};${row['total']}\n`;
                    }
                    fs.writeFile(`static/files/${file}`, csv_table, err => {
                        if (err) {
                          console.error(err);
                        }
                      });
                    response.writeHead(200, { 'Content-Type': 'application/text' });
                    response.write(`/files/${file}`);
                    response.end();
                }
            );
        });
    } else if(req.method === 'GET' && req.url === '/api/check_auth') {
        try {
            const authorizationToken = req.headers['authorization'].replace("Bearer ", "");
            console.log(decodeToken(authorizationToken));

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.write(decodeToken(authorizationToken).username);
            response.end();
        } catch(ex) {
            response.writeHead(401, { 'Content-Type': 'application/json' });
            response.write('');
            response.end();
        }
    } else if(req.method === 'POST' && req.url === '/api/get_distribution_chart_data/judete_total'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            const params = JSON.parse(body);

            GetGraphicsTotalJudete(
                params['an'],
                params['categorie'],
                params['marca'],
                params['combustibil'],

                (rows)=>{
                const ani = [];
                for( let i=0;i<rows.length;i++)
                    ani.push(rows[i]);
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.write(JSON.stringify(ani));
                response.end();
            });
        });
    } else if(req.method === 'POST' && req.url === '/api/get_distribution_chart_data/categorii_total'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            const params = JSON.parse(body);

            GetGraphicsTotalCategorii(
                params['an'],
                params['judet'],
                params['marca'],
                params['combustibil'],
            (rows)=>{
                const ani = [];
                for( let i=0;i<rows.length;i++)
                    ani.push(rows[i]);
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.write(JSON.stringify(ani));
                response.end();
            });
        });
    } else if(req.method === 'POST' && req.url === '/api/get_distribution_chart_data/marci_total'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            const params = JSON.parse(body);

            GetGraphicsTotalMarci(
                params['an'],
                params['judet'],
                params['categorie'],
                params['combustibil'],
            
            (rows)=>{
                const ani = [];
                for( let i=0;i<rows.length;i++)
                    ani.push(rows[i]);
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.write(JSON.stringify(ani));
                response.end();
            });
        });
    } else if(req.method === 'POST' && req.url === '/api/get_distribution_chart_data/an_total'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            const params = JSON.parse(body);

            GetGraphicsTotalAn(
                params['judet'],
                params['categorie'],
                params['marca'],
                params['combustibil'],
                (rows)=>{
                const ani = [];
                for( let i=0;i<rows.length;i++)
                    ani.push(rows[i]);
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.write(JSON.stringify(ani));
                response.end();
            });
        });
    } else if(req.method === 'POST' && req.url === '/api/get_distribution_chart_data/combustibil_total'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            const params = JSON.parse(body);

            GetGraphicsTotalAn(
                params['an'],
                params['judet'],
                params['categorie'],
                params['marca'],
            (rows)=>{
                const ani = [];
                for( let i=0;i<rows.length;i++)
                    ani.push(rows[i]);
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.write(JSON.stringify(ani));
                response.end();
            });
        });
    } else if(req.method === 'POST' && req.url === '/api/save_search') {
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();

                const authorizationToken = req.headers['authorization'].replace("Bearer ", "");
                const username = decodeToken(authorizationToken).username;
                const search = JSON.parse(body).search;
                console.log(`Saving search for ${username}`);

                SaveSearchForUser(username, search, (result) => {
                    response.writeHead(201, { 'Content-Type': 'application/json' });
                    response.end(`${result}`);
                });
            });
        } catch(ex) {
            response.writeHead(401, { 'Content-Type': 'application/json' });
            response.write('');
            response.end();
        }
    } else if(req.method === 'POST' && req.url === '/api/mesaje'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();

            const payload = JSON.parse(body);
            const mesaj = payload["mesaj"];

            AddNewMessage(mesaj, (result) => {
                response.writeHead(201, { 'Content-Type': 'application/json' });
                response.end(`${result}`);
            });
        });

    } else if(req.method === 'GET' && req.url === '/api/mesaje'){
        try {
            const authorizationToken = req.headers['authorization'].replace("Bearer ", "");
            const username = decodeToken(authorizationToken).username;
            if(username!=="admin") {
                response.writeHead(401, { 'Content-Type': 'application/json' });
                response.write(ex);
                response.end();
            } else {
                GetMesaje( (rows) => {
                    const mesaje = [];
                    for( let i=0;i<rows.length;i++)
                        mesaje.push(rows[i]);
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.write(JSON.stringify(mesaje));
                    response.end();
                 });
            }    
        } catch(ex) {
            response.writeHead(401, { 'Content-Type': 'application/json' });
            console.log(ex);
            response.write(ex);
            response.end();
        }
    } else if(req.method === 'GET' && req.url === '/api/get_searches'){
        try {
            const authorizationToken = req.headers['authorization'].replace("Bearer ", "");
            const username = decodeToken(authorizationToken).username;
            GetSearchesForUser(username, (rows) => {
                const marci = [];
                for( let i=0;i<rows.length;i++)
                    marci.push(rows[i]);
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.write(JSON.stringify(marci));
                response.end();
             });
    
        } catch(ex) {
            response.writeHead(401, { 'Content-Type': 'application/json' });
            console.log(ex);
            response.write(ex);
            response.end();
        }
    } else if(req.method === 'POST' && req.url === '/api/admin/upload_csv') {
        console.log('file is uploaded');
        const form = formidable({ multiples: true })
        form.parse(req, (error, fields, files) => {
          if (error) {
            console.log(error)
            return;
          }
          fs.copyFileSync(files['pickFile'].filepath, "../data/_import.qq1");
        //   runAll(true, () => {
        //     response.writeHead(200, { 'Content-Type': 'application/html' });
        //     response.write(`
        //     Actualizat cu succes
        //     `);
        //     fs.unlink("../data/_import.qq1");
        //     response.end();
        //   });
        });
    } else {
        console.log(`Unrecognized request: ${req.method} ${req.url}`)
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