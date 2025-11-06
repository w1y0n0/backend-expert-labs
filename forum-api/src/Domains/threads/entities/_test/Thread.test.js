const Thread = require('../Thread');

describe('a Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'A thread',
      body: 'A body',
      owner: 'user-123',
      // date: '2025-09-07T10:00:00.000Z', /* missing date property */
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it.each([
    ['id', { id: 123 }],
    ['title', { title: 123 }],
    ['body', { body: 123 }],
    ['owner', { owner: 123 }],
    ['date', { date: 123 }],
  ])('should throw error when %s is not string', (property, wrongValue) => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'A thread',
      body: 'A body',
      owner: 'user-123',
      date: '2025-09-07T10:00:00.000Z',
      ...wrongValue, // Replace property with wrong value
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});