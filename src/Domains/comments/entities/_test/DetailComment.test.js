const DetailComment = require('../DetailComment');

describe('DetailComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type requirements', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      content: 'comment',
      replies: 'replies',
      date: '2024-09-18T09:10:07.775Z',
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      content: 'comment',
      replies: [
        {
          id: 'replies-123',
          username: 'user-reply',
          content: 'reply',
          date: '2024-09-18T09:11:07.775Z',
        },
      ],
      date: '2024-09-18T09:10:07.775Z',
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.replies).toEqual(payload.replies);
    expect(detailComment.date).toEqual(payload.date);
  });

  it('should create deleted DetailComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      content: 'comment',
      replies: [
        {
          id: 'replies-123',
          username: 'user-reply',
          content: 'reply',
          date: '2024-09-18T09:11:07.775Z',
        },
      ],
      date: '2024-09-18T09:10:07.775Z',
      is_delete: true,
    };

    // Action
    const commentDetail = new DetailComment(payload);

    // Assert
    expect(commentDetail).toBeInstanceOf(DetailComment);
    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.content).toEqual('**komentar telah dihapus**');
    expect(commentDetail.replies).toEqual(payload.replies);
    expect(commentDetail.date).toEqual(payload.date);
  });
});