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

    // fetches cluster
    const clusterFetch = await Cluster.find({
        clusterId: req.body.clusterId,
        clusterSecret: req.body.clusterSecret
    });
    let cluster = {};
    clusterFetch.forEach(one => {
        if(one.clusterId === req.body.clusterId && one.clusterSecret === req.body.clusterSecret) {
            cluster = one;
        }
    });

    // generate appropriate error message id required
    if(cluster == {}) return errorParser(res, 1002);

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

module.exports = {
    cluster
}