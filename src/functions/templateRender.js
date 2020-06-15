const handlebars = require('handlebars');

function render (toRender, parameters) {
    const template = handlebars.compile(toRender);
    return(template(parameters));
}

module.exports = render;