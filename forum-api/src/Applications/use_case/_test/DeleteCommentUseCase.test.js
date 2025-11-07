const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  const useCasePayload = {
    userId: 'user-123',
    threadId: 'thread-123',
    commentId: 'comment-123',
  };

  let mockThreadRepository;
  let mockCommentRepository;

  beforeEach(() => {
    mockThreadRepository = new ThreadRepository();
    mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkThreadExist = jest.fn();
    mockCommentRepository.checkCommentExist = jest.fn();
    mockCommentRepository.checkCommentOwnership = jest.fn();
    mockCommentRepository.deleteComment = jest.fn();
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    mockThreadRepository.checkThreadExist.mockResolvedValue();
    mockCommentRepository.checkCommentExist.mockResolvedValue();
    mockCommentRepository.checkCommentOwnership.mockResolvedValue();
    mockCommentRepository.deleteComment.mockResolvedValue();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkCommentExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.checkCommentOwnership).toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
  });

  it('should throw error when thread does not exist', async () => {
    // Arrange
    mockThreadRepository.checkThreadExist.mockRejectedValue(new Error('thread tidak ditemukan'));
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects.toThrowError('thread tidak ditemukan');
  });

  it('should throw error when comment does not exist', async () => {
    // Arrange
    mockThreadRepository.checkThreadExist.mockResolvedValue();
    mockCommentRepository.checkCommentExist.mockRejectedValue(new Error('komentar tidak ditemukan'));
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects.toThrowError('komentar tidak ditemukan');
  });

  it('should throw error when user is not the owner of the comment', async () => {
    // Arrange
    mockThreadRepository.checkThreadExist.mockResolvedValue();
    mockCommentRepository.checkCommentExist.mockResolvedValue();
    mockCommentRepository.checkCommentOwnership.mockRejectedValue(new Error('komentar ini bukan milik Anda'));
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects.toThrowError('komentar ini bukan milik Anda');
  });
});