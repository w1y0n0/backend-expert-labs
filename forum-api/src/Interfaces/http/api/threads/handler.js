const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: owner } = request.auth.credentials;

    const addedThread = await addThreadUseCase.execute({
      ...request.payload,
      owner
    });

    return h.response({
      status: 'success',
      data: {
        addedThread: {
          id: addedThread.id,
          title: addedThread.title,
          owner: addedThread.owner,
        },
      },
    }).code(201);
  }
}

module.exports = ThreadHandler;