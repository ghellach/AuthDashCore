// Models
const Cluster = require('./models/Cluster');
const Application = require('./models/Application');
const User = require('./models/User');
// Parsers and validators
const statisticsValidators = require('./validators/statisticsValidators');
const errorParser = require('./data/errors');

function applicationResponseObject(app) {
    
    const response = {
        names: app.names,
        createdAt: app.name,
        styles: {
            color: app.color,
            backgroundColor: app.backgroundColor,
            backgroundImage: app.backgroundImage,
            iconPath: app.iconPath
        },
        callbackUrl: app.callbackUrl,
        // TODO add numbers data and put dataListeners across auth routes
        numberOfConnections: null,
        numberOfRegistrations: null,
        numberOfPasswordResets: null
    };
    return response;
}

async function cluster (req, res) {
    // body validation
    const {error} = statisticsValidators.clusterValidator(req.body);
    if(error) return errorParser(res, "validation", error);

    // fetches application
    const cluster = await Cluster.findOne({
        clusterId: req.body.clusterId,
        clusterSecret: req.body.clusterSecret
    });

    // generate appropriate error message id required
    if(!cluster) return errorParser(res, 1002);

    // fetches cluster's applications and users (users to be counted)
    const appFetch = await Application.find({clusterId: cluster._id});
    const usersCount = (await User.find({clusterId: cluster._id})).length;

    // generates app response format
    const applications = appFetch.map(app => applicationResponseObject(app));

    // prepare response
    const response = {
        names: cluster.names,
        createdAt: cluster.createdAt,
        emailProvider: cluster.emailProfile.service,
        usersCount,
        applicationsCount: applications.count,
        applications,
    }


    return res.send(response);
}

async function application(req, res) {
    const {error} = statisticsValidators.applicationValidator(req.body);
    if(error) return errorParser(res, "validation", error);

    const application = await Application.findOne({
        appId: req.body.appId,
        appSecret: req.body.appSecret
    });

    if(!application) return errorParser(res, 1001);

    return res.json(applicationResponseObject(application));
}

async function clusterOrderBy(req, res) {
    const {error} = statisticsValidators.clusterOrderByValidator(req.body);
    if(error) return errorParser(res, "validation", error);

    // fetches application
    const cluster = await Cluster.findOne({
        clusterId: req.body.clusterId,
        clusterSecret: req.body.clusterSecret
    });

    if(!cluster) return errorParser(res, 1002);

    res.send('ok')

}

module.exports = {
    cluster,
    application,
    clusterOrderBy
}