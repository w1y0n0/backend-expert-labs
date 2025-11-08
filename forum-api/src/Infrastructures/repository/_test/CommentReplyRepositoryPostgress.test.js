const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentReply = require('../../../Domains/comments/entities/CommentReply');
const pool = require('../../database/postgres/pool');
const CommentReplyRepositoryPostgress = require('../CommentReplyRepositoryPostgress');

describe('CommentReplyRepositoryPostgress', () => {
    afterEach(async () => {
        await CommentRepliesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addReply function', () => {
        it('should persist comment and return reply correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
            });
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123', title: 'A title', body: 'A body', owner: 'user-123'
            });
            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'A comment',
                owner: 'user-123',
                threadId: 'thread-123',
                date: '2025-09-07T10:00:00.000Z',
                isDelete: false,
            });

            const payload = {
                content: 'A reply',
                userId: 'user-123',
                commentId: 'comment-123'
            };

            const fakeIdGenerator = () => '123'; // stub!
            const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgress(pool, fakeIdGenerator);

            // Action
            await commentReplyRepositoryPostgres.addReply(payload);

            // Assert
            const reply = await CommentsTableTestHelper.findCommentById('comment-123');
            expect(reply).toHaveLength(1);
        });

        it('should return reply correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
            });
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123', title: 'A title', body: 'A body', owner: 'user-123'
            });
            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'A comment',
                owner: 'user-123',
                threadId: 'thread-123',
                date: '2025-09-07T10:00:00.000Z',
                isDelete: false,
            });

            const payload = {
                content: 'A reply',
                userId: 'user-123',
                commentId: 'comment-123'
            };

            const fakeIdGenerator = () => '123'; // stub!
            const fixedDate = new Date(Date.UTC(2025, 8, 7, 0, 0, 0));
            const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgress(pool, fakeIdGenerator, fixedDate);

            // Action
            const reply = await commentReplyRepositoryPostgres.addReply(payload);

            // Assert
            expect(reply).toStrictEqual(new CommentReply({
                id: 'reply-123',
                content: 'A reply',
                owner: 'user-123',
                commentId: 'comment-123',
                date: fixedDate.toISOString(),
            }));
        });
    });
});