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
});

module.exports = { mapCommentDbToModel, mapCommentModelToSummary };