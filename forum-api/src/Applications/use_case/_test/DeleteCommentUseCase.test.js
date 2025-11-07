const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'A comment',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve('thread-123'));
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve('comment-123'));

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThreadExist).toBeCalledWith({
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId,
    });

    expect(mockCommentRepository.deleteComment).toBeCalledWith({
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId,
    });
  });
});