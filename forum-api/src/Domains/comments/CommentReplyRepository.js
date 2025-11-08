class CommentReplyRepository {
    async addReply(_newReply) {
        throw new Error('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getRepliesByCommentId(_commentId) {
        throw new Error('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getReplies() {
        throw new Error('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = CommentReplyRepository;