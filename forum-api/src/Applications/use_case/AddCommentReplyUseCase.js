class AddCommentReplyUseCase {
    constructor({ commentRepository, commentReplyRepository }) {
        this._commentRepository = commentRepository;
        this._commentReplyRepository = commentReplyRepository;
    }

    async execute(useCasePayload) {
        const { content, userId, commentId } = useCasePayload;
        await this._commentRepository.checkCommentExist(commentId);
        const addedReply = await this._commentReplyRepository.addReply({ content, userId, commentId });
        return addedReply;
    }
}

module.exports = AddCommentReplyUseCase;