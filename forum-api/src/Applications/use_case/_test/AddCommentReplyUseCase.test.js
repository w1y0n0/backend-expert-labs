const CommentRepository = require("../../../Domains/comments/CommentRepository");
const CommentReplyRepository = require("../../../Domains/comments/CommentReplyRepository");
const CommentReply = require("../../../Domains/comments/entities/CommentReply");
const AddCommentReplyUseCase = require("../AddCommentReplyUseCase");

describe('AddCommentReplyUseCase', () => {
    const useCasePayload = {
        content: 'A comment',
        userId: 'user-123',
        commentId: 'thread-123',
    };

    let mockCommentRepository;
    let mockCommentReplyRepository;

    beforeEach(() => {
        mockCommentRepository = new CommentRepository();
        mockCommentReplyRepository = new CommentReplyRepository();

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

        mockCommentRepository.checkCommentExist.mockResolvedValue();
        mockCommentReplyRepository.addReply.mockResolvedValue(expectedReply);

        const addCommentReplyUseCase = new AddCommentReplyUseCase({
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository
        });

        // Action
        const reply = await addCommentReplyUseCase.execute(useCasePayload);

        // Assert
        expect(reply).toStrictEqual(expectedReply);

        expect(mockCommentRepository.checkCommentExist).toBeCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.checkCommentExist).toBeCalledTimes(1);

        expect(mockCommentReplyRepository.addReply).toBeCalledWith({
            content: useCasePayload.content,
            userId: useCasePayload.userId,
            commentId: useCasePayload.commentId,
        });
        expect(mockCommentReplyRepository.addReply).toBeCalledTimes(1);
    });

    it('should throw error when comment does not exist', async () => {
        // Arrange
        mockCommentRepository.checkCommentExist.mockRejectedValue(new Error('komentar tidak ditemukan'));

        const addCommentReplyUseCase = new AddCommentReplyUseCase({
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository
        });

        // Action
        await expect(addCommentReplyUseCase.execute(useCasePayload))
            .rejects.toThrowError('komentar tidak ditemukan');

        // Assert
        expect(mockCommentRepository.checkCommentExist).toBeCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.checkCommentExist).toBeCalledTimes(1);

        expect(mockCommentReplyRepository.addReply).not.toBeCalled();
    });

    it('should throw error when addReply fails', async () => {
        // Arrange
        mockCommentRepository.checkCommentExist.mockResolvedValue();
        mockCommentReplyRepository.addReply.mockRejectedValue(new Error('gagal menambahkan balasan komentar'));

        const addCommentReplyUseCase = new AddCommentReplyUseCase({
            commentRepository: mockCommentRepository,
            commentReplyRepository: mockCommentReplyRepository
        });

        // Action
        await expect(addCommentReplyUseCase.execute(useCasePayload))
            .rejects.toThrowError('gagal menambahkan balasan komentar');

        // Assert
        expect(mockCommentRepository.checkCommentExist).toBeCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.checkCommentExist).toBeCalledTimes(1);

        expect(mockCommentReplyRepository.addReply).toBeCalledTimes(1);
    });
});