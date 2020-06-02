module.exports = (res, code, more) => {
    const url = process.env.ERROR_SITE_URL;
    const errorsList = {
        "500": {
            status: 500,
            error: "Server Error",
        },
        "validation": {
            status: 400,
            code: 8030,
            error: more,
            additional_info: url + 8030
        },
        1000: {
            status: 400,
            code: code,
            error: "application with id provided not found",
            additional_info: url + code
        },
        1001: {
            status: 401,
            code: code,
            error: "app credentials are invalid",
            additional_info: url + code
        },
        2000: {
            status: 400,
            code: code,
            error: "token is invalid",
            additional_info: url + code
        },


        7001: {
            status: 400,
            code: code,
            error: "user not found",
            additional_info: url + code
        },
        7002: {
            status: 400,
            code: code,
            error: "password is wrong",
            additional_info: url + code
        },
        7010: {
            status: 401,
            code: code,
            error: "access token is invalid",
            additional_info: url + code
        },
        8000: {
            status: 401,
            code: code,
            error: "this email is already used in the cluster",
            additional_info: url + code
        },
    }
    try {
        const one = errorsList[code];
        res.status(one.status).send(one);
    }catch{
        return res.status(500).send(errorsList[500]);
    }
}