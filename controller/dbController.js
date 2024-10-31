const db = require("../dao/db")
/**
 * exports.insertFeedBack = (value) => {
 *     const sql = `insert into comment_wall.feedbacks
 *                  set wall_id=?,
 *                      user_id=?,
 *                      type=?,
 *                      moment=?;`
 *     return query(sql, value)
 * }
 *
 * exports.insertComment = (value) => {
 *     const sql = `insert into comment_wall.comments
 *                  set wall_id=?,
 *                      user_id=?,
 *                      image_url=?,
 *                      comment=?,
 *                      name=?,
 *                      moment=?;`
 *     return query(sql, value)
 * }
 *
 * // ==========> 删除 <==========
 * // 删除墙，主表对应多条子表一并删除
 * exports.deleteWall = (id) => {
 *     const sql = `delete a,b,c
 *                  from comment_wall.walls a
 *                           left join comment_wall.feedbacks b on a.id = b.wall_id
 *                           left join comment_wall.comments c on a.id = c.wall_id
 *                  where a.id = ?;`
 *     return query(sql, [id])
 * }
 *
 * exports.deleteFeedback = (id) => {
 *     const sql = `delete
 *                  from comment_wall.feedbacks
 *                  where id = ?;`
 *     return query(query, [id])
 * }
 *
 * exports.deleteComment = (id) => {
 *     const sql = `delete
 *                  from comment_wall.comments
 *                  where id = ?;`
 *     return query(sql, [id])
 * }
 *
 *
 * // =========> 查询 <==========
 * // 分页查询墙
 * exports.findWallPage = (page, pageSize, type, label) => {
 *     let sql;
 *     const params = [type, (page - 1) * pageSize, pageSize];
 *     if (label === -1) {
 *         sql = `select *
 *                from comment_wall.walls
 *                where type = ?
 *                order by id desc
 *                limit ?, ?;`;
 *     } else {
 *         sql = `select *
 *                from comment_wall.walls
 *                where type = ?
 *                  and label = ?
 *                order by id desc
 *                limit ?, ?;`;
 *         params.splice(1, 0, label);
 *     }
 *     return query(sql, params)
 * }
 *
 * // 倒序分页查询评论
 * exports.findCommentPage = (page, pageSize, wallId) => {
 *     const sql = `select *
 *                  from comment_wall.comments
 *                  where wall_id = ?
 *                  order by id desc
 *                  limit ?, ?;`;
 *     return query(sql, [wallId, (page - 1) * pageSize, pageSize])
 * }
 *
 * // 查询墙的喜欢、举报、撕掉的个数
 * exports.feedbackCount = (wallId, type) => {
 *     const sql = `select count(*) as count
 *                  from comment_wall.feedbacks
 *                  where wall_id = ?
 *                    and type = ?;`;
 *     return query(sql, [wallId, type])
 * }
 *
 * // 查询评论总数
 * exports.commentCount = (wallId) => {
 *     const sql = `select count(*) as count
 *                  from comment_wall.comments
 *                  where wall_id = ?;`;
 *     return query(sql, [wallId])
 * }
 *
 * // 是否已经点赞过了
 * exports.thumbCount = (wallId, userId) => {
 *     const sql = `select count(*) as count
 *                  from comment_wall.feedbacks
 *                  where wall_id = ?
 *                    and user_id = ?
 *                    and type = 0;`;
 *     return query(sql, [wallId, userId])
 * }
 */


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
    await db.insertFeedback([
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
                result[i].thumb = await db.feedbackCount(result[i].id, 0)
                result[i].report = await db.feedbackCount(result[i].id, 1)
                result[i].revoke = await db.feedbackCount(result[i].id, 2)
                // 是否点赞
                result[i].isThumb = await db.thumbCount(result[i].id, data.userId)
                // 评论数
                result[i].commentCount = await db.commentCount(result[i].id)
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