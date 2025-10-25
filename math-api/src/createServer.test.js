const createServer = require('./createServer');
const FigureCalculator = require('./FigureCalculator');
const MathBasic = require('./MathBasic');

describe('A HTTP Server', () => {
    describe('when GET /add', () => {
        it('should respond with a status code of 200 and the payload value is addition result of a and b correctly', async () => {
            // Arrange
            const a = 10;
            const b = 20;
            const spyAdd = jest.spyOn(MathBasic, 'add');
            const server = createServer({ mathBasic: MathBasic });

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/add/${a}/${b}`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.value).toEqual(30);
            expect(spyAdd).toBeCalledWith(a, b);
        });
    });

    describe('when GET /subtract', () => {
        it('should respond with a status code of 200 and the payload value is subtraction result of a and b correctly', async () => {
            // Arrange
            const a = 12;
            const b = 8;
            const spySubtract = jest.spyOn(MathBasic, 'subtract');
            const server = createServer({ mathBasic: MathBasic });

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/subtract/${a}/${b}`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.value).toEqual(4); // a - b
            expect(spySubtract).toBeCalledWith(a, b);
        });
    });

    describe('when GET /multiply/{a}/{b}', () => {
        it('should respond with a status code of 200 and the payload value is multiplication result of a and b correctly', async () => {
            // Arrange
            const a = 10;
            const b = 5;
            const spyMultiply = jest.spyOn(MathBasic, 'multiply');
            const server = createServer({ mathBasic: MathBasic });

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/multiply/${a}/${b}`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.value).toEqual(50); // 10 * 5
            expect(spyMultiply).toBeCalledWith(a, b);
        });
    });

    describe('when GET /divide/{a}/{b}', () => {
        it('should respond with a status code of 200 and the payload value is division result of a and b correctly', async () => {
            // Arrange
            const a = 10;
            const b = 5;
            const spyDivide = jest.spyOn(MathBasic, 'divide');
            const server = createServer({ mathBasic: MathBasic });

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/divide/${a}/${b}`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.value).toEqual(2); // 10 / 5
            expect(spyDivide).toBeCalledWith(a, b);
        });
    });

    describe('when GET /rectangle/perimeter/{length}/{width}', () => {
        it('should respond with a status code of 200 and the payload value is the result of calculating the perimeter of the rectangle correctly', async () => {
            // Arrange
            const length = 8;
            const width = 4;
            const figureCalculator = new FigureCalculator(MathBasic);
            const spyCalculateRectanglePerimeter = jest.spyOn(figureCalculator, 'calculateRectanglePerimeter');
            const server = createServer({ figureCalculator });

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/rectangle/perimeter/${length}/${width}`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.value).toEqual(24); // 2 * (length + width)
            expect(spyCalculateRectanglePerimeter).toBeCalledWith(length, width);
        });
    });
});