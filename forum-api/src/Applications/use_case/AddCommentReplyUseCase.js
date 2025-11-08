class AddCommentReplyUseCase {
  constructor({ threadRepository, commentRepository, commentReplyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentReplyRepository = commentReplyRepository;
  }

  async execute(useCasePayload) {
    const { content, userId, threadId, commentId } = useCasePayload;
    await this._threadRepository.checkThreadExist(threadId);
    await this._commentRepository.checkCommentExist(commentId);
    const addedReply = await this._commentReplyRepository.addReply({ content, userId, commentId });
    return addedReply;
  }
}

module.exports = AddCommentReplyUseCase;