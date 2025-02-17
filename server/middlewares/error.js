module.exports = (err, req, res, next) => {
    const { statusCode = 500, message = "Oh no! Something went wrong!!" } = err;
    console.log("****error****")
    console.log(err);

    console.log(err.name);
    if (err.name === 'ValidationError') {
        res.status(406).json({
            success: false,
            error: `MongoDB validation error...${err.message}`
        })
    }
    else if (err.name === 'CastError') {
        res.status(406).json({
            success: false,
            error: `Resource Not Found.. Invalid:${err.path}`

        });
    }
    else if (err.name === "JsonWebTokenError") {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(401).json({
            success: false,
            error: "Json Web Token is invalid",
        });
    }
    else if (err.name === "TokenExpiredError") {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(401).json({
            success: false,
            error: "Json Web Token is expired",
        });
    }
    else {
        res.status(statusCode).json({
            success: false,
            error: err.message
        });
    }
}