const express = require("express")
const bodyParser = require("body-parser")
const Sequelize = require("sequelize")
const sequelize = require("./database");
const { Op } = require("sequelize")

const app = express();
app.use(bodyParser.json());
const port = 8080;

const cors = require("cors");
const { response } = require("express");
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }))

const Member = require("./tables/member")(sequelize, Sequelize);
const Ship = require("./tables/ship")(sequelize, Sequelize);

//relatia
Ship.hasMany(Member, { foreignKey: "id_ship" })

//routare pentru entitati
const router = express.Router();
app.use("/app", router);

//sync create tables alter on
app.get("/sync", async (req, res, next) => {
    try {
        await sequelize.sync({ alter: true });
        res.send("Database sync.");
    } catch (err) {
        next(err);
    }
})

//routes
router.route("/ships")
    .get(async (req, res, next) => {
        try {
            const { minDisplacement, sortBy } = req.query;
            //TODO:add one more
            //query param =  ?minDisplacement=1000 ce numar vrei tu, this shit is real cool
            // ?sortBy=numelecampului  => sortBy=name
            const ship = await Ship.findAll({
                where: minDisplacement ? { displacement: { [Op.gt]: minDisplacement } } : undefined,
                order: sortBy ? [[sortBy, "ASC"]] : undefined
            });
            if (ship) {
                res.status(200).json(ship);
            } else {
                res.status(404).json({ message: "No ship :(" })
            }
        } catch (err) {
            next(err)
        }
    })
    .post(async (req, res, next) => {
        try {
            if (req.body.name) {
                const ship = req.body;
                const newShip = await Ship.create(ship);
                if (newShip)
                    res.status(200).json({ message: `created ship: ${newShip}` })
                else {
                    res.status(400).json({ message: "bad request" })
                }
            } else {
                res.status(400).json({ message: "no body :(" })
            }
        } catch (err) {
            next(err)
        }
    })

router.route("/ships/:id")
    //get ship by id
    .get(async (req, res, next) => {
        try {
            const ship = await Ship.findByPk(req.params.id);
            if (ship) {
                res.status(200).json(ship);
            } else {
                res.status(404).json({ message: "No such ship" })
            }
        } catch (err) {
            next(err)
        }
    })
    //update ship by id
    .put(async (req, res, next) => {
        try {
            const ship = await Ship.findByPk(req.params.id);
            if (ship) {
                if (req.body.name) ship.name = req.body.name;
                if (req.body.displacement) ship.displacement = req.body.displacement;
                await ship.save();
                res.status(200).json({ message: `Updated to: ${ship}` })
            } else {
                res.status(404).json({ message: "No ship to update" })
            }
        } catch (err) {
            next(err)
        }
    })
    //delete ship by id
    .delete(async (req, res, next) => {
        try {
            const ship = await Ship.findByPk(req.params.id);
            if (ship) {
                await ship.destroy();
                res.status(200).json({ message: "Ship deleted." })
            } else {
                res.status(404).json({ message: "No ship to delete" })
            }
        } catch (err) {
            next(err);
        }
    })

router.route("/ships/:id/member")
    //get all astros from a ship
    .get(async (req, res, next) => {
        try {
            const ship = await Ship.findByPk(req.params.id, { include: [Member] });
            if (ship) {
                res.status(200).json(ship);
            } else {
                res.status(404).json({ message: "No such ship" })
            }
        } catch (err) {
            next(err)
        }
    })
    //add new member in a ship
    .post(async (req, res, next) => {
        try {
            const ship = await Ship.findByPk(req.params.id);
            if (ship) {
                const member = new Member(req.body);
                member.id_ship = ship.id;
                await member.save();
                res.status(200).json(member);
            } else {
                res.status(404).json({ message: "No such ship" })
            }
        } catch (err) {
            next(err)
        }
    })

router.route("/ships/:id/members/:id_member")
    //delete astro
    .delete(async (req, res, next) => {
        try {
            const ship = await Ship.findByPk(req.params.id);
            if (ship) {
                const member = await Member.findByPk(req.params.id_member)
                if (member) {
                    await member.destroy();
                    res.status(200).json({ message: "Deleted member crew." })
                } else {
                    res.status(404).json({ message: "Crewmember doesnt exist :(" })
                }
            } else {
                res.status(404).json({ message: "No such ship" })
            }
        } catch (err) {
            next(err);
        }
    })
    .put(async (req, res, next) => {
        //update role or name pe astro
        try {
            const ship = await Ship.findByPk(req.params.id);
            if (ship) {
                const member = await Member.findByPk(req.params.id_member)
                if (member) {
                    if (req.body.name) member.name = req.body.name;
                    if (req.body.role) member.role = req.body.role;
                    await member.save()
                    res.status(200).json({ message: `Updated to ->`, member })
                } else {
                    res.status(404).json({ message: "No such member to update" })
                }
            } else {
                res.status(404).json({ message: "No ship with such id" })
            }
        } catch (err) {
            next(err)
        }
    })
    //find just one member
    .get(async (req, res, next) => {
        try {
            const ship = await Ship.findByPk(req.params.id);
            if (ship) {
                const member = await Member.findByPk(req.params.id_member)
                if (member) {
                    res.status(200).json({ message: member })
                } else {
                    res.status(404).json({ message: "No such member in database." })
                }
            } else {
                res.status(404).json({ message: "No ship with such id" })
            }
        } catch (err) {
            next(err)
        }
    })

//export
app.get("/export", async (req, res, next) => {
    try {
        const result = [];
        for (let s of await Ship.findAll({
            include: Member
        })) {
            const ship = {
                id: s.id,
                name: s.name,
                displacement: s.displacement,
                members: []
            }
            for (let m of await s.getMembers()) {
                ship.members.push({
                    id_member: m.id,
                    name: m.name,
                    role: m.role
                })
            }
            result.push(ship);
        }
        if (result.length > 0) {
            res.status(200).json(result)
        } else {
            res.status(204).json({ message: "No data avaible" }) // 204= no content
        }
    } catch (err) {
        next(err);
    }
})

app.post("/import", async (req, res, next) => {
    try {
        //daca am ceva in body are sens sa fac import, if no 400 - bad req
        if (req.body.length) {
            const registry = {};
            for (let s of req.body) {
                const ship = await Ship.create(s) //l am luat din body
                for (let m of s.members) {
                    const member = await Member.create(m);
                    registry[m.key] = member;
                    ship.addMember(member);
                }
                await ship.save();
            }
            res.status(200).json({ message: "Imported data." })
        } else {
            res.status(400).json({ message: "No data sent." })
        }
    } catch (err) {
        next(err)
    }
})

//middleware
app.use((err, req, res, next) => {
    console.warn(err);
    res.status(400).json({ error: "error" })
})

//init
app.listen(port, async () => {
    console.log("server started.");
    try {
        await sequelize.authenticate();
        console.log("Connected to database");
    } catch (err) {
        console.log(err);
    }
})