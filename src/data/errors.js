const {readFileSync} = require('fs');
const path = require('path');

fileImports = () => {

    const filesList = ['1000', '2000', '7000', '8000', 'other'];
    let errors = {};

    filesList.forEach(file => {
        let fetch =  JSON.parse(readFileSync(path.join(__dirname, './errors/'+String(file)+'.json')));
        Object.keys(fetch).forEach(key => errors[key] = fetch[key]);
    });

    return errors;
    
}

module.exports = (res, code, more) => {
    try {
        let error = fileImports()[code];
        error.code = code;
        error.message = more;
        error.additionalInfo = process.env.DEV_URL + '/docs/errors/' + code;
    
        res.status(error.status).json(error);
    }catch{
        return res.status(500).json(fileImports()[500]);
    }
}