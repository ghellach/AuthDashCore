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

    // defines property work with
    const p = req.body.property;

    // fetches users for this cluster
    const users = await User.find({clusterId: cluster._id});

    // get values for the requested property from each user
    const c = {};
    if(p === "lang" || p === "active"){
        users.forEach(user => {
            let his = user[p];
            if(!c[his]) c[his] = 0;
            c[his]++;
        });
    }else{
        users.forEach(user => {
            let his = user.properties[p];
            if(!c[his]) c[his] = 0;
            c[his]++;
        });
    }

    // sorts the properies values depending on the order specified by the client
    let keysSorted;
    if(req.body.order === "desc") keysSorted = Object.keys(c).sort(function(a,b){return c[a]+c[b]});
    else if(req.body.order === "asc") keysSorted = Object.keys(c).sort(function(a,b){return c[a]-c[b]});
    else return errorParser(res, "ipv");


    // finalize results
    const objectSorted = {};
    keysSorted.forEach(key => {
        objectSorted[key] = c[key];
    });

    // create alert message of the propery does not exist.
    let results = objectSorted;
    if(objectSorted.undefined === users.length) {
        results = "the requested property does not exist on any user in the cluster"
    }
    return res.json({
        property: p,
        order: req.body.order,
        results
    });
}

async function getAllUsers (req, res) {
    const {error} = statisticsValidators.clusterValidator(req.body);
    if(error) return errorParser(res, "validation", error);

    //fetches cluster
    const cluster = await Cluster.findOne({
        clusterId: req.body.clusterId,
        clusterSecret: req.body.clusterSecret
    });

    // generate appropriate error message id required
    if(!cluster) return errorParser(res, 1002);

    // fetches all users
    const usersFetch = await User.find({clusterId: cluster._id});
    const copy = [...usersFetch];
    const users = copy.map(user => {
        user.password = undefined
        return user;
    });

    return res.json({
        usersCount: usersFetch.length,
        users
    });
}

module.exports = {
    cluster,
    application,
    clusterOrderBy,
    getAllUsers
}