const CommentRepository = require('../../../Domains/comments/CommentRepository');
const Comment = require('../../../Domains/comments/entities/Comment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'A comment',
      userId: 'user-123',
      threadId: 'thread-123',
    };

    const expectedComment = new Comment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
      threadId: useCasePayload.threadId,
      date: '2025-09-07T10:00:00.000Z',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadExist = jest.fn()
      .mockResolvedValue();
    mockCommentRepository.addComment = jest.fn()
      .mockResolvedValue(expectedComment);

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const comment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(comment).toStrictEqual(expectedComment);

    expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.checkThreadExist).toBeCalledTimes(1);

    expect(mockCommentRepository.addComment).toBeCalledWith({
      content: useCasePayload.content,
      userId: useCasePayload.userId,
      threadId: useCasePayload.threadId,
    });
    expect(mockCommentRepository.addComment).toBeCalledTimes(1);
  });
});