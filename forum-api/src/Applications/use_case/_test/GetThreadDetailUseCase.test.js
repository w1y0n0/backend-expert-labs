const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const Comment = require('../../../Domains/comments/entities/Comment');
const Thread = require('../../../Domains/threads/entities/Thread');

describe('GetThreadDetailUseCase', () => {
  const useCasePayload = {
    threadId: 'thread-123',
  };

  let mockThreadRepository;
  let mockUserRepository;
  let mockCommentRepository;

  beforeEach(() => {
    mockThreadRepository = new ThreadRepository();
    mockUserRepository = new UserRepository();
    mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkThreadExist = jest.fn();
    mockThreadRepository.getThreadById = jest.fn();
    mockUserRepository.getUserById = jest.fn();
    mockCommentRepository.getCommentsByThreadId = jest.fn();
  });

  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const expectedThread = new Thread({
      id: 'thread-123',
      title: 'A title',
      body: 'A thread content',
      owner: 'user-123',
      date: '2025-09-07T10:00:00.000Z',
    });

    const expectedUser = new RegisteredUser({
      id: 'user-123',
      username: 'user123',
      fullname: 'User 123',
    });

    const expectedComments = [
      new Comment({
        id: 'comment-123',
        content: 'A content',
        owner: 'user-123',
        threadId: 'thread-123',
        date: '2025-09-07T10:00:00.000Z',
      }),
    ];

    const expectedThreadDetail = new ThreadDetail({
      id: expectedThread.id,
      title: expectedThread.title,
      body: expectedThread.body,
      date: expectedThread.date,
      username: expectedUser.username,
      comments: expectedComments,
    });

    mockThreadRepository.checkThreadExist.mockResolvedValue();
    mockThreadRepository.getThreadById.mockResolvedValue(expectedThread);
    mockUserRepository.getUserById.mockResolvedValue(expectedUser);
    mockCommentRepository.getCommentsByThreadId.mockResolvedValue(expectedComments);

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);

    expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.checkThreadExist).toBeCalledTimes(1);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledTimes(1);

    expect(mockUserRepository.getUserById).toBeCalledWith(expectedThread.owner);
    expect(mockUserRepository.getUserById).toBeCalledTimes(1);

    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(expectedThread.id);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledTimes(1);
  });
});