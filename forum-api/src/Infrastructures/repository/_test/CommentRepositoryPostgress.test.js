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
        owner: 'user-123',
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
        owner: 'user-123',
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
});