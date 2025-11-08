const CommentRepository = require("../../../Domains/comments/CommentRepository");
const CommentReplyRepository = require("../../../Domains/comments/CommentReplyRepository");
const CommentReply = require("../../../Domains/comments/entities/CommentReply");
const AddCommentReplyUseCase = require("../AddCommentReplyUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe('AddCommentReplyUseCase', () => {
    const useCasePayload = {
        content: 'A comment',
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
    };

    let mockThreadRepository;
    let mockCommentRepository;
    let mockCommentReplyRepository;

    beforeEach(() => {
        mockThreadRepository = new ThreadRepository();
        mockCommentRepository = new CommentRepository();
        mockCommentReplyRepository = new CommentReplyRepository();

        mockThreadRepository.checkThreadExist = jest.fn();
        mockCommentRepository.checkCommentExist = jest.fn();
        mockCommentReplyRepository.addReply = jest.fn();
    });

    it('should orchestrating the add comment reply action correctly', async () => {
        // Arrange
        const expectedReply = new CommentReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: useCasePayload.userId,
            commentId: useCasePayload.commentId,
            date: '2025-09-07T10:00:00.000Z',
        });

        mockThreadRepository.checkThreadExist.mockResolvedValue();
        mockCommentRepository.checkCommentExist.mockResolvedValue();
        mockCommentReplyRepository.addReply.mockResolvedValue(expectedReply);

        const addCommentReplyUseCase = new AddCommentReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository
        });

        // Action
        const reply = await addCommentReplyUseCase.execute(useCasePayload);

        // Assert
        expect(reply).toStrictEqual(expectedReply);

        expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.checkThreadExist).toBeCalledTimes(1);

        expect(mockCommentRepository.checkCommentExist).toBeCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.checkCommentExist).toBeCalledTimes(1);

        expect(mockCommentReplyRepository.addReply).toBeCalledWith({
            content: useCasePayload.content,
            userId: useCasePayload.userId,
            commentId: useCasePayload.commentId,
        });
        expect(mockCommentReplyRepository.addReply).toBeCalledTimes(1);
    });

    it('should throw error when thread does not exist', async () => {
        // Arrange
        mockThreadRepository.checkThreadExist.mockRejectedValue(new Error('thread tidak ditemukan'));

        const addCommentReplyUseCase = new AddCommentReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository
        });

        // Action
        await expect(addCommentReplyUseCase.execute(useCasePayload))
            .rejects.toThrowError('thread tidak ditemukan');

        // Assert
        expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.checkThreadExist).toBeCalledTimes(1);

        expect(mockCommentRepository.checkCommentExist).not.toBeCalled();
        expect(mockCommentReplyRepository.addReply).not.toBeCalled();
    });

    it('should throw error when comment does not exist', async () => {
        // Arrange
        mockThreadRepository.checkThreadExist.mockResolvedValue();
        mockCommentRepository.checkCommentExist.mockRejectedValue(new Error('komentar tidak ditemukan'));

        const addCommentReplyUseCase = new AddCommentReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository
        });

        // Action
        await expect(addCommentReplyUseCase.execute(useCasePayload))
            .rejects.toThrowError('komentar tidak ditemukan');

        // Assert
        expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.checkThreadExist).toBeCalledTimes(1);

        expect(mockCommentRepository.checkCommentExist).toBeCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.checkCommentExist).toBeCalledTimes(1);

        expect(mockCommentReplyRepository.addReply).not.toBeCalled();
    });

    it('should throw error when addReply fails', async () => {
        // Arrange
        mockThreadRepository.checkThreadExist.mockResolvedValue();
        mockCommentRepository.checkCommentExist.mockResolvedValue();
        mockCommentReplyRepository.addReply.mockRejectedValue(new Error('gagal menambahkan balasan komentar'));

        const addCommentReplyUseCase = new AddCommentReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository
        });

        // Action
        await expect(addCommentReplyUseCase.execute(useCasePayload))
            .rejects.toThrowError('gagal menambahkan balasan komentar');

        // Assert
        expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.checkThreadExist).toBeCalledTimes(1);

        expect(mockCommentRepository.checkCommentExist).toBeCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.checkCommentExist).toBeCalledTimes(1);

        expect(mockCommentReplyRepository.addReply).toBeCalledWith({
            content: useCasePayload.content,
            userId: useCasePayload.userId,
            commentId: useCasePayload.commentId,
        });
        expect(mockCommentReplyRepository.addReply).toBeCalledTimes(1);
    });
});