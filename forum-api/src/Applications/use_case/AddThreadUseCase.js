class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { title, body, owner } = useCasePayload;
    const addedThread = await this._threadRepository.addThread({ title, body, owner });
    return addedThread;
  }
}

module.exports = AddThreadUseCase;