const multer = require("multer")
const {randomInt} = require("node:crypto");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./data/photo")
    },
    filename(req, file, callback) {
        const type = file.originalname.replace(/.+\./, ".")
        callback(null,  Date.now() + randomInt(1, 100) + type)
    }
})

const upload = multer({storage: storage})

module.exports = function (app) {
    app.post("/photo", upload.single("file"), (req, res) => {
        const name = req.file.filename
        const imageUrl = "/photo/" + name
        res.send(imageUrl)
    })
}