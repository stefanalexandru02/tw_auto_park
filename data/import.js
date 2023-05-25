const fs = require('fs');
const sqlite3 = require("sqlite3").verbose();
const dbFilePath = "../database.db";

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
        password   VARCHAR(50)
    );

    CREATE TABLE saved_searches 
    (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        username   VARCHAR(50),
        nume       VARCHAR(50),
        added_time TEXT,
        filters    TEXT
    );
`, ()=> {
    db.run("insert into users (username,password) values ('test', 'test');");
    fs.readdir(".", (err, files) => {
        files.forEach(file => {
            if(file.includes(".csv"))
            {
                let elements = [];
                const year = file.replace("parcauto", "").replace("combustibil", "").replace(".csv", "");
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