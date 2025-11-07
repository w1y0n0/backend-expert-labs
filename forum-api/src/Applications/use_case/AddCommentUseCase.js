class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.checkThreadExist(useCasePayload);
    const addedComment = await this._commentRepository.addComment(useCasePayload);
    return addedComment;
  }
}

module.exports = AddCommentUseCase;