module.exports = function activityCheck(user, errorParser) {
    if(user.active === 9) return errorParser(res, 7021);
    if(user.active === 8) return errorParser(res, 7023);
    if(user.active !== 1) return errorParser(res, 7024);

    return;
}