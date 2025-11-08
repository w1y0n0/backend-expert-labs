const CommentReplyRepository = require('../../Domains/comments/CommentReplyRepository');
const { nanoid } = require('nanoid');
const CommentReply = require('../../Domains/comments/entities/CommentReply');
const { mapCommentReplyDbToModel } = require('../../Commons/utils/mapper');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentReplyRepositoryPostgres extends CommentReplyRepository {
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

    async getRepliesByCommentId(commentId) {
        const query = {
            text: 'SELECT * FROM comment_replies WHERE comment_id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);

        return result.rows.map(mapCommentReplyDbToModel);
    }

    async getReplies() {
        const query = { text: 'SELECT * FROM comment_replies' };

        const result = await this._pool.query(query);

        return result.rows.map(mapCommentReplyDbToModel);
    }

    async checkReplyExist(replyId) {
        const query = {
            text: 'SELECT id FROM comment_replies WHERE id = $1 AND is_delete = false',
            values: [replyId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('balasan tidak ditemukan');
        }
    }

    async checkReplyOwnership(replyId, userId) {
        const query = {
            text: 'SELECT id FROM comment_replies WHERE id = $1 AND owner = $2 AND is_delete = false',
            values: [replyId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new AuthorizationError('balasan ini bukan milik Anda');
        }
    }

    async deleteReply(replyId, userId) {
        const query = {
            text: 'UPDATE comment_replies SET is_delete = true WHERE id = $1 AND owner = $2',
            values: [replyId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('balasan ini tidak ditemukan');
        }
    }
}

module.exports = CommentReplyRepositoryPostgres;