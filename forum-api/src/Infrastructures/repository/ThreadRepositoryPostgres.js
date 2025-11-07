const InvariantError = require('../../Commons/exceptions/InvariantError');
const Thread = require('../../Domains/threads/entities/Thread');
const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const { nanoid } = require('nanoid');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator = nanoid, date = new Date()) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._date = date;
  }

  async addThread({ title, body, owner }) {
    const id = `thread-${this._idGenerator()}`;
    const date = this._date.toISOString();

    const thread = new Thread({
      id,
      title,
      body,
      owner,
      date,
    });

    const query = {
      text: `
        INSERT INTO threads (id, title, body, owner, date) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING  id, title, body, owner, date
      `,
      values: [thread.id, thread.title, thread.body, thread.owner, thread.date],
    };

    const result = await this._pool.query(query);

    return new Thread(result.rows[0]);
  }

  async checkThreadExist({ threadId }) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('thread tidak tersedia');
    }
  }
}

module.exports = ThreadRepositoryPostgres;