const DetailThread = require('../DetailThread');

describe('DetailThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      comments: [],
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type requirements', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2024-09-18T09:10:07.775Z',
      username: 123,
      comments: [],
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2024-09-18T09:10:07.775Z',
      username: 'username',
      comments: [],
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread).toBeInstanceOf(DetailThread);
    expect(detailThread).toStrictEqual(new DetailThread({
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2024-09-18T09:10:07.775Z',
      username: 'username',
      comments: [],
    }));
  });
});