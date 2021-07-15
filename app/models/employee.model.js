module.exports = (sequelize, Sequelize) => {
    const employee = sequelize.define("employee", {
        fullName: {
            type: Sequelize.STRING
        },
        jobTitle: {
            type: Sequelize.STRING
        },
        department: {
            type: Sequelize.STRING
        },
        location: {
            type: Sequelize.STRING
        },
        age: {
            type: Sequelize.INTEGER
        },
        Salary: {
            type: Sequelize.INTEGER
        }
    });
    return employee;
};