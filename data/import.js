import fs from 'fs';
import sqlite3 from 'sqlite3';
const dbFilePath = "../database.db";

export const runAll = (manual = false, callback = ()=>{}) => {
    try { fs.unlinkSync(dbFilePath); } catch(e) { }

    const db = connectToDatabase();
    db.exec(`
        CREATE TABLE masini
        (
        an       NUMERIC,
        judet VARCHAR(50),
        categorie   VARCHAR(50),
        categorie_com        VARCHAR(50),
        marca              VARCHAR(50),
        desc              VARCHAR(50),
        combustibil         VARCHAR(50),
        total         NUMERIC
        );

        CREATE TABLE users
        (
            username  VARCHAR(50),
            password   VARCHAR(50),
            added_time TEXT
        );

        CREATE TABLE saved_searches 
        (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            username   VARCHAR(50),
            nume       VARCHAR(50),
            added_time TEXT,
            filters    TEXT
        );

        CREATE TABLE mesaje_primite
        (

            mesaj    TEXT,
            added_time     TEXT

        );
    `, ()=> {
        db.run("insert into users (username,password,added_time) values ('admin', 'admin', '24-05-2023');");
        db.run("insert into users (username,password,added_time) values ('test', 'test', '24-05-2023');");
        db.run("insert into users (username,password,added_time) values ('test1', 'test1', '26-05-2023');");
        db.run("insert into users (username,password,added_time) values ('test2', 'test2', '26-05-2023');");
        db.run("insert into users (username,password,added_time) values ('test3', 'test3', '26-05-2023');");
        db.run("insert into users (username,password,added_time) values ('test4', 'test4', '26-05-2023');");
        db.run("insert into users (username,password,added_time) values ('test5', 'test5', '01-06-2023');");
        db.run("insert into users (username,password,added_time) values ('test7', 'test7', '01-06-2023');");
        db.run("insert into users (username,password,added_time) values ('test8', 'test8', '01-06-2023');");
        db.run("insert into users (username,password,added_time) values ('test9', 'test9', '01-06-2023');");
        db.run("insert into users (username,password,added_time) values ('test10', 'test10', '01-06-2023');");
        db.run("insert into users (username,password,added_time) values ('test11', 'test11', '02-06-2023');");
        db.run("insert into users (username,password,added_time) values ('test12', 'test12', '02-06-2023');");

        fs.readdir(".", (err, files) => {
            files.forEach(file => {
                if(manual === false && file.includes(".csv") || manual === true && file.includes(".qq1"))
                {
                    let elements = [];
                    const year = manual === false ? file.replace("parcauto", "").replace("combustibil", "").replace(".csv", "") : 2023;
                    console.log(year);
                    let fLine = true;
                    const allFileContents = fs.readFileSync(file, 'utf-8');
                        allFileContents.split(/\r?\n/).forEach(line =>  {
                            if(fLine) {
                                fLine = false;
                            } else {  
                                const parts = line.split(",");
                                if(parts.length > 1) {
                                    const judet = parts[0].replace('"', '').replace('"', '');
                                    const categorie = parts[1].replace('"', '').replace('"', '');
                                    const categorie_com = parts[2].replace('"', '').replace('"', '');
                                    const marca = parts[3].replace('"', '').replace('"', '');
                                    const desc = parts[4].replace('"', '').replace('"', '');
                                    const combustibil = parts[5].replace('"', '').replace('"', '');
                                    const total = parts[6].replace('"', '').replace('"', '');
        
                                    elements.push([
                                        year, 
                                        judet, 
                                        categorie, 
                                        categorie_com, 
                                        marca, 
                                        desc, 
                                        combustibil, 
                                        total
                                    ]);

                                    if(elements.length === 100) {
                                        let placeHolders = elements.map(() => "(?, ?, ?, ?, ?, ?, ?, ?)").join(', ');
                                        const querry =  `insert into masini (an, judet, categorie, categorie_com, marca, desc, combustibil, total) 
                                            VALUES ${placeHolders}`;
                                        let flatArtist = [];
                                        elements.forEach((arr) => { arr.forEach((item) => { flatArtist.push(item) }) });
                                            
                                        try {
                                            db.serialize(function(){
                                                db.run(querry, flatArtist);
                                            });
                                        } catch (e) {
                                            console.log('ERROR EXECUTING INSERT');
                                            console.log(e);
                                        }  

                                        elements = [];
                                    }
                                }
                            }
                    });

                    let placeHolders = elements.map(() => "(?, ?, ?, ?, ?, ?, ?, ?)").join(', ');
                    const querry =  `insert into masini (an, judet, categorie, categorie_com, marca, desc, combustibil, total) 
                        VALUES ${placeHolders}`;
                    let flatArtist = [];
                    elements.forEach((arr) => { arr.forEach((item) => { flatArtist.push(item) }) });
                        
                    try {
                        db.serialize(function(){
                            db.run(querry, flatArtist);
                        });
                    } catch (e) {
                        console.log('ERROR EXECUTING INSERT');
                        console.log(e);
                    }  

                    console.log("------------------------------------------");
                }
            });
        });

        if(manual) {
            callback();
        }
    });

    function connectToDatabase() {
    if (fs.existsSync(dbFilePath)) {
        return new sqlite3.Database(dbFilePath);
    } else {
        const db = new sqlite3.Database(dbFilePath, (error) => {
        if (error) {
            return console.error(error.message);
        }
        console.log("Connected to the database successfully");
        console.log("------------------------------------------");
        });
        return db;
    }
    }
}

runAll();