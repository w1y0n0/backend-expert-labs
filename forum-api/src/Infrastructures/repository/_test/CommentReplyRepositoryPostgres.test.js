const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentReply = require('../../../Domains/comments/entities/CommentReply');
const pool = require('../../database/postgres/pool');
const CommentReplyRepositoryPostgres = require('../CommentReplyRepositoryPostgres');

describe('CommentReplyRepositoryPostgres', () => {
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
            const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, fakeIdGenerator);

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
            const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, fakeIdGenerator, fixedDate);

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

    describe('getRepliesByCommentId function', () => {
        it('should return empty array on reply does not exist', async () => {
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

            const fakeIdGenerator = () => '123'; // stub!
            const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const replies = await commentReplyRepositoryPostgres.getRepliesByCommentId('comment-123');

            // Assert
            expect(replies).toStrictEqual([]);
        });

        it('should return array replies on reply exist', async () => {
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

            const expectedReply = {
                id: 'reply-123',
                content: 'A reply',
                owner: 'user-123',
                commentId: 'comment-123',
                date: '2025-09-13T10:00:00.000Z',
                isDelete: false,
            };
            CommentRepliesTableTestHelper.addReply(expectedReply)

            const fakeIdGenerator = () => '123'; // stub!
            const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const replies = await commentReplyRepositoryPostgres.getRepliesByCommentId('comment-123');

            // Assert
            expect(replies).toStrictEqual([expectedReply]);
        });
    });

    describe('getReplies function', () => {
        it('should return empty array on reply does not exist', async () => {
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

            const fakeIdGenerator = () => '123'; // stub!
            const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const replies = await commentReplyRepositoryPostgres.getReplies();

            // Assert
            expect(replies).toStrictEqual([]);
        });

        it('should return array replies on reply exist', async () => {
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

            const expectedReply = {
                id: 'reply-123',
                content: 'A reply',
                owner: 'user-123',
                commentId: 'comment-123',
                date: '2025-09-13T10:00:00.000Z',
                isDelete: false,
            };
            await CommentRepliesTableTestHelper.addReply(expectedReply)

            const fakeIdGenerator = () => '123'; // stub!
            const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const replies = await commentReplyRepositoryPostgres.getReplies();

            // Assert
            expect(replies).toStrictEqual([expectedReply]);
        });
    });
});