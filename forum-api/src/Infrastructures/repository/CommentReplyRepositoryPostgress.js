const CommentReplyRepository = require('../../Domains/comments/CommentReplyRepository');
const { nanoid } = require('nanoid');
const CommentReply = require('../../Domains/comments/entities/CommentReply');

class CommentReplyRepositoryPostgress extends CommentReplyRepository {
    constructor(pool, idGenerator = nanoid, date = new Date()) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
        this._date = date;
    }

    async addReply({ content, userId, commentId }) {
        const id = `reply-${this._idGenerator()}`;
        const date = this._date.toISOString();

        const reply = new CommentReply({
            id,
            content,
            owner: userId,
            commentId,
            date,
        });

        const query = {
            text: `
        INSERT INTO comment_replies (id, content, owner, comment_id, date) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING  id, content, owner, comment_id, date
      `,
            values: [reply.id, reply.content, reply.owner, reply.commentId, reply.date],
        };

        const result = await this._pool.query(query);

        return new CommentReply({
            id: result.rows[0].id,
            content: result.rows[0].content,
            owner: result.rows[0].owner,
            commentId: result.rows[0].comment_id,
            date: result.rows[0].date,
        });
    }
}

module.exports = CommentReplyRepositoryPostgress;