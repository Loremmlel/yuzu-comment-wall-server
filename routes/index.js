const dbController = require("../controller/dbController")
module.exports = function (app) {
    app.put("/wall", (req, res) => {
        dbController.insertWall(req, res)
    })
}