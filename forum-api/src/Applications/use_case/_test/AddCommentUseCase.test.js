const CommentRepository = require('../../../Domains/comments/CommentRepository');
const Comment = require('../../../Domains/comments/entities/Comment');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'A comment',
    };

    const mockComment = new Comment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
      threadId: 'thread-123',
      date: '2025-09-07T10:00:00.000Z',
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
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

    expect(mockCommentRepository.addComment).toBeCalledWith({
      content: useCasePayload.content,
    });
  });
});