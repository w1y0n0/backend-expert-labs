const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('/threads endpoint', () => {
    let server;
    let myAccessToken;

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
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    describe('when POST /threads', () => {
        it('should response 201 and persisted thread', async () => {
            // Arrange
            const requestPayload = {
                title: 'A title',
                body: 'A body',
            };

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    authorization: `Bearer ${myAccessToken}`
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {
                title: 'A title',
            };

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    authorization: `Bearer ${myAccessToken}`
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                title: 'A title',
                body: [123],
            };

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    authorization: `Bearer ${myAccessToken}`
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
        });
    });

    describe('when GET /threads/{threadId}', () => {
        it('should response 200 and return thread detail', async () => {
            // Arrange
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

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${addedThread.id}`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread).toBeDefined();
        });

        it('should response 404 when on invalid thread', async () => {
            // Arrange
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

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${addedThread.id}xxx`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
        });
    });
});