const db = require("../dao/db")

exports.insertWall = async (req, res) => {
    const data = req.body
    await db.insertWall([
        data.type,
        data.message,
        data.name,
        data.userId,
        data.moment,
        data.label,
        data.color,
        data.imageUrl])
        .then(result => {
            res.send({
                code: 200,
                message: result
            })
        })
}

exports.insertFeedback = async (req, res) => {
    const data = req.body
    await db.insertFeedBack([
        data.wallId,
        data.userId,
        data.type,
        data.moment
    ])
        .then(result => {
            res.send({
                code: 200,
                message: result
            })
        })
}

exports.insertComment = async (req, res) => {
    const data = req.body
    await db.insertComment([
        data.wallId,
        data.userId,
        data.imageUrl,
        data.comment,
        data.name,
        data.moment
    ])
        .then(result => {
            res.send({
                code: 200,
                message: result
            })
        })
}

exports.deleteWall = async (req, res) => {
    const data = req.body
    // 如果有图片，则删除
    if (data.imageUrl) {

    }
    await db.deleteWall(data.id)
        .then(result => {
            res.send({
                code: 200,
                message: result
            })
        })
}

exports.deleteFeedback = async (req, res) => {
    const data = req.body
    await db.deleteFeedback(data.id)
        .then(result => {
            res.send({
                code: 200,
                message: result
            })
        })
}

exports.deleteComment = async (req, res) => {
    const data = req.body
    await db.deleteComment(data.id)
        .then(result => {
            res.send({
                code: 200,
                message: result
            })
        })
}

exports.findWallPage = async (req, res) => {
    const data = req.body
    await db.findWallPage(data.page, data.pageSize, data.type, data.label)
        .then (async result => {
            for (let i = 0; i < result.length; i++) {
                result[i].thumb = (await db.feedbackCount(result[i].id, 0))[0].count
                result[i].report = (await db.feedbackCount(result[i].id, 1))[0].count
                result[i].revoke = (await db.feedbackCount(result[i].id, 2))[0].count
                // 是否点赞
                result[i].isThumb = (await db.thumbCount(result[i].id, data.userId))[0].count
                // 评论数
                result[i].commentCount = (await db.commentCount(result[i].id))[0].count
            }
            res.send({
                code: 200,
                message: result
            })
        })
}

exports.findCommentPage = async (req, res) => {
    const data = req.body
    await db.findCommentPage(data.page, data.pageSize, data.wallId)
        .then(result => {
            res.send({
                code: 200,
                message: result
            })
        })
}