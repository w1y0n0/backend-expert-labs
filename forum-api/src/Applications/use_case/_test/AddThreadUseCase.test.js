const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  const useCasePayload = {
    title: 'A title',
    body: 'A body',
    owner: 'user-123',
  };

  let mockThreadRepository = new ThreadRepository();

  beforeEach(() => {
    mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn();
  });

  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const expectedThread = new Thread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
      date: '2025-09-07T10:00:00.000Z',
    });

    mockThreadRepository.addThread.mockResolvedValue(expectedThread);

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const thread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(thread).toStrictEqual(expectedThread);

    expect(mockThreadRepository.addThread).toBeCalledWith({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    });
    expect(mockThreadRepository.addThread).toBeCalledTimes(1);
  });

  it('should throw error when addThread fails', async () => {
    // Arrange
    mockThreadRepository.addThread.mockRejectedValue(new Error('gagal menambahkan thread'));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Act & Assert
    await expect(addThreadUseCase.execute(useCasePayload))
      .rejects.toThrowError('gagal menambahkan thread');

    expect(mockThreadRepository.addThread).toBeCalledWith({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    });
    expect(mockThreadRepository.addThread).toBeCalledTimes(1);
  });
});