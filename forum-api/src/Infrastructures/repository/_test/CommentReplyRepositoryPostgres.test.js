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
        it('should persist reply and return reply correctly', async () => {
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
            const fixedDateGenerator = () => new Date(Date.UTC(2025, 8, 7, 0, 0, 0));
            const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, fakeIdGenerator, fixedDateGenerator);

            // Action
            const reply = await commentReplyRepositoryPostgres.addReply(payload);

            // Assert
            expect(reply).toStrictEqual(new CommentReply({
                id: 'reply-123',
                content: 'A reply',
                owner: 'user-123',
                commentId: 'comment-123',
                date: new Date(Date.UTC(2025, 8, 7, 0, 0, 0)).toISOString(),
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
            await CommentRepliesTableTestHelper.addReply(expectedReply);

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

    describe('checkReplyExist function', () => {
        it('should throw error on reply does not exist', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
            });
            await UsersTableTestHelper.addUser({
                id: 'user-456', username: 'dicoding2', password: 'secret', fullname: 'Dicoding Indonesia 2',
            });
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123', title: 'A title', body: 'A body', owner: 'user-123'
            });

            const fakeIdGenerator = () => '123'; // stub!
            const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await expect(commentReplyRepositoryPostgres.checkReplyExist('reply-123'))
                .rejects
                .toThrowError('balasan tidak ditemukan');
        });
    });

    describe('checkReplyOwnership function', () => {
        it('should throw error when a non-owner tries to access the comment', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
            });
            await UsersTableTestHelper.addUser({
                id: 'user-456', username: 'dicoding2', password: 'secret', fullname: 'Dicoding Indonesia 2',
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
            await commentReplyRepositoryPostgres.addReply({
                content: 'A content',
                userId: 'user-123',
                commentId: 'comment-123'
            });

            // Assert
            await expect(commentReplyRepositoryPostgres.checkReplyOwnership('reply-123', 'user-456'))
                .rejects
                .toThrowError('balasan ini bukan milik Anda');
        });
    });

    describe('deleteReply function', () => {
        it('should not delete non existing reply', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
            });
            await UsersTableTestHelper.addUser({
                id: 'user-456', username: 'dicoding2', password: 'secret', fullname: 'Dicoding Indonesia 2',
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

            // Action & Assert
            await expect(commentReplyRepositoryPostgres.deleteReply('reply-123', 'user-123'))
                .rejects
                .toThrowError('balasan ini tidak ditemukan');
        });
    });
});