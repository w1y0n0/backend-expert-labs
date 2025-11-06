const Comment = require('../Comment');

describe('a Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'A comment',
      owner: 'user-123',
      threadId: 'thread-123',
      // date: '2025-09-07T10:00:00.000Z', /* missing date property */
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it.each([
    ['id', { id: 123 }],
    ['content', { content: 123 }],
    ['owner', { owner: 123 }],
    ['threadId', { threadId: 123 }],
    ['date', { date: 123 }],
  ])('should throw error when %s is not string', (property, wrongValue) => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'A comment',
      owner: 'user-123',
      threadId: 'thread-123',
      date: '2025-09-07T10:00:00.000Z',
      ...wrongValue, // Replace property with wrong value
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});