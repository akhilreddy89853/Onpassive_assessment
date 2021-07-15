const Employee = require("../controllers/employee.controller.js");
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

    app.post("/api/employee/add", authJwt.verifyToken, Employee.createEmployee);
    app.get("/api/employee/list", authJwt.verifyToken, Employee.listAllEmployees);
    app.put("/api/employee/update/:id", authJwt.verifyToken, Employee.updateEmployee);
    app.delete("/api/employee/delete/:id", authJwt.verifyToken, Employee.deleteEmployee);
    app.get("/api/employee/search", authJwt.verifyToken, Employee.searchEmployee);
    app.get("/api/employee/dashboardCount", authJwt.verifyToken, Employee.dashboardCount);
};