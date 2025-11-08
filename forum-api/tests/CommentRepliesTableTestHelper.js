/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentRepliesTableTestHelper = {
    async addReply({
        id = 'reply-123', content = 'A reply', owner = 'user-123', commentId = 'comment-123', date = '2025-09-07T10:00:00.000Z', isDelete = false,
    }) {
        const query = {
            text: 'INSERT INTO comment_replies (id, content, owner, comment_id, date, is_delete) VALUES($1, $2, $3, $4, $5, $6)',
            values: [id, content, owner, commentId, date, isDelete],
        };

        await pool.query(query);
    },

    async findCommentReplyById(id) {
        const query = {
            text: 'SELECT * FROM comment_replies WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM comment_replies WHERE 1=1');
    },
};

module.exports = CommentRepliesTableTestHelper;