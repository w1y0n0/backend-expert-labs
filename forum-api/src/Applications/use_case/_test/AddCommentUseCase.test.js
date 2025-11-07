const CommentRepository = require('../../../Domains/comments/CommentRepository');
const Comment = require('../../../Domains/comments/entities/Comment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  const useCasePayload = {
    content: 'A comment',
    userId: 'user-123',
    threadId: 'thread-123',
  };

  let mockThreadRepository;
  let mockCommentRepository;

  beforeEach(() => {
    mockThreadRepository = new ThreadRepository();
    mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkThreadExist = jest.fn();
    mockCommentRepository.addComment = jest.fn();
  });

  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const expectedComment = new Comment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
      threadId: useCasePayload.threadId,
      date: '2025-09-07T10:00:00.000Z',
    });

    mockThreadRepository.checkThreadExist.mockResolvedValue();
    mockCommentRepository.addComment.mockResolvedValue(expectedComment);

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

  it('should throw error when thread does not exist', async () => {
    // Arrange
    mockThreadRepository.checkThreadExist.mockRejectedValue(new Error('thread tidak ditemukan'));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await expect(addCommentUseCase.execute(useCasePayload))
      .rejects.toThrowError('thread tidak ditemukan');

    // Assert
    expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.checkThreadExist).toBeCalledTimes(1);

    expect(mockCommentRepository.addComment).not.toBeCalled();
  });

  it('should throw error when addComment fails', async () => {
    // Arrange
    mockThreadRepository.checkThreadExist.mockResolvedValue();
    mockCommentRepository.addComment.mockRejectedValue(new Error('gagal menambahkan komentar'));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await expect(addCommentUseCase.execute(useCasePayload))
      .rejects.toThrowError('gagal menambahkan komentar');

    // Assert
    expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.checkThreadExist).toBeCalledTimes(1);

    expect(mockCommentRepository.addComment).toBeCalledTimes(1);
  });
});