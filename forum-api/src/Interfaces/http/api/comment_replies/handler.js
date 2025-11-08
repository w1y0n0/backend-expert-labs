const AddCommentReplyUseCase = require("../../../../Applications/use_case/AddCommentReplyUseCase");
const DeleteCommentReplyUseCase = require("../../../../Applications/use_case/DeleteCommentReplyUseCase");

class CommentRepliesHandler {
    constructor(container) {
        this._container = container;

        this.postCommentReplyHandler = this.postCommentReplyHandler.bind(this);
        this.deleteCommentReplyHandler = this.deleteCommentReplyHandler.bind(this);
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

    async deleteCommentReplyHandler(request, h) {
        const deleteCommentReplyUseCase = this._container.getInstance(DeleteCommentReplyUseCase.name);
        const { id: userId } = request.auth.credentials;
        const { threadId, commentId, replyId } = request.params;

        await deleteCommentReplyUseCase.execute({
            userId,
            threadId,
            commentId,
            replyId,
        });

        return h.response({
            status: 'success',
        }).code(200);
    }
}

module.exports = CommentRepliesHandler;