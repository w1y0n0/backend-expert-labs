const { mapCommentModelToSummary, mapCommentReplyModelToSummary } = require("../../Commons/utils/mapper");
const ThreadDetail = require("../../Domains/threads/entities/ThreadDetail");

class GetThreadDetailUseCase {
    constructor({ threadRepository, userRepository, commentRepository, commentReplyRepository }) {
        this._threadRepository = threadRepository;
        this._userRepository = userRepository;
        this._commentRepository = commentRepository;
        this._commentReplyRepository = commentReplyRepository;
    }

    async execute(useCasePayload) {
        const { threadId } = useCasePayload;
        await this._threadRepository.checkThreadExist(threadId);
        const thread = await this._threadRepository.getThreadById(threadId);
        const user = await this._userRepository.getUserById(thread.owner);
        const users = await this._userRepository.getUsers();
        const comments = await this._commentRepository.getCommentsByThreadId(threadId);
        const replies = await this._commentReplyRepository.getReplies()

        const mappedComments = comments
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(comment => ({
                ...comment,
                username: users.find(user => user.id === comment.owner).username,
                replies: replies
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .filter(reply => reply.commentId === comment.id)
                    .map(reply => ({
                        ...reply,
                        username: users.find(user => user.id === reply.owner).username,
                    }))
                    .map(mapCommentReplyModelToSummary)
            }))
            .map(mapCommentModelToSummary);

        const threadDetail = new ThreadDetail({
            id: thread.id,
            title: thread.title,
            body: thread.body,
            date: thread.date,
            username: user.username,
            comments: mappedComments,
        });
        return threadDetail;
    }
}

module.exports = GetThreadDetailUseCase;