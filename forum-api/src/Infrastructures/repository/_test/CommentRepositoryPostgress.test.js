const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const Comment = require('../../../Domains/comments/entities/Comment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgress = require('../CommentRepositoryPostgress');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist comment and return comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', title: 'A title', body: 'A body', owner: 'user-123'
      });

      const payload = {
        content: 'A content',
        userId: 'user-123',
        threadId: 'thread-123'
      };

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgress(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(payload);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', title: 'A title', body: 'A body', owner: 'user-123'
      });

      const payload = {
        content: 'A content',
        userId: 'user-123',
        threadId: 'thread-123'
      };

      const fakeIdGenerator = () => '123'; // stub!
      const fixedDate = new Date(Date.UTC(2025, 8, 7, 0, 0, 0));
      const commentRepositoryPostgres = new CommentRepositoryPostgress(pool, fakeIdGenerator, fixedDate);

      // Action
      const commment = await commentRepositoryPostgres.addComment(payload);

      // Assert
      expect(commment).toStrictEqual(new Comment({
        id: 'comment-123',
        content: 'A content',
        owner: 'user-123',
        threadId: 'thread-123',
        date: fixedDate.toISOString(),
      }));
    });
  });

  describe('checkCommentExist function', () => {
    it('should throw error on comment does not exist', async () => {
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
      const commentRepositoryPostgres = new CommentRepositoryPostgress(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.checkCommentExist('comment-123'))
        .rejects
        .toThrowError('comment tidak tersedia');
    });
  });

  describe('checkCommentOwnership function', () => {
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

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgress(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment({
        content: 'A content',
        userId: 'user-123',
        threadId: 'thread-123'
      });

      // Assert
      await expect(commentRepositoryPostgres.checkCommentOwnership('comment-123', 'user-456'))
        .rejects
        .toThrowError('comment bukan milik Anda');
    });
  });

  describe('deleteComment function', () => {
    it('should not delete non existing comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', title: 'A title', body: 'A body', owner: 'user-123'
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgress(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteComment('comment-123', 'user-123'))
        .rejects
        .toThrowError('comment tidak tersedia');
    });
  });
});