const dbController = require("../controller/dbController")
module.exports = function (app) {
    app.put("/wall", (req, res) => {
        dbController.insertWall(req, res)
    })
    app.put("/feedback", (req, res) => {
        dbController.insertFeedback(req, res)
    })
    app.put("/comment", (req, res) => {
        dbController.insertComment(req, res)
    })
    app.delete("/wall", (req, res) => {
        dbController.deleteWall(req, res)
    })
    app.delete("/feedback", (req, res) => {
        dbController.deleteFeedback(req, res)
    })
    app.delete("/comment", (req, res) => {
        dbController.deleteComment(req, res)
    })
    app.post("/wallPage", (req, res) => {
        dbController.findWallPage(req, res)
    })
    app.post("/commentPage", (req, res) => {
        dbController.findCommentPage(req, res)
    })
    app.get("/ip", (req, res) => {
        const ip = req.ip
        res.send({
            code: 200,
            ip: ip
        })
    })
}