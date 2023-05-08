export const GetStatistics = (an, judet, categorie, categorie_com, marca, combustibil) => {
    let querry = "select * from masini";
    let hasFilters = an || judet || categorie || categorie_com || marca || combustibil;
    filters = {
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
}

const hasPreviousWhere = (filters, type) => {
    if(type === 'an') 
        return false;
    if(type === 'judet') 
        return hasType['an'];
    if(type === 'categorie') 
        return hasPreviousWhere(filters, 'judet') || hasType(filters, 'judet')
    if(type === 'categorie_com')
        return hasPreviousWhere(fitlers, 'categorie') || hasType(filters, 'categorie');
    if(type === 'marca')
        return hasPreviousWhere(fitlers, 'categorie_com') || hasType(filters, 'categorie_com');
    if(type === 'combustibil')
        return hasPreviousWhere(filters, 'marca') || hasType(filters, 'marca');
}

const hasType = (filters, type) => {
    return filters[type] !== undefined;
}