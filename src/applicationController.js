const Application = require('./models/Application');
const Connection = require('./models/Connection');
const applicationValidator = require('./validators/applicationValidator');
const errorParser = require('./data/errors');
const { response } = require('express');

const fetch = async (req, res) => {
    if(!req.params.id) return errorParser(res, "validation", {error: 'id is required'});
    console.log(req.params.id)
    const app = await Application.findOne({appId: req.params.id, active: true});

    if(!app) return errorParser(res, 1000);

    const responseObject = {
        appId: app.appId,
        names: app.names,
        callbackUrl: app.callbackUrl,
        color: app.color,
        backgroundColor: app.backgroundColor,
        backgroundImage: app.backgroundImage,
        iconPath: app.iconPath
    };

    return res.json(responseObject);
}

const connectionsource = async(req, res) => {
    if(!req.params.connection) return errorParser(res, "validation", {error: 'connection is required'});

    const connection = await Connection.findOne({connectionId: req.params.connection, activated: false, revoked: false}).populate('appId');
    if(!connection) return res.status(400).send('none');
    res.send(connection.appId.callbackUrl)
}

module.exports = {
    fetch,
    connectionsource
}