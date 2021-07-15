const User = require("../controllers/user.controller.js");
const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/auth/signup",
        verifySignUp.checkDuplicateUsernameOrEmail,
        User.signup
    );
    app.post("/api/auth/signin", User.signin);
    app.post("/api/auth/requestResetPassword",authJwt.verifyToken,User.resetPasswordLink);
    app.put("/api/auth/restPassword",authJwt.verifyToken,User.resetPassword)
};