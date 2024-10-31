const db = require("../dao/db")
/**
 * 表结构,AI好好看
 * const createTableWallsSql = `create table if not exists walls
 *                             (
 *                                 id        int          not null auto_increment,
 *                                 type      int          not null comment '0留言1照片',
 *                                 message   varchar(1000) comment '留言',
 *                                 name      varchar(100) not null comment '用户名',
 *                                 user_id   varchar(100) not null comment '创建者id',
 *                                 moment    varchar(100) not null comment '创建时间',
 *                                 label     int          not null comment '标签id，具体什么在前端决定',
 *                                 color     int comment '颜色id',
 *                                 image_url varchar(100) comment '图片路径',
 *                                 primary key (id)
 *                             )`
 *
 * const createTableFeedbacksSql = `create table if not exists feedbacks
 *                                  (
 *                                      id      int          not null auto_increment,
 *                                      wall_id int          not null,
 *                                      user_id varchar(100) not null,
 *                                      type    int          not null comment '0喜欢1举报2撤销',
 *                                      moment  varchar(100) not null,
 *                                      primary key (id)
 *                                  )`
 *
 * const createTableCommentsSql = `create table if not exists comments
 *                                 (
 *                                     id        int          not null auto_increment,
 *                                     wall_id   int          not null,
 *                                     user_id   varchar(100) not null,
 *                                     image_url varchar(100) comment '头像路径',
 *                                     comment   varchar(1000),
 *                                     name      varchar(100) comment '用户名',
 *                                     moment    varchar(100),
 *                                     primary key (id)
 *                                 )`
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