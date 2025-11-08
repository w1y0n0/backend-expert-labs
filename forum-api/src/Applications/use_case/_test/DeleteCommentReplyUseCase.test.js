const CommentRepository = require("../../../Domains/comments/CommentRepository");
const CommentReplyRepository = require("../../../Domains/comments/CommentReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const DeleteCommentReplyUseCase = require("../DeleteCommentReplyUseCase");

describe('DeleteCommentReplyUseCase', () => {
    const useCasePayload = {
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
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
        mockCommentReplyRepository.checkReplyExist = jest.fn();
        mockCommentReplyRepository.checkReplyOwnership = jest.fn();
        mockCommentReplyRepository.deleteReply = jest.fn();
    });

    it('should orchestrating the delete reply action correctly', async () => {
        // Arrange
        mockThreadRepository.checkThreadExist.mockResolvedValue();
        mockCommentRepository.checkCommentExist.mockResolvedValue();
        mockCommentReplyRepository.checkReplyExist.mockResolvedValue();
        mockCommentReplyRepository.checkReplyOwnership.mockResolvedValue();
        mockCommentReplyRepository.deleteReply.mockResolvedValue();

        const deleteCommentReplyUseCase = new DeleteCommentReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository,
        });

        // Action
        await deleteCommentReplyUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.checkCommentExist).toBeCalledWith(useCasePayload.commentId);
        expect(mockCommentReplyRepository.checkReplyExist).toBeCalledWith(useCasePayload.replyId);
        expect(mockCommentReplyRepository.checkReplyOwnership).toBeCalledWith(useCasePayload.replyId, useCasePayload.userId);
        expect(mockCommentReplyRepository.deleteReply).toBeCalledWith(useCasePayload.replyId, useCasePayload.userId);
    });

    it('should throw error when thread does not exist', async () => {
        // Arrange
        mockThreadRepository.checkThreadExist.mockRejectedValue(new Error('thread tidak ditemukan'));
        const deleteCommentReplyUseCase = new DeleteCommentReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository,
        });

        // Act & Assert
        await expect(deleteCommentReplyUseCase.execute(useCasePayload))
            .rejects.toThrowError('thread tidak ditemukan');
    });

    it('should throw error when comment does not exist', async () => {
        // Arrange
        mockThreadRepository.checkThreadExist.mockResolvedValue();
        mockCommentRepository.checkCommentExist.mockRejectedValue(new Error('komentar tidak ditemukan'));
        const deleteCommentReplyUseCase = new DeleteCommentReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository,
        });

        // Act & Assert
        await expect(deleteCommentReplyUseCase.execute(useCasePayload))
            .rejects.toThrowError('komentar tidak ditemukan');
    });

    it('should throw error when reply does not exist', async () => {
        // Arrange
        mockThreadRepository.checkThreadExist.mockResolvedValue();
        mockCommentRepository.checkCommentExist.mockResolvedValue();
        mockCommentReplyRepository.checkReplyExist.mockRejectedValue(new Error('balasan tidak ditemukan'));
        const deleteCommentReplyUseCase = new DeleteCommentReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository,
        });

        // Act & Assert
        await expect(deleteCommentReplyUseCase.execute(useCasePayload))
            .rejects.toThrowError('balasan tidak ditemukan');
    });

    it('should throw error when user is not the owner of the reply', async () => {
        // Arrange
        mockThreadRepository.checkThreadExist.mockResolvedValue();
        mockCommentRepository.checkCommentExist.mockResolvedValue();
        mockCommentReplyRepository.checkReplyExist.mockResolvedValue();
        mockCommentReplyRepository.checkReplyOwnership.mockRejectedValue(new Error('balasan ini bukan milik Anda'));
        const deleteCommentReplyUseCase = new DeleteCommentReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository,
        });

        // Act & Assert
        await expect(deleteCommentReplyUseCase.execute(useCasePayload))
            .rejects.toThrowError('balasan ini bukan milik Anda');
    });
});