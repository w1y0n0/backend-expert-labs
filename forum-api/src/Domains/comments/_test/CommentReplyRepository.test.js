const CommentReplyRepository = require('../CommentReplyRepository');

describe('CommentReplyRepository interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        // Arrange
        const commentReplyRepository = new CommentReplyRepository();

        // Action and Assert
        await expect(commentReplyRepository.addReply({})).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});