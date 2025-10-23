class FigureCalculator {
    constructor(mathBasic) {
        this._mathBasic = mathBasic;
    }

    calculateRectanglePerimeter(...args) {
        if (args.length !== 2) {
            throw new Error('fungsi hanya menerima dua parameter');
        }

        const [length, width] = args;

        if (typeof length !== 'number' || typeof width !== 'number') {
            throw new Error('fungsi hanya menerima parameter number');
        }
    }
    calculateRectangleArea() { }
    calculateTrianglePerimeter() { }
    calculateTriangleArea() { }
}

module.exports = FigureCalculator;