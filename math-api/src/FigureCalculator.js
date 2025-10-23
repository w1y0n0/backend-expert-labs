class FigureCalculator {
    constructor(mathBasic) {
        this._mathBasic = mathBasic;
    }

    calculateRectanglePerimeter(...args) {
        if (args.length !== 2) {
            throw new Error('fungsi hanya menerima dua parameter');
        }
    }
    calculateRectangleArea() { }
    calculateTrianglePerimeter() { }
    calculateTriangleArea() { }
}

module.exports = FigureCalculator;