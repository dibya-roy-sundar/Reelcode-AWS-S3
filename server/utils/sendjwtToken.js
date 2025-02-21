const sendjwtToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    let options = {
        expires: new Date(
            Date.now() + 10 * 24 * 50 * 60 * 1000
        ),
        httpOnly: true,
        // sameSite: 'None',
        secure: (process.env.NODE_ENV === 'production'),
        sameSite:'Lax',
    }
    res.cookie('token',token,options)
    res.status(statusCode).json({
        success: true,
        user,
        token,
    });
};

module.exports = sendjwtToken;