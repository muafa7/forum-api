const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthorizationTestHelper = require('../../../../tests/AuthorizationTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/users endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });
    
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });
      
  describe('when POST /threads', () => {
    it('should response 201 and added thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };
      
      const server = await createServer(container);
      const auth = new AuthorizationTestHelper(server);

      const { accessToken } = await auth.getAccessTokenAndUserId();

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
    });

    it('should response 400 if thread payload not contain needed property', async () => {
      // Arrange
      const requestPayload = { title: 'A thread' };
      const server = await createServer(container);
      const auth = new AuthorizationTestHelper(server);

      const { accessToken } = await auth.getAccessTokenAndUserId();

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 if thread payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        title: 111,
        body: 'Thread Body',
      };
      const server = await createServer(container);
      const auth = new AuthorizationTestHelper(server);

      const { accessToken } = await auth.getAccessTokenAndUserId();

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });

    it('should response 401 if headers not contain access token', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });
  });
});