class DeleteCommentReplyUseCase {
  constructor({ threadRepository, commentRepository, commentReplyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentReplyRepository = commentReplyRepository;
  }

  async execute(useCasePayload) {
    const { userId, threadId, commentId, replyId } = useCasePayload;
    await this._threadRepository.checkThreadExist(threadId);
    await this._commentRepository.checkCommentExist(commentId);
    await this._commentReplyRepository.checkReplyExist(replyId);
    await this._commentReplyRepository.checkReplyOwnership(replyId, userId);
    await this._commentReplyRepository.deleteReply(replyId, userId);
  }
}

module.exports = DeleteCommentReplyUseCase;