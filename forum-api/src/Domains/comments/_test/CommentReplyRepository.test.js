const CommentReplyRepository = require('../CommentReplyRepository');

describe('CommentReplyRepository interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        // Arrange
        const commentReplyRepository = new CommentReplyRepository();

        // Action and Assert
        await expect(commentReplyRepository.addReply({})).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentReplyRepository.getRepliesByCommentId('')).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentReplyRepository.getReplies()).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentReplyRepository.checkReplyExist('')).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentReplyRepository.checkReplyOwnership('', '')).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentReplyRepository.deleteReply('', '')).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});