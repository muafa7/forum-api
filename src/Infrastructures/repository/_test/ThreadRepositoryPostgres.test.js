const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  
  afterAll(async () => {
    await pool.end();
  });
    
  describe('checkThreadAvailability function', () => {
    it('should throw NotFoundError when thread not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.checkThreadAvailability('thread-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread available', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
  
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
  
      // Action & Assert
      await expect(threadRepositoryPostgres
        .checkThreadAvailability(threadId))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
  
  describe('addThread function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
    });

    it('should persist new thread', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'Thread Title',
        body: 'Thread Body',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread('user-123', addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'Thread Title',
        body: 'Thread Body',
      });
  
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
  
      // Action
      const addedThread = await threadRepositoryPostgres.addThread('user-123', addThread);
  
      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'Thread Title',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects.toThrowError(NotFoundError);
    });
  });

  it('should return thread correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const date = new Date().toISOString();

    await UsersTableTestHelper.addUser({ id: userId, username: 'username' });
    await ThreadsTableTestHelper.addThread({
      id: threadId,
      title: 'Thread Title',
      body: 'Thread Body',
      date,
      owner: userId,
    });

    const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

    // Action
    const thread = await threadRepositoryPostgres.getThreadById(threadId);

    // Assert
    expect(thread.id).toStrictEqual(threadId);
    expect(thread.title).toStrictEqual('Thread Title');
    expect(thread.body).toStrictEqual('Thread Body');
    expect(thread.date).toBeTruthy();
    expect(thread.username).toStrictEqual('username');
  });
});