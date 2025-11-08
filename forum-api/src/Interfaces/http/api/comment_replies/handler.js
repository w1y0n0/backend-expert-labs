const AddCommentReplyUseCase = require("../../../../Applications/use_case/AddCommentReplyUseCase");

class CommentRepliesHandler {
    constructor(container) {
        this._container = container;

        this.postCommentReplyHandler = this.postCommentReplyHandler.bind(this);
    }

    async postCommentReplyHandler(request, h) {
        const addCommentReplyUseCase = this._container.getInstance(AddCommentReplyUseCase.name);
        const { id: userId } = request.auth.credentials;
        const { content } = request.payload;
        const { threadId, commentId } = request.params;

        const addedReply = await addCommentReplyUseCase.execute({
            userId,
            content,
            threadId,
            commentId,
        });

        return h.response({
            status: 'success',
            data: {
                addedReply: {
                    id: addedReply.id,
                    content: addedReply.content,
                    owner: addedReply.owner,
                },
            },
        }).code(201);
    }
}

module.exports = CommentRepliesHandler;