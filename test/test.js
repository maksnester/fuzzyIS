const assert = require('chai').assert;

describe("Testing helpers.js", () => {

    const helpers = require('../lib/helpers');

    describe('Test of helpers.getMin и helpers.getMax', () => {

        it('Sorted array', () => {
            const array = [-4, -3, 0, 1, 7, 12];
            const min = helpers.getMin(array);
            const max = helpers.getMax(array);
            assert.strictEqual(min, array[0]);
            assert.strictEqual(max, array[array.length - 1]);
        });

        it('Reversed sorted array', () => {
            const array = [234, 123, 123, 10, 0, -10, -10, -15];
            const min = helpers.getMin(array);
            const max = helpers.getMax(array);
            assert.strictEqual(max, array[0]);
            assert.strictEqual(min, array[array.length - 1]);
        });

        it('Empty array', () => {
            const array = [];
            const min = helpers.getMin(array);
            const max = helpers.getMax(array);
            assert.strictEqual(min, null);
            assert.strictEqual(max, null);
        });

        it('Array of length = 1', () => {
            const array = [0];
            const min = helpers.getMin(array);
            const max = helpers.getMax(array);
            assert.strictEqual(min, 0);
            assert.strictEqual(max, 0);
        });

        it('Array with equal elements', () => {
            const array = [
                0.06245030734144032,
                0.06245030734144032,
                0.06245030734144032,
                0.06245030734144032,
                0.06245030734144032
            ];
            const min = helpers.getMin(array);
            const max = helpers.getMax(array);
            assert.strictEqual(min, 0.06245030734144032);
            assert.strictEqual(max, 0.06245030734144032);
        });

        it('Array with null elements', () => {
            const array = [null, 0, -8, null, -7];
            const min = helpers.getMin(array);
            const max = helpers.getMax(array);
            assert.strictEqual(min, -8);
            assert.strictEqual(max, 0);
        });

        it('Array of length = 2, contains null and one value', () => {
            const array1 = [null, 0.06245030734144032];
            let min = helpers.getMin(array1);
            let max = helpers.getMax(array1);
            assert.strictEqual(min, 0.06245030734144032);
            assert.strictEqual(max, 0.06245030734144032);

            const array2 = [0.06245030734144032, null];
            min = helpers.getMin(array2);
            max = helpers.getMax(array2);
            assert.strictEqual(min, 0.06245030734144032);
            assert.strictEqual(max, 0.06245030734144032);
        });
    });

    describe('Testing helpers.minOfTwoFunctions and maxOfTwoFunctions', () => {

        const mfTypes = require('../lib/mfTypes');

        it('Find min and max for two functions', () => {
            const point = 8.49;
            const f1 = (point) => {
                return mfTypes.gauss(point, 2.123, 10)
            };
            const f2 = (point) => {
                return mfTypes.trapeze(point, 7, 9, 10, 10)
            };
            const min = helpers.minOfTwoFunctions(f1, f2, point);
            assert.strictEqual(min.toFixed(3), "0.745");
        });

        it('Find min and max for one function and constant', () => {
            const f1 = (point) => {
                return mfTypes.gauss(point, 2.123, 5)
            };
            const f2 = 0.5;

            for (let point = 0; point < 10; point++) {
                if (point < 2 && point > 7) {
                    assert.operator(f1(point), '<=', helpers.minOfTwoFunctions(f1, f2, point));
                } else {
                    assert.operator(f1(point), '>=', helpers.minOfTwoFunctions(f1, f2, point));
                }
            }
        });

        it('Min and max between function and null-function always from non-null function', () => {
            const point = 4.123;
            const f1 = (point) => {
                return mfTypes.gauss(point, 2.123, 5)
            };
            const f2 = null;

            assert.strictEqual(f1(point), helpers.minOfTwoFunctions(f1, f2, point));
            assert.strictEqual(f1(point), helpers.maxOfTwoFunctions(f1, f2, point));
            assert.strictEqual(f1(point), helpers.minOfTwoFunctions(f2, f1, point));
            assert.strictEqual(f1(point), helpers.maxOfTwoFunctions(f2, f1, point));
        });

        it('Min and max between null and const should be null', () => {
            const point = 4.123;
            const f1 = 0.5;
            const f2 = null;

            assert.isNull(helpers.minOfTwoFunctions(f1, f2, point));
            assert.isNull(helpers.minOfTwoFunctions(f2, f1, point));
            assert.isNull(helpers.maxOfTwoFunctions(f1, f2, point));
            assert.isNull(helpers.maxOfTwoFunctions(f2, f1, point));
        });
    });
});

