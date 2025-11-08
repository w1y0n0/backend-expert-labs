class CommentReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.owner;
    this.commentId = payload.commentId;
    this.date = payload.date;
  }

  _verifyPayload(payload) {
    const { id, content, owner, commentId, date } = payload;

    if (!id || !content || !owner || !commentId || !date) {
      throw new Error('COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string'
            || typeof commentId !== 'string' || typeof date !== 'string') {
      throw new Error('COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentReply;