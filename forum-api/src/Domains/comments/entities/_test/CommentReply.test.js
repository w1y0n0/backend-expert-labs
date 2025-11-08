const CommentReply = require('../CommentReply');

describe('a CommentReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'A reply',
            owner: 'user-123',
            commentId: 'comment-123',
            // date: '2025-09-07T10:00:00.000Z', /* missing date property */
        };

        // Action and Assert
        expect(() => new CommentReply(payload)).toThrowError('COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it.each([
        ['id', { id: 123 }],
        ['content', { content: 123 }],
        ['owner', { owner: 123 }],
        ['commentId', { commentId: 123 }],
        ['date', { date: 123 }],
    ])('should throw error when %s is not string', (property, wrongValue) => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'A reply',
            owner: 'user-123',
            commentId: 'comment-123',
            date: '2025-09-07T10:00:00.000Z',
            ...wrongValue, // Replace property with wrong value
        };

        // Action and Assert
        expect(() => new CommentReply(payload)).toThrowError('COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});