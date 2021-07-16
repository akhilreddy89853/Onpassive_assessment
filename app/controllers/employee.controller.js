const db = require("../models/index");
const Employee = db.employee;
const Op = db.Sequelize.Op;
const { response } = require("express");
const { employee } = require("../models");

const dotenv = require('dotenv');
dotenv.config();

var mysql = require('mysql')
var connection = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DB
})

exports.createEmployee = (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.send({
            message: "Request body cannot be empty!"
        })
    } else {
        Employee.create({
            fullName: req.body.fullName,
            jobTitle: req.body.jobTitle,
            department: req.body.department,
            location: req.body.location,
            age: req.body.age,
            Salary: req.body.Salary
        })
            .then(employee => {
                res.status(200).send({ message: "Employee has been created successfully!" });
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });
    }
}

exports.listAllEmployees = (req, res) => {
    var size = req.query.size;
    var page = req.query.page;
    const { limit, offset } = getPagination(page, size);

    Employee.findAll({
        limit,
        offset
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Employee."
            });
        });
}

exports.updateEmployee = (req, res) => {
    const id = req.params.id;

    Employee.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Employee was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Employee with id=${id}. Maybe Employee was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Employee with id=" + id
            });
        });
}

exports.deleteEmployee = (req, res) => {
    const id = req.params.id;

    Employee.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Employee was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Employee with id=${id}. Maybe Employee was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Employee with id=" + id
            });
        });
}

exports.searchEmployee = (req, res) => {
    var size = req.query.size;
    var page = req.query.page;
    const { limit, offset } = getPagination(page, size);
    search = req.query.search
    if (!search) {
        res.status(204).send("Seach cannot be empty!");
    }
    var searchEmployees = `SELECT * FROM employees WHERE (fullName LIKE '%${search}%' OR jobTitle LIKE '%${search}%' OR department LIKE '%${search}%' OR location LIKE '%${search}%' OR age LIKE '%${search}%' OR Salary LIKE '%${search}%') LIMIT  ${limit} OFFSET ${offset} `
    console.log(searchEmployees)
    connection.query(searchEmployees, function (errQuery, resQuery) {
        if (errQuery) {
            res.status(500).send({
                message: "Error in executing query!"
            })
        } else {
            res.send(resQuery)
        }
    })
}

exports.dashboardCount = (req, res) => {
    var DesignersCount, DevelopersCount, TestersCount, ManagersCount;
    Employee.findAll({
        where: {
            department: "Desiginer"
        }, attributes: ['id']
    })
        .then(data => {
            DesignersCount = data.length;
        })

    Employee.findAll({
        where: {
            department: "Developer"
        }, attributes: ['id']
    })
        .then(data => {
            DevelopersCount = data.length;
        })

    Employee.findAll({
        where: {
            department: "Tester"
        }, attributes: ['id']
    })
        .then(data => {
            TestersCount = data.length;
        })

    Employee.findAll({
        where: {
            department: "Manager"
        }, attributes: ['id']
    })
        .then(data => {
            ManagersCount = data.length;
            res.status(200).send({
                'DesignersCount': DesignersCount,
                'DevelopersCount': DevelopersCount,
                'TestersCount': TestersCount,
                'ManagersCount': ManagersCount
            })
        })


}

const getPagination = (page, size) => {
    const limit = size ? +size : 1;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

