class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.owner;
    this.threadId = payload.threadId;
    this.date = payload.date;
  }

  _verifyPayload(payload) {
    const { id, content, owner, threadId, date } = payload;

    if (!id || !content || !owner || !threadId || !date) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string'
            || typeof threadId !== 'string' || typeof date !== 'string') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;