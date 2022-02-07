const sequelize = require("../database")

module.exports=(sequelize, DataTypes) => {
    const Ship = sequelize.define(
        "Ship", 
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                validate: {
                    len: {
                        args: [3,100]
                    }
                }
            },
            displacement: {
                type: DataTypes.INTEGER,
                validate: {
                    min: 50
                }
               
            }
        },
        {
            createdAt: false,
            updatedAt: false
        }
    );
    return Ship;
}