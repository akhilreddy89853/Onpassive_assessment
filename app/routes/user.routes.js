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
    app.get("/api/user/getToken", User.generateToken);
    app.post("/api/user/signup", authJwt.verifyToken,verifySignUp.checkDuplicateUsernameOrEmail, User.signup);
    app.post("/api/user/signin",authJwt.verifyToken, User.signin);
    app.post("/api/user/requestResetPassword", authJwt.verifyToken, User.resetPasswordLink);
    app.put("/api/user/restPassword", authJwt.verifyToken, User.resetPassword)
};