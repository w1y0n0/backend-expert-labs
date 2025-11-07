const mapCommentDbToModel = (comment) => ({
  id: comment.id,
  content: comment.content,
  owner: comment.owner,
  threadId: comment.thread_id,
  date: comment.date,
  isDelete: comment.is_delete,
});

module.exports = { mapCommentDbToModel };