const InvariantError = require('../../Commons/exceptions/InvariantError');
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

  async addComment({ content, owner, threadId }) {
    const id = `comment-${this._idGenerator()}`;
    const date = this._date.toISOString();

    const comment = new Comment({
      id,
      content,
      owner,
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

  async deleteComment({ commentId, owner }) {
    const query = {
      text: 'DELETE FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('comment tidak tersedia');
    }
  }
}

module.exports = CommentRepositoryPostgress;