describe("Testing FIS", () => {

    const FIS = require('../lib/FIS');
    const LinguisticVariable = require('../lib/LinguisticVariable');
    const Term = require('../lib/Term');
    const Rule = require('../lib/Rule');


    let system = new FIS();

    it('FIS should be defined', () => {
        assert.isDefined(system, "FIS undefined");
    });

    // create base of rules for example about "tips"
    // in that example we have two input fuzzy variables: services and food
    // based on that inputs and some rules for our inference system
    // we should get precise value = how many money (in percents) we should leave as a tips

    let inputs = [
        new LinguisticVariable('service', [0, 10]),
        new LinguisticVariable('food', [0, 10])
    ];

    let outputs = [
        new LinguisticVariable('tips', [0, 30])
    ];

    let SERVICE = inputs[0];
    let FOOD = inputs[1];
    let TIPS = outputs[0];


    SERVICE.addTerm(new Term('poor', 'gauss', [2.123, 0]));
    SERVICE.addTerm(new Term('normal', 'gauss', [2.123, 5]));
    SERVICE.addTerm(new Term('excellent', 'gauss', [2.123, 10]));

    FOOD.addTerm(new Term('bad', 'trapeze', [0, 0, 1, 3]));
    FOOD.addTerm(new Term('good', 'trapeze', [7, 9, 10, 10]));

    TIPS.addTerm(new Term('cheap', 'triangle', [0, 5, 10]));
    TIPS.addTerm(new Term('average', 'triangle', [10, 15, 20]));
    TIPS.addTerm(new Term('generous', 'triangle', [20, 25, 30]));

    system.inputs = inputs;
    system.outputs = outputs;

    system.rules = [
        new Rule(
            ['poor', 'bad'],
            ['cheap'],
            'and'
        ),
        new Rule(
            ['normal', null],
            ['average'],
            'and'
        ),
        new Rule(
            ['excellent', 'good'],
            ['generous'],
            'and'
        )
    ];

    it('Verifies that the rules specified in the order of the linguistic variables', () => {
        for (let i = 0; i < system.rules.length; i++) {
            // for each i/o exists term for linguistic variable
            for (let j = 0; j < system.rules[i].conditions.length; j++) {
                assert.isDefined(system.inputs[j]);
                if (system.rules[i].conditions[j])
                    assert.isNotNull(system.inputs[j].findTerm(system.rules[i].conditions[j]));
            }
            for (let j = 0; j < system.rules[i].conclusions.length; j++) {
                assert.isDefined(system.outputs[j]);
                if (system.rules[i].conclusions[j])
                    assert.isNotNull(system.outputs[j].findTerm(system.rules[i].conclusions[j]));
            }
        }
    });

    describe('Some precalculated values for example about "tips"', () => {
        // rules for FIS are predefined so may looks a little strange like when for zero-service we leave 15% tips

        it('Service in 7.018, food in 2.59, tips should be 15%', () => {
            assert.strictEqual(system.getPreciseOutput([7.018, 2.59])[0].toFixed(0), "15");
        });

        it('Service in 0, food in 9.458, tips should be 15%', () => {
            assert.strictEqual(system.getPreciseOutput([0, 9.458])[0].toFixed(0), "15");
        });

        it('Service in 7.892, food in 7.41, tips should be 17.4%', () => {
            assert.strictEqual(system.getPreciseOutput([7.892, 7.41])[0].toFixed(1), "17.4");
        });
    });
});
