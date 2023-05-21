import sqlite3 from 'sqlite3';
const dbFilePath = "../database.db";

export const GetStatistics = (an, judet, categorie, categorie_com, marca, combustibil, pageIndex = undefined, pageSize = undefined, callback) => {
    const querry = GetStatisticsQuery(an, judet, categorie, categorie_com, marca, combustibil, pageIndex, pageSize);
    const querryCount = GetStatisticsQuery(an, judet, categorie, categorie_com, marca, combustibil, undefined, undefined, true);
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

            db.get(
                querryCount,
                {
                    $an: an,
                    $judet: judet,
                    $categorie: categorie, 
                    $categorie_com: categorie_com,
                    $marca: marca,
                    $combustibil: combustibil
                },
                (errCount, rowsCount) => {
                    if(errCount)
                    {
                        console.log(errCount);
                        callback(errCount);
                    }
                    
                    db.close();
                    callback(rows, rowsCount['total']);
                }
            );
        }
    );
    return querry;
}

const GetStatisticsQuery = (an, judet, categorie, categorie_com, marca, combustibil, 
    pageIndex = undefined, pageSize = undefined, countOnly = false
) => {
    let querry = countOnly ? "select count(*) as total from masini" : "select * from masini";
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
export const GetCombustibil = (callback) => {
    const db = new sqlite3.Database(dbFilePath);
    db.all(
        'select distinct combustibil from masini;', 
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
export const GetMarca = (callback) => {
    const db = new sqlite3.Database(dbFilePath);
    db.all(
        'select distinct marca from masini;', 
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


export const GetGraphicsTotalJudete = (an, categorie, marca, combustibil, callback) => {
    const db = new sqlite3.Database(dbFilePath);

    let query = GetStatisticsQuery(an, undefined, categorie, undefined, marca, combustibil, undefined, undefined, true);
    query = query.replace("select count(*) as total", "select judet, count(*) as total");
    query = query.replace("and judet = $judet", "");
    query = `${query} group by judet;`

    db.all(
        query,
        { 
            $an: an,
            $categorie: categorie, 
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
} 
export const GetGraphicsTotalCategorii = (an, judet, marca, combustibil, callback) => {
    const db = new sqlite3.Database(dbFilePath);

    let query = GetStatisticsQuery(an, judet, undefined, undefined, marca, combustibil, undefined, undefined, true);
    query = query.replace("select count(*) as total", "select categorie, count(*) as total");
    query = `${query} group by categorie;`;

    db.all(
        query,
        { 
            $an: an,
            $judet: judet, 
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
}
export const GetGraphicsTotalAn = (judet, categorie, marca, combustibil, callback) => {
    const db = new sqlite3.Database(dbFilePath);

    let query = GetStatisticsQuery(undefined, judet, categorie, undefined, marca, combustibil, undefined, undefined, true);
    query = query.replace("select count(*) as total", "select an, count(*) as total");
    query = query.replace("and an = $an", "");
    query = `${query} group by an;`

    db.all(
        query,
        { 
            $judet: judet,
            $categorie: categorie, 
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
} 
export const GetGraphicsTotalMarca = (an, judet, categorie, combustibil, callback) => {
    const db = new sqlite3.Database(dbFilePath);

    let query = GetStatisticsQuery(an, judet, undefined,undefined,combustibil, undefined, undefined, undefined, true);
    query = query.replace("select count(*) as total", "select marca, count(*) as total");
    query = query.replace("and marca = $marca", "");
    query = `${query} group by marca;`

    db.all(
        query,
        { 
            $an: an,
            $judet: judet,
            $categorie: categorie, 
            $combustibil: combustibil,
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
} 
export const GetGraphicsTotalCombustibil = (an, judet, categorie, marca, callback) => {
    const db = new sqlite3.Database(dbFilePath);

    let query = GetStatisticsQuery(an, judet, undefined,undefined,marca, undefined, undefined, undefined, true);
    query = query.replace("select count(*) as total", "select combustibil, count(*) as total");
    query = query.replace("and combustibil = $combustibil", "");
    query = `${query} group by combustibil;`

    db.all(
        query,
        { 
            $an: an,
            $judet: judet,
            $categorie: categorie, 
            $marca: marca,
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
} 