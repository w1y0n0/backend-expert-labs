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

    async checkReplyExist(_replyId) {
        throw new Error('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async checkReplyOwnership(_replyId, _userId) {
        throw new Error('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteReply(_replyId, _userId) {
        throw new Error('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = CommentReplyRepository;