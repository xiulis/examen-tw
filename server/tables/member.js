const sequelize = require("../database")
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const Member = sequelize.define(
        "Member",
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
                        args: [5, 100]
                    }
                }
            },
            role: {
                type: Sequelize.ENUM(
                    {
                        values: ["CAPTAIN", "BOATSWAIN"]
                    })
            }
        },
        {
            createdAt: false,
            updatedAt: false
        }
    );
    return Member;
}