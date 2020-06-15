const fs = require('fs');
const path = require('path');

module.exports = (provider) => {
    const providers = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/emailproviders.json')));
    providers.forEach(one => {
        if(one.id === provider) {
            return one;
        }
    });
    throw('error');
}