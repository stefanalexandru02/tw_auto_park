import sqlite3 from 'sqlite3';
const dbFilePath = "../database.db";

export const GetStatistics = (an, judet, categorie, categorie_com, marca, combustibil, pageIndex = undefined, pageSize = undefined, callback) => {
    const querry = GetStatisticsQuery(an, judet, categorie, categorie_com, marca, combustibil, pageIndex, pageSize);
    const db = new sqlite3.Database(dbFilePath);
    console.log(`Executing '${querry}'`);
    db.all(
        querry, 
        {
            $an: an,
            $judet: judet,
            $categorie: categorie, 
            $categorie_com: categorie_com,
            $marca: marca,
            $combustibil: combustibil
        },
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
    return querry;
}

const GetStatisticsQuery = (an, judet, categorie, categorie_com, marca, combustibil, 
    pageIndex = undefined, pageSize = undefined
) => {
    let querry = "select * from masini";
    let hasFilters = an || judet || categorie || categorie_com || marca || combustibil;
    let filters = {
        an: an, 
        judet: judet, 
        categorie: categorie, 
        categorie_com: categorie_com, 
        marca: marca, 
        combustibil: combustibil
    }
    if(hasFilters) {
        querry = `${querry} where`;
        if(an) {
            querry = `${querry} an = $an`
        }
        if(judet) {
            if(hasPreviousWhere(filters, 'judet'))
                querry =`${querry} and`
            querry = `${querry} judet = $judet`
        }
        if(categorie) {
            if(hasPreviousWhere(filters, 'categorie'))
                querry =`${querry} and`
            querry = `${querry} categorie = $categorie`
        }
        if(categorie_com) {
            if(hasPreviousWhere(filters, 'categorie_com'))
                querry =`${querry} and`
            querry = `${querry} categorie_com = $categorie_com`
        }
        if(marca) {
            if(hasPreviousWhere(filters, 'marca'))
                querry =`${querry} and`
            querry = `${querry} marca = $marca`
        }
        if(combustibil) {
            if(hasPreviousWhere(filters, 'combustibil'))
                querry =`${querry} and`
            querry = `${querry} combustibil = $combustibil`
        }
    }
    if(pageIndex && pageSize)
    {
        querry = `${querry} limit ${pageSize} offset ${pageSize * pageIndex}`;
    }
    return querry;
}

const hasPreviousWhere = (filters, type) => {
    if(type === 'an') 
        return false;
    if(type === 'judet') 
        return hasType(filters,'an');
    if(type === 'categorie') 
        return hasPreviousWhere(filters, 'judet') || hasType(filters, 'judet')
    if(type === 'categorie_com')
        return hasPreviousWhere(filters, 'categorie') || hasType(filters, 'categorie');
    if(type === 'marca')
        return hasPreviousWhere(filters, 'categorie_com') || hasType(filters, 'categorie_com');
    if(type === 'combustibil')
        return hasPreviousWhere(filters, 'marca') || hasType(filters, 'marca');
}

const hasType = (filters, type) => {
    return filters[type] !== undefined;
}

export const GetJudete = (callback) => {
    const db = new sqlite3.Database(dbFilePath);
    db.all(
        'select distinct judet from masini;', 
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

export const GetCategorii = (callback) => {
    const db = new sqlite3.Database(dbFilePath);
    db.all(
        'select distinct categorie from masini;', 
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
export const GetAni = (callback) => {
    const db = new sqlite3.Database(dbFilePath);
    db.all(
        'select distinct an from masini;', 
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