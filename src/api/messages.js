import sqlite3 from 'sqlite3';
import { getDate } from './statistics.js';
const dbFilePath = "../database.db";

export const AddNewMessage = (mesaj, callback) => {
    const db = new sqlite3.Database(dbFilePath);

    db.run(`insert into mesaje_primite (mesaj, added_time) values ($mesaj, '${getDate()}');`, {
        $mesaj: mesaj
    }, (err, a) => {
            if(err)
            {
                console.log(err);
                callback(false);
            }
            db.close();
            callback(true);
        }
    );
}

export const GetMesaje = (callback) => {
    const db = new sqlite3.Database(dbFilePath);
    db.all(
        'select * from mesaje_primite;', 
        { },
        (err, rows) => {
            if(err)
            {
                console.log(err);
                callback(err);
            }
            db.close();
            callback(rows);
        }
    );
}