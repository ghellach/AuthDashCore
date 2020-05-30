module.exports = (data) => {
    if(!data.error){
        return {error:null};
    }
    let details = data.error.details;
    let go;
    details.forEach(one => {
        go = one.message;
    });
    return {
        error: go
    }
}