class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { content, userId, threadId } = useCasePayload;
    await this._threadRepository.checkThreadExist(threadId);
    const addedComment = await this._commentRepository.addComment({ content, userId, threadId });
    return addedComment;
  }
}

module.exports = AddCommentUseCase;