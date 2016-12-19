const assert = chai.assert;

describe("Testing FIS", () => {

    const FIS = fuzzyis.FIS;
    const LinguisticVariable = fuzzyis.LinguisticVariable;
    const Term = fuzzyis.Term;
    const Rule = fuzzyis.Rule;


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
