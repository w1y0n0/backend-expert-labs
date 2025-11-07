class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.checkThreadExist(useCasePayload);
    await this._commentRepository.checkCommentOwnership(useCasePayload);
    await this._commentRepository.deleteComment(useCasePayload);
  }
}

module.exports = DeleteCommentUseCase;