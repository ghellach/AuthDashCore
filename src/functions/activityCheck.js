const {emailConfimation} = require('../gateways/emailGateway');
const Cluster = require('../models/Cluster');
const errorParser = require('../data/errors');

module.exports = async function activityCheck(res, user, errorParser) {
    if(user.active === 9) {
        const cluster = await Cluster.findOne({_id: user.clusterId});
        return emailConfimation(res, user, cluster, errorParser, "emailConfirmation", true);
    }
    if(user.active === 8) return errorParser(res, 7023);
    if(user.active !== 1) return errorParser(res, 7024);

    return;
}