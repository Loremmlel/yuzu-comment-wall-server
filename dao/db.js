const mysql = require("mysql2")
const config = require("../config/default")

const db = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password
})

const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.schema
})

const bdbs = (sql, values) => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

const query = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}

// 创建数据库
const createCommentWallSql = `create database if not exists comment_wall default charset utf8 collate utf8_general_ci`
const createCommentWall = (sql) => {
    return bdbs(sql, [])
}

// 创建数据表
// 留言/照片
const createTableWallsSql = `create table if not exists walls
                             (
                                 id        int          not null auto_increment,
                                 type      int          not null comment '0留言1照片',
                                 message   varchar(1000) comment '留言',
                                 name      varchar(100) not null comment '用户名',
                                 user_id   varchar(100) not null comment '创建者id',
                                 moment    varchar(100) not null comment '创建时间',
                                 label     int          not null comment '标签id，具体什么在前端决定',
                                 color     int comment '颜色id',
                                 image_url varchar(100) comment '图片路径',
                                 primary key (id)
                             )`

const createTableFeedbacksSql = `create table if not exists feedbacks
                                 (
                                     id      int          not null auto_increment,
                                     wall_id int          not null,
                                     user_id varchar(100) not null,
                                     type    int          not null comment '0喜欢1举报2撤销',
                                     moment  varchar(100) not null,
                                     primary key (id)
                                 )`

const createTableCommentsSql = `create table if not exists comments
                                (
                                    id        int          not null auto_increment,
                                    wall_id   int          not null,
                                    user_id   varchar(100) not null,
                                    image_url varchar(100) comment '头像路径',
                                    comment   varchar(1000),
                                    name      varchar(100) comment '用户名',
                                    moment    varchar(100),
                                    primary key (id)
                                )`

const createTable = (sql) => {
    return query(sql, [])
}

async function create() {
    await createCommentWall(createCommentWallSql)
    await createTable(createTableWallsSql)
    await createTable(createTableFeedbacksSql)
    await createTable(createTableCommentsSql)
}

// ==========> 新增 <==========
exports.insertWall = (value) => {
    const sql = `insert into comment_wall.walls
                 set type=?,
                     message=?,
                     name=?,
                     user_id=?,
                     moment=?,
                     label=?,
                     color=?,
                     image_url=?;`
    return query(sql, value)
}

exports.insertFeedBack = (value) => {
    const sql = `insert into comment_wall.feedbacks
                 set wall_id=?,
                     user_id=?,
                     type=?,
                     moment=?;`
    return query(sql, value)
}

exports.insertComment = (value) => {
    const sql = `insert into comment_wall.comments
                 set wall_id=?,
                     user_id=?,
                     image_url=?,
                     comment=?,
                     name=?,
                     moment=?;`
    return query(sql, value)
}

// ==========> 删除 <==========
// 删除墙，主表对应多条子表一并删除
exports.deleteWall = (id) => {
    const sql = `delete a,b,c
                 from comment_wall.walls a
                          left join comment_wall.feedbacks b on a.id = b.wall_id
                          left join comment_wall.comments c on a.id = c.wall_id
                 where a.id = ?;`
    return query(sql, [id])
}

exports.deleteFeedback = (id) => {
    const sql = `delete
                 from comment_wall.feedbacks
                 where id = ?;`
    return query(query, [id])
}

exports.deleteComment = (id) => {
    const sql = `delete
                 from comment_wall.comments
                 where id = ?;`
    return query(sql, [id])
}


// =========> 查询 <==========
// 分页查询墙
exports.findWallPage = (page, pageSize, type, label) => {
    let sql;
    const params = [type, (page - 1) * pageSize, pageSize];
    if (label === -1) {
        sql = `select id, type, message, name, user_id as userId, moment, label, color, image_url as imageUrl
               from comment_wall.walls
               where type = ?
               order by id desc
               limit ?, ?;`;
    } else {
        sql = `select id, type, message, name, user_id as userId, moment, label, color, image_url as imageUrl
               from comment_wall.walls
               where type = ?
                 and label = ?
               order by id desc
               limit ?, ?;`;
        params.splice(1, 0, label);
    }
    return query(sql, params)
}

// 倒序分页查询评论
exports.findCommentPage = (page, pageSize, wallId) => {
    const sql = `select id, wall_id as wallId, user_id as userId, image_url as imageUrl, comment, name, moment
                 from comment_wall.comments
                 where wall_id = ?
                 order by id desc
                 limit ?, ?;`;
    return query(sql, [wallId, (page - 1) * pageSize, pageSize])
}

// 查询墙的喜欢、举报、撕掉的个数
exports.feedbackCount = (wallId, type) => {
    const sql = `select count(*) as count
                 from comment_wall.feedbacks
                 where wall_id = ?
                   and type = ?;`;
    return query(sql, [wallId, type])
}

// 查询评论总数
exports.commentCount = (wallId) => {
    const sql = `select count(*) as count
                 from comment_wall.comments
                 where wall_id = ?;`;
    return query(sql, [wallId])
}

// 是否已经点赞过了
exports.thumbCount = (wallId, userId) => {
    const sql = `select count(*) as count
                 from comment_wall.feedbacks
                 where wall_id = ?
                   and user_id = ?
                   and type = 0;`;
    return query(sql, [wallId, userId])
}
