const fuzzyis = require('fuzzyis');

const {LinguisticVariable, Term, Rule, FIS} = fuzzyis;

// describe new system, input and output variables

const system = new FIS('Tip system');

// init and add variables into system

const TIP = new LinguisticVariable('tip', [0, 30]);
system.addOutput(TIP);

const FOOD = new LinguisticVariable('service', [0, 10]);
const SERVICE = new LinguisticVariable('food', [0, 10]);

system.addInput(SERVICE);
system.addInput(FOOD);

// describe terms for each variable

SERVICE.addTerm(new Term('poor', 'gauss', [2.123, 0]));
SERVICE.addTerm(new Term('normal', 'gauss', [2.123, 5]));
SERVICE.addTerm(new Term('excellent', 'gauss', [2.123, 10]));

FOOD.addTerm(new Term('bad', 'trapeze', [0, 0, 1, 3]));
FOOD.addTerm(new Term('good', 'trapeze', [7, 9, 10, 10]));

TIP.addTerm(new Term('small', 'triangle', [0, 5, 10]));
TIP.addTerm(new Term('average', 'triangle', [10, 15, 20]));
TIP.addTerm(new Term('generous', 'triangle', [20, 25, 30]));

// describe system rules

// NB! It's important to preserve the same order in description
// as you had when defined inputs
// e.g. if you've added SERVICE first, then first value should be one of the possible values for this variable

system.rules = [
  new Rule(
      ['poor', 'bad'],
      ['small'],
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

// get some calculation

console.log(
  system.getPreciseOutput([7.892, 7.41])
);