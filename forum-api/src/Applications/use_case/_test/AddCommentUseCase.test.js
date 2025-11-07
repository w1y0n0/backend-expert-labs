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
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const mockComment = new Comment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
      threadId: 'thread-123',
      date: '2025-09-07T10:00:00.000Z',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve('thread-123'));
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const comment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(comment).toStrictEqual(new Comment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
      threadId: 'thread-123',
      date: '2025-09-07T10:00:00.000Z',
    }));

    expect(mockThreadRepository.checkThreadExist).toBeCalledWith({
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId,
    });

    expect(mockCommentRepository.addComment).toBeCalledWith({
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId,
    });
  });
});