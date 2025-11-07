class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { userId, threadId, commentId } = useCasePayload;
    await this._threadRepository.checkThreadExist(threadId);
    await this._commentRepository.checkCommentExist(commentId);
    await this._commentRepository.checkCommentOwnership(commentId, userId);
    await this._commentRepository.deleteComment(commentId, userId);
  }
}

module.exports = DeleteCommentUseCase;