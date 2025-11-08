const mapCommentDbToModel = (comment) => ({
    id: comment.id,
    content: comment.content,
    owner: comment.owner,
    threadId: comment.thread_id,
    date: comment.date,
    isDelete: comment.is_delete,
});

const mapCommentModelToSummary = (comment) => ({
    id: comment.id,
    username: comment.username,
    date: comment.date,
    content: !comment.isDelete ? comment.content : '**komentar telah dihapus**',
    replies: comment.replies,
});

const mapCommentReplyDbToModel = (reply) => ({
    id: reply.id,
    content: reply.content,
    owner: reply.owner,
    commentId: reply.comment_id,
    date: reply.date,
    isDelete: reply.is_delete,
});

const mapCommentReplyModelToSummary = (reply) => ({
    id: reply.id,
    content: reply.isDelete ? reply.content : '**balasan telah dihapus**',
    date: reply.date,
    username: reply.username,
});

module.exports = { mapCommentDbToModel, mapCommentModelToSummary, mapCommentReplyDbToModel, mapCommentReplyModelToSummary };