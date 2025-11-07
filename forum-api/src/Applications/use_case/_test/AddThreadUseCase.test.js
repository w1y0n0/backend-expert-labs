const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'A title',
      body: 'A body',
      owner: 'user-123',
    };

    const expectedThread = new Thread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
      date: '2025-09-07T10:00:00.000Z',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockResolvedValue(expectedThread);

    /** creating use case instance */
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
});