const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const CommentReplyRepository = require("../../../Domains/comments/CommentReplyRepository");
const UserRepository = require("../../../Domains/users/UserRepository");
const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");
const RegisteredUser = require("../../../Domains/users/entities/RegisteredUser");
const Comment = require("../../../Domains/comments/entities/Comment");
const CommentReply = require("../../../Domains/comments/entities/CommentReply");
const Thread = require("../../../Domains/threads/entities/Thread");
const { mapCommentModelToSummary, mapCommentReplyModelToSummary } = require("../../../Commons/utils/mapper");

describe('GetThreadDetailUseCase', () => {
    const useCasePayload = {
        threadId: 'thread-123',
    };

    let mockThreadRepository;
    let mockUserRepository;
    let mockCommentRepository;
    let mockCommentReplyRepository;

    beforeEach(() => {
        mockThreadRepository = new ThreadRepository();
        mockUserRepository = new UserRepository();
        mockCommentRepository = new CommentRepository();
        mockCommentReplyRepository = new CommentReplyRepository();

        mockThreadRepository.checkThreadExist = jest.fn();
        mockThreadRepository.getThreadById = jest.fn();
        mockUserRepository.getUserById = jest.fn();
        mockUserRepository.getUsers = jest.fn();
        mockCommentRepository.getCommentsByThreadId = jest.fn();
        mockCommentReplyRepository.getReplies = jest.fn();
    });

    // TODO: - Don't forget to add test for getReplies
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

        const expectedUsers = [expectedUser];

        const expectedComments = [
            new Comment({
                id: 'comment-123',
                content: 'A content',
                owner: 'user-123',
                threadId: 'thread-123',
                date: '2025-09-08T10:00:00.000Z',
            }),

            new Comment({
                id: 'comment-456',
                content: 'A content',
                owner: 'user-123',
                threadId: 'thread-123',
                date: '2025-09-12T10:00:00.000Z',
            }),
        ];

        const expectedReplies = [
            new CommentReply({
                id: 'reply-123',
                content: 'A reply',
                owner: 'user-123',
                commentId: 'comment-123',
                date: '2025-09-20T10:00:00.000Z',
            }),
            new CommentReply({
                id: 'reply-456',
                content: 'A reply',
                owner: 'user-123',
                commentId: 'comment-123',
                date: '2025-09-26T10:00:00.000Z',
            }),
        ]

        const mappedExpectedComments = expectedComments
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(comment => ({
                ...comment,
                username: expectedUsers.find(user => user.id === comment.owner).username,
                replies: expectedReplies
                    .filter(reply => reply.commentId === comment.id)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map(reply => ({
                        ...reply,
                        username: expectedUsers.find(user => user.id === reply.owner).username,
                    }))
                    .map(mapCommentReplyModelToSummary),
            }))
            .map(mapCommentModelToSummary);

        const expectedThreadDetail = new ThreadDetail({
            id: expectedThread.id,
            title: expectedThread.title,
            body: expectedThread.body,
            date: expectedThread.date,
            username: expectedUser.username,
            comments: mappedExpectedComments,
        });

        mockThreadRepository.checkThreadExist.mockResolvedValue();
        mockThreadRepository.getThreadById.mockResolvedValue(expectedThread);
        mockUserRepository.getUserById.mockResolvedValue(expectedUser);
        mockUserRepository.getUsers.mockResolvedValue(expectedUsers);
        mockCommentRepository.getCommentsByThreadId.mockResolvedValue(expectedComments);
        mockCommentReplyRepository.getReplies.mockResolvedValue(expectedReplies);

        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            userRepository: mockUserRepository,
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository,
        });

        // Action
        const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

        // Assert
        expect(threadDetail).toStrictEqual(expectedThreadDetail);

        expect(threadDetail.comments).toStrictEqual(mappedExpectedComments);

        expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.checkThreadExist).toBeCalledTimes(1);

        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.getThreadById).toBeCalledTimes(1);

        expect(mockUserRepository.getUserById).toBeCalledWith(expectedThread.owner);
        expect(mockUserRepository.getUserById).toBeCalledTimes(1);

        expect(mockUserRepository.getUsers).toBeCalledWith();
        expect(mockUserRepository.getUsers).toBeCalledTimes(1);

        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(expectedThread.id);
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledTimes(1);

        expect(mockCommentReplyRepository.getReplies).toBeCalledWith();
        expect(mockCommentReplyRepository.getReplies).toBeCalledTimes(1);
    });

    it('should throw error when thread does not exist', async () => {
        // Arrange
        mockThreadRepository.checkThreadExist.mockRejectedValue(new Error('thread tidak ditemukan'));

        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            userRepository: mockUserRepository,
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository,
        });

        // Act & Assert
        await expect(getThreadDetailUseCase.execute(useCasePayload))
            .rejects.toThrowError('thread tidak ditemukan');

        expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.checkThreadExist).toBeCalledTimes(1);

        expect(mockThreadRepository.getThreadById).not.toBeCalled();
        expect(mockUserRepository.getUserById).not.toBeCalled();
        expect(mockUserRepository.getUsers).not.toBeCalled();
        expect(mockCommentRepository.getCommentsByThreadId).not.toBeCalled();
        expect(mockCommentReplyRepository.getReplies).not.toBeCalled();
    });

    it('should throw error when getThreadById fails', async () => {
        // Arrange
        mockThreadRepository.checkThreadExist.mockResolvedValue();
        mockThreadRepository.getThreadById.mockRejectedValue(new Error('gagal mendapatkan detail thread'));

        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            userRepository: mockUserRepository,
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository,
        });

        // Act & Assert
        await expect(getThreadDetailUseCase.execute(useCasePayload))
            .rejects.toThrowError('gagal mendapatkan detail thread');

        expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.checkThreadExist).toBeCalledTimes(1);

        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.getThreadById).toBeCalledTimes(1);

        expect(mockUserRepository.getUserById).not.toBeCalled();
        expect(mockUserRepository.getUsers).not.toBeCalled();
        expect(mockCommentRepository.getCommentsByThreadId).not.toBeCalled();
        expect(mockCommentReplyRepository.getReplies).not.toBeCalled();
    });

    it('should throw error when getUserById fails', async () => {
        // Arrange
        const expectedThread = new Thread({
            id: 'thread-123',
            title: 'A title',
            body: 'A thread content',
            owner: 'user-123',
            date: '2025-09-07T10:00:00.000Z',
        });

        mockThreadRepository.checkThreadExist.mockResolvedValue();
        mockThreadRepository.getThreadById.mockResolvedValue(expectedThread);
        mockUserRepository.getUserById.mockRejectedValue(new Error('user tidak ditemukan'));

        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            userRepository: mockUserRepository,
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository,
        });

        // Act & Assert
        await expect(getThreadDetailUseCase.execute(useCasePayload))
            .rejects.toThrowError('user tidak ditemukan');

        expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.checkThreadExist).toBeCalledTimes(1);

        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.getThreadById).toBeCalledTimes(1);

        expect(mockUserRepository.getUserById).toBeCalledWith(expectedThread.owner);
        expect(mockUserRepository.getUserById).toBeCalledTimes(1);

        expect(mockUserRepository.getUsers).not.toBeCalled();
        expect(mockCommentRepository.getCommentsByThreadId).not.toBeCalled();
        expect(mockCommentReplyRepository.getReplies).not.toBeCalled();
    });

    it('should throw error when getUsers fails', async () => {
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

        mockThreadRepository.checkThreadExist.mockResolvedValue();
        mockThreadRepository.getThreadById.mockResolvedValue(expectedThread);
        mockUserRepository.getUserById.mockResolvedValue(expectedUser);
        mockUserRepository.getUsers.mockRejectedValue(new Error('gagal mendapatkan data pengguna'));

        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            userRepository: mockUserRepository,
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository,
        });

        // Act & Assert
        await expect(getThreadDetailUseCase.execute(useCasePayload))
            .rejects.toThrowError('gagal mendapatkan data pengguna');

        expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.checkThreadExist).toBeCalledTimes(1);

        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.getThreadById).toBeCalledTimes(1);

        expect(mockUserRepository.getUserById).toBeCalledWith(expectedThread.owner);
        expect(mockUserRepository.getUserById).toBeCalledTimes(1);

        expect(mockUserRepository.getUsers).toBeCalledWith();
        expect(mockUserRepository.getUsers).toBeCalledTimes(1);

        expect(mockCommentRepository.getCommentsByThreadId).not.toBeCalled();
        expect(mockCommentReplyRepository.getReplies).not.toBeCalled();
    });

    it('should throw error when getCommentsByThreadId fails', async () => {
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

        const expectedUsers = [expectedUser];

        mockThreadRepository.checkThreadExist.mockResolvedValue();
        mockThreadRepository.getThreadById.mockResolvedValue(expectedThread);
        mockUserRepository.getUserById.mockResolvedValue(expectedUser);
        mockUserRepository.getUsers.mockResolvedValue(expectedUsers);
        mockCommentRepository.getCommentsByThreadId.mockRejectedValue(new Error('gagal mendapatkan data komentar'));

        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            userRepository: mockUserRepository,
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository,
        });

        // Act & Assert
        await expect(getThreadDetailUseCase.execute(useCasePayload))
            .rejects.toThrowError('gagal mendapatkan data komentar');

        expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.checkThreadExist).toBeCalledTimes(1);

        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.getThreadById).toBeCalledTimes(1);

        expect(mockUserRepository.getUserById).toBeCalledWith(expectedThread.owner);
        expect(mockUserRepository.getUserById).toBeCalledTimes(1);

        expect(mockUserRepository.getUsers).toBeCalledWith();
        expect(mockUserRepository.getUsers).toBeCalledTimes(1);

        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(expectedThread.id);
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledTimes(1);

        expect(mockCommentReplyRepository.getReplies).not.toBeCalled();
    });
});