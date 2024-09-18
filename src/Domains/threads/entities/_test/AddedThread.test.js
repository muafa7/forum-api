const AddedThread = require('../AddedThread');

describe('AddedThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: '123',
      title: 'Title Thread',
    };
    
    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type requirements', () => {
    // Arrange
    const payload = {
      id: '123',
      title: 'Title Thread',
      owner: 111,
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});