const fs = require('fs');
const sqlite3 = require("sqlite3").verbose();
const dbFilePath = "../database.db";

try { fs.unlinkSync(dbFilePath); } catch(e) { }

const db = connectToDatabase();
db.exec(`
    CREATE TABLE masini
    (
      year       VARCHAR(50),
      judet VARCHAR(50),
      categorie   VARCHAR(50),
      categorie_com        VARCHAR(50),
      marca              VARCHAR(50),
      desc              VARCHAR(50),
      combustibil         VARCHAR(50),
      total         NUMERIC
    );
`, ()=> {
    fs.readdir(".", (err, files) => {
        files.forEach(file => {
            if(file.includes(".csv"))
            {
                const year = file.replace("parcauto", "").replace("combustibil", "").replace(".csv", "");
                console.log(year);
                let fLine = true;
                const allFileContents = fs.readFileSync(file, 'utf-8');
                    allFileContents.split(/\r?\n/).forEach(async line =>  {
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
    
                                try {
                                    const querry =  `insert into masini (year, judet, categorie, categorie_com, marca, desc, combustibil, total) VALUES ($year, $judet, $categorie, $categorie_com, $marca, $desc, $combustibil, $total);`;
                                    await db.run(querry, {
                                        $year: year, 
                                        $judet: judet, 
                                        $categorie: categorie, 
                                        $categorie_com: categorie_com, 
                                        $marca: marca, 
                                        $desc: desc, 
                                        $combustibil: combustibil, 
                                        $total: total
                                    });
                                } catch (e) {
                                    console.log('ERROR EXECUTING INSERT');
                                    console.log(e);
                                }  
                            }
                        }
                });
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