const AddThreadUseCase = require('../AddThreadUseCase');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Thread Title',
      body: 'Thread Body',
    };
  
    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'Thread Title',
      owner: 'user-123',
    });

    // Creating dependency
    const mockThreadRepository = new ThreadRepository();

    // Mocking function
    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(mockAddedThread));

    // Creating instance
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute('user-123', useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: 'Thread Title',
      owner: 'user-123',
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith('user-123', new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});