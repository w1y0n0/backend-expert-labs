class AddCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { content } = useCasePayload;
    const addedComment = await this._commentRepository.addComment({ content });
    return addedComment;
  }
}

module.exports = AddCommentUseCase;