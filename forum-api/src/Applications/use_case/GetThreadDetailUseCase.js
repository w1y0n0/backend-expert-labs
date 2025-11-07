const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class GetThreadDetailUseCase {
  constructor({ threadRepository, userRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    await this._threadRepository.checkThreadExist(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const user = await this._userRepository.getUserById(thread.owner);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const threadDetail = new ThreadDetail({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: user.username,
      comments,
    });
    return threadDetail;
  }
}

module.exports = GetThreadDetailUseCase;