const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const { mapCommentDbToModel } = require('../../Commons/utils/mapper');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const Comment = require('../../Domains/comments/entities/Comment');
const { nanoid } = require('nanoid');

class CommentRepositoryPostgress extends CommentRepository {
  constructor(pool, idGenerator = nanoid, date = new Date()) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._date = date;
  }

  async addComment({ content, userId, threadId }) {
    const id = `comment-${this._idGenerator()}`;
    const date = this._date.toISOString();

    const comment = new Comment({
      id,
      content,
      owner: userId,
      threadId,
      date,
    });

    const query = {
      text: `
        INSERT INTO comments (id, content, owner, thread_id, date) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING  id, content, owner, thread_id, date
      `,
      values: [comment.id, comment.content, comment.owner, comment.threadId, comment.date],
    };

    const result = await this._pool.query(query);

    return new Comment({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].owner,
      threadId: result.rows[0].thread_id,
      date: result.rows[0].date,
    });
  }

  async checkCommentExist(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND is_delete = false',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak tersedia');
    }
  }

  async checkCommentOwnership(commentId, userId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2 AND is_delete = false',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('comment bukan milik Anda');
    }
  }

  async deleteComment(commentId, userId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1 AND owner = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak tersedia');
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT * FROM comments WHERE thread_id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapCommentDbToModel);
  }
}

module.exports = CommentRepositoryPostgress;