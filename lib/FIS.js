const CorrectedTerm = require('./CorrectedTerm');
const UnionOfTerms = require('./UnionOfTerms');
const helpers = require('./helpers');

/**
 * Describes Fuzzy Inference System
 * Put LinguisticVariables into inputs and outputs, describe system rules
 * And get precise outputs from precise input values.
 */
class FIS {
    /**
     * Creates empty system without any rules and i/o linguistic variables
     * @param {string} name
     * @param {Array.<LinguisticVariable>} inputs
     * @param {Array.<LinguisticVariable>} outputs
     * @param {Array.<Rule>} rules
     */
    constructor (name = "Unnamed system", inputs = [], outputs = [], rules = []) {
        this.name = name;

        // linguistic variables
        this.inputs = inputs;
        this.outputs = outputs;

        this.rules = rules;
    }

    /**
     * @param {LinguisticVariable} LV
     */
    addInput (LV) {
        this.inputs.push(LV);
    }

    /**
     * @param {LinguisticVariable} LV
     */
    addOutput (LV) {
        this.outputs.push(LV);
    }

    /**
     * @param {Rule} rule
     */
    addRule (rule) {
       this.rules.push(rule);
    }

    /**
     * 
     * @param {Array.<number>} inputValues Precise values for input linguistic variables
     * @returns {Array.<number>} Precise values for input linguistic variables
     */
    getPreciseOutput (inputValues) {
        let leftParts = getLeftParts(inputValues, this);

        // for each Rule we should find belief degree

        let rightParts = [];
        let i;
        for (i = 0; i < this.rules.length; i++) {
            let rule = this.rules[i];
            rule.beliefDegree = (rule.connection) === "and" ? helpers.getMin(leftParts[i]) : getMax(leftParts[i]);
            rule.beliefDegree *= rule.weight;
    
            // filling the right parts
            rightParts.push([]);
            for (let j = 0; j < rule.conclusions.length; j++) {
                let term = this.outputs[j].findTerm(rule.conclusions[j]);
                rightParts[i].push(new CorrectedTerm(term, rule.beliefDegree));
            }
    
        }
    
        let unionOfCorrectedTerms = [];
    
        //outputs
        for (i = 0; i < this.outputs.length; i++) {
            // rules
            let union = [];
            for (let k = 0; k < rightParts.length; k++) {
                union.push(rightParts[k][i]);
            }
            unionOfCorrectedTerms.push(new UnionOfTerms(union));
        }
    
        let results = [];
    
        for (i = 0; i < this.outputs.length; i++) {
            let result = getMassCenter(unionOfCorrectedTerms[i], this.outputs[i].range, 100);
            results.push(result);
        }
    
        return results;
    }
}

module.exports = FIS;

/**
 *
 * @param {Array.<LinguisticVariable>} inputValues
 * @param system {FIS}
 * @returns {Array}
 */
function getLeftParts(inputValues, system) {
    let leftParts = [];
    let inputsAmount = system.inputs.length;
    for (let i = 0; i < system.rules.length; i++) {
        // for each Rule get values at the right parts
        leftParts.push([]);
        for (let j = 0; j < inputsAmount; j++) {
            if (system.rules[i].conditions[j]) {
                let term = system.inputs[j].findTerm(system.rules[i].conditions[j]);
                leftParts[i].push(term.valueAt(inputValues[j]));
            } else {
                leftParts[i].push(null);
            }
        }
    }

    return leftParts;
}

/**
 * Searches for point in which Square under f equals to half on specific interval.
 * @param {UnionOfTerms} unionOfTerms
 * @param {Array.<Number>} range [start, end]
 * @param {number} points number of partition points
 * @returns {number}
 */
function getMassCenter(unionOfTerms, range, points) {
    let delta = (range[1] - range[0]) / (points || 100);
    let S = 0;
    let currentStep = range[0];

    while (currentStep < range[1]) {
        currentStep += delta;
        S += delta * unionOfTerms.valueAt(currentStep);
    }

    currentStep = range[0];
    let newS = 0;
    let half_S = S / 2;
    while (newS < half_S) {
        currentStep += delta;
        newS += delta * unionOfTerms.valueAt(currentStep);
    }

    // now it equals to 'mass center'. In prev point S < S/2, in next point  S > S/2
    return currentStep;
}