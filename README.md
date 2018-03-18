# FuzzyIS - fuzzy inference system library
[![npm version](https://badge.fury.io/js/fuzzyis.svg)](https://badge.fury.io/js/fuzzyis) 

It is a JavaScript library for building fuzzy inference systems.  
Build your own system right in browser or with nodejs.  

Install it!

`npm install fuzzyis`

Browser-ready minified version available at `/dist` directory.
Nodejs usage:
`const fuzzyis = require('fuzzyis');`

FuzzyIS contains 4 core objects:

* **LinguisticVariable** - thing described by fuzzy-terms like *fast / slow*, *tall / low*, *hot / cold* etc...
* **Term** - mentioned fuzzy term itself
* **Rule** - thing which describes connection between input and output linguistic variables. These are conditions like: "if **food** is *tasty* AND **service** is *great* -> **tip** should be *generous*", which describes how system works.
* **FIS** - fuzzy inference system. It is created with input and output linguistic variables and with described rules.
FIS calculates precise values for output linguistic variables from precise values of input variables referring to the rules given.

## Example about the tip

Let's see how we can model simple fuzzy inference system. I'll provide an example which works in nodejs environment. For browser it should be the same (full source of example see in `example` folder).

First of all, install `fuzzyis` with `npm i fuzzyis` then import it. And init new fuzzy inference system.

```javascript
const fuzzyis = require('fuzzyis');
const {LinguisticVariable, Term, Rule, FIS} = fuzzyis;

// describe new system, input and output variables

const system = new FIS('Tip system');
```

We need to know how much we should leave for officiant in percentage terms. Tip is output linguistic variable. We suppose it could be 'small', 'average' or 'generous'. And in precise values it could be from 0 to 30% from bill.

```javascript
// init and add variables into system

const TIP = new LinguisticVariable('tip', [0, 30]);
system.addOutput(TIP);
```

We'll draw our conclusion about the tip based on the quality of service and food quality. Food and Service are input linguistic variables.
Let's agree that Food could be only 'bad' or 'good'. Service could be 'poor', 'normal', 'excellent'. We'll rate them both from 0 to 10 on an imaginary scale.

```javascript
const FOOD = new LinguisticVariable('service', [0, 10]);
const SERVICE = new LinguisticVariable('food', [0, 10]);

system.addInput(SERVICE);
system.addInput(FOOD);
```

Now we should explain our fuzzy terms to the system and create the mentioned terms. Each term is described by a function.

Let's define what "good" and "bad" **food** mean in terms of the imaginary 0 to 10 scale.

![food](https://cloud.githubusercontent.com/assets/4989157/21298567/db682a84-c5e6-11e6-85d5-2469cfc729f0.png)

Same thing for **service** terms:

![service](https://cloud.githubusercontent.com/assets/4989157/21298562/be79342c-c5e6-11e6-8d87-27912258a418.png)

And for **tip**:

![tip](https://cloud.githubusercontent.com/assets/4989157/21298571/eceb88be-c5e6-11e6-8752-b53de217e6b9.png)

Code it:

```javascript
// describe terms for each variable

SERVICE.addTerm(new Term('poor', 'gauss', [2.123, 0]));
SERVICE.addTerm(new Term('normal', 'gauss', [2.123, 5]));
SERVICE.addTerm(new Term('excellent', 'gauss', [2.123, 10]));

FOOD.addTerm(new Term('bad', 'trapeze', [0, 0, 1, 3]));
FOOD.addTerm(new Term('good', 'trapeze', [7, 9, 10, 10]));

TIP.addTerm(new Term('small', 'triangle', [0, 5, 10]));
TIP.addTerm(new Term('average', 'triangle', [10, 15, 20]));
TIP.addTerm(new Term('generous', 'triangle', [20, 25, 30]));
```

Now we should explain how tip depend on food and service to our system. Let's agree that the rules are as follows:

> if **service** is *poor* AND **food** is *bad* -> **tip** is *small*

> if **service** is *normal* -> **tip** is *average*

> if **service** is *excellent* AND **food** is *good* -> **tip** is *generous*

```javascript
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
```

Now we have described our system and can ask it to calculate tip (will print result in console):

```
console.log(
  system.getPreciseOutput([7.892, 7.41])
);
```

Result is `[17.40000000000002]`

* `getPreciseOutput` returns an array with values of output variables.