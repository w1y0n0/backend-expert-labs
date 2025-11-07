const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
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

  async getThreadByIdHandler(request, h) {
    const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);
    const { threadId } = request.params;

    const thread = await getThreadDetailUseCase.execute({
      threadId,
    });

    return h.response({
      status: 'success',
      data: {
        thread,
      },
    }).code(200);
  }
}

module.exports = ThreadHandler;