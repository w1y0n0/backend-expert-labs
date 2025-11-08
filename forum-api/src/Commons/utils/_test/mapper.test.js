/* eslint-disable camelcase */

const {
  mapCommentDbToModel,
  mapCommentModelToSummary,
  mapCommentReplyDbToModel,
  mapCommentReplyModelToSummary,
} = require('../mapper');

describe('comment mapper', () => {
  describe('mapCommentDbToModel', () => {
    it('should map db record to comment model correctly', () => {
      const dbRow = {
        id: 'comment-123',
        content: 'a comment',
        owner: 'user-123',
        thread_id: 'thread-456',
        date: '2025-09-11T00:00:00.000Z',
        is_delete: false,
      };

      const result = mapCommentDbToModel(dbRow);

      expect(result).toEqual({
        id: 'comment-123',
        content: 'a comment',
        owner: 'user-123',
        threadId: 'thread-456',
        date: '2025-09-11T00:00:00.000Z',
        isDelete: false,
      });
    });
  });

  describe('mapCommentModelToSummary', () => {
    it('should keep content when isDelete is false', () => {
      const model = {
        id: 'comment-123',
        username: 'nazaralwi',
        content: 'a comment',
        date: '2025-09-11T00:00:00.000Z',
        isDelete: false,
        replies: [],
      };

      const result = mapCommentModelToSummary(model);

      expect(result).toEqual({
        id: 'comment-123',
        username: 'nazaralwi',
        content: 'a comment',
        date: '2025-09-11T00:00:00.000Z',
        replies: [],
      });
    });

    it('should replace content when isDelete is true', () => {
      const model = {
        id: 'comment-123',
        username: 'nazaralwi',
        content: 'a comment',
        date: '2025-09-11T00:00:00.000Z',
        isDelete: true,
        replies: [],
      };

      const result = mapCommentModelToSummary(model);

      expect(result.content).toEqual('**komentar telah dihapus**');
    });
  });

  describe('mapCommentReplyDbToModel', () => {
    it('should map db record to reply model correctly', () => {
      const dbRow = {
        id: 'reply-123',
        content: 'a reply',
        owner: 'user-123',
        comment_id: 'comment-456',
        date: '2025-09-11T00:00:00.000Z',
        is_delete: false,
      };

      const result = mapCommentReplyDbToModel(dbRow);

      expect(result).toEqual({
        id: 'reply-123',
        content: 'a reply',
        owner: 'user-123',
        commentId: 'comment-456',
        date: '2025-09-11T00:00:00.000Z',
        isDelete: false,
      });
    });
  });

  describe('mapCommentReplyModelToSummary', () => {
    it('should keep content when isDelete is false', () => {
      const model = {
        id: 'reply-123',
        content: 'a reply',
        date: '2025-09-11T00:00:00.000Z',
        username: 'nazaralwi',
        isDelete: false,
      };

      const result = mapCommentReplyModelToSummary(model);

      expect(result.content).toEqual('a reply');
    });

    it('should replace content when isDelete is true', () => {
      const model = {
        id: 'reply-123',
        content: 'a reply',
        date: '2025-09-11T00:00:00.000Z',
        username: 'nazaralwi',
        isDelete: true,
      };

      const result = mapCommentReplyModelToSummary(model);

      expect(result.content).toEqual('**balasan telah dihapus**');
    });
  });
});