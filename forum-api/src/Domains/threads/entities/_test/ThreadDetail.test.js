const ThreadDetail = require('../ThreadDetail');

describe('a ThreadDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'A thread',
      body: 'A body',
      date: '2025-09-07T10:00:00.000Z',
      username: 'a_username',
      // comments: [], /* missing comments property */
    };

    // Action and Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it.each([
    ['id', { id: 123 }],
    ['title', { title: 123 }],
    ['body', { body: 123 }],
    ['date', { date: 123 }],
    ['username', { username: 123 }],
  ])('should throw error when %s is not string', (property, wrongValue) => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'A thread',
      body: 'A body',
      date: '2025-09-07T10:00:00.000Z',
      username: 'a_username',
      comments: [],
      ...wrongValue, // Replace property with wrong value
    };

    // Action and Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});