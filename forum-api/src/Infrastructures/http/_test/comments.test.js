const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('/threads/{threadId}/comments endpoint', () => {
  let server;
  let myAccessToken;
  let myThread;

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    server = await createServer(container);

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'nazaralwi',
        password: '12345678',
        fullname: 'Nazar Alwi',
      },
    });

    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'nazaralwi',
        password: '12345678',
      },
    });

    const { data: { accessToken } } = JSON.parse(loginResponse.payload);
    myAccessToken = accessToken;

    const addThreadRequestPayload = {
      title: 'A title',
      body: 'A body',
    };

    // Action
    const addThreadResponse = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: addThreadRequestPayload,
      headers: {
        authorization: `Bearer ${myAccessToken}`
      }
    });

    const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);
    myThread = addedThread;
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'A content',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${myThread.id}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${myAccessToken}`
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        ctn: 'A content',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${myThread.id}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${myAccessToken}`
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: [123],
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${myThread.id}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${myAccessToken}`
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and soft delete the comment', async () => {
      // Arrange
      const addCommentRequestPayload = {
        content: 'A content',
      };

      // Action
      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${myThread.id}/comments`,
        payload: addCommentRequestPayload,
        headers: {
          authorization: `Bearer ${myAccessToken}`
        }
      });

      const { data: { addedComment } } = JSON.parse(addCommentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${myThread.id}/comments/${addedComment.id}`,
        headers: {
          authorization: `Bearer ${myAccessToken}`
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when on invalid comment', async () => {
      // Arrange
      const addCommentRequestPayload = {
        content: 'A content',
      };

      // Action
      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${myThread.id}/comments`,
        payload: addCommentRequestPayload,
        headers: {
          authorization: `Bearer ${myAccessToken}`
        }
      });

      const { data: { addedComment } } = JSON.parse(addCommentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${myThread.id}/comments/${addedComment.id}xxx`,
        headers: {
          authorization: `Bearer ${myAccessToken}`
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
});