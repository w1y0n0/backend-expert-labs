const { nanoid } = require('nanoid');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const Thread = require('../../../Domains/threads/entities/Thread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('ThreadRepositoryPostgres constructor', () => {
    it('should be instance of ThreadRepository', () => {
      const fakePool = {};
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(fakePool);

      expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
    });

    it('should set dependencies correctly when provided', () => {
      const fakePool = {};
      const fakeIdGenerator = jest.fn().mockReturnValue('123');
      const fakeDateGenerator = jest.fn().mockReturnValue('2025-01-01');

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        fakePool,
        fakeIdGenerator,
        fakeDateGenerator
      );

      expect(threadRepositoryPostgres._pool).toBe(fakePool);
      expect(threadRepositoryPostgres._idGenerator).toBe(fakeIdGenerator);
      expect(threadRepositoryPostgres._dateGenerator).toBe(fakeDateGenerator);
    });

    it('should set default dependencies when not provided', () => {
      const fakePool = {};
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(fakePool);

      // pastikan default idGenerator adalah nanoid
      expect(threadRepositoryPostgres._idGenerator).toBe(nanoid);

      // pastikan default dateGenerator adalah function yang return Date
      expect(threadRepositoryPostgres._dateGenerator).toBeInstanceOf(Function);
      expect(threadRepositoryPostgres._dateGenerator()).toBeInstanceOf(Date);
    });
  });

  describe('addThread function', () => {
    it('should persist thread and return thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });

      const payload = {
        title: 'A thread',
        body: 'A body',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(payload);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });

      const payload = {
        title: 'A thread',
        body: 'A body',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const fixedDateGenerator = () => new Date(Date.UTC(2025, 8, 7, 0, 0, 0));
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator, fixedDateGenerator);

      // Action
      const thread = await threadRepositoryPostgres.addThread(payload);

      // Assert
      expect(thread).toStrictEqual(new Thread({
        id: 'thread-123',
        title: 'A thread',
        body: 'A body',
        owner: 'user-123',
        date: new Date(Date.UTC(2025, 8, 7, 0, 0, 0)).toISOString(),
      }));
    });
  });

  describe('checkThreadExist function', () => {
    it('should throw error when no thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadRepositoryPostgres.checkThreadExist('thread-123'))
        .rejects
        .toThrowError('thread tidak ditemukan')
    });

    it('should not throw error when thread exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread({
        title: 'A thread',
        body: 'A body',
        owner: 'user-123',
      });

      // Action & Assert
      await expect(threadRepositoryPostgres.checkThreadExist('thread-123'))
        .resolves.not.toThrow();
    });
  });

  describe('getThreadById function', () => {
    it('should throw error when thread does not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects
        .toThrowError('thread tidak ditemukan')
    });

    it('should return thread when thread exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });

      const expectedThread = {
        id: 'thread-123',
        title: 'A title',
        body: 'A body',
        owner: 'user-123',
        date: '2025-09-07T10:00:00.000Z',
      }
      await ThreadsTableTestHelper.addThread(expectedThread);

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread).toStrictEqual(expectedThread);
    });
  });
});