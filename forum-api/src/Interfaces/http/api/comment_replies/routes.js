const routes = (handler) => [
    {
        method: 'POST',
        path: '/threads/{threadId}/comments/{commentId}/replies',
        handler: handler.postCommentReplyHandler,
        options: {
            auth: 'forum_jwt',
        },
    },
];

module.exports = routes;