const express = require("express")
const path = require("path")
// 解析html
const ejs = require("ejs");
const config = require("./config/default")

const app = express()

// 获取静态路径
app.use(express.static(__dirname + "/dist"))
app.use(express.static(__dirname + "/data"))

app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS")
    res.header("X-Powered-By", "yuzu/2.3.3")
    res.header("Content-Type", "application/json;charset=utf-8")
    if (req.method === "OPTIONS") {
        res.sendStatus(200)
    } else {
        next()
    }
})

app.engine("html", ejs.__express)
app.set("view engine", "html")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

require("./routes/index")(app)

app.listen(config.port, () => {
    console.log(`启动端口${config.port}`)
})