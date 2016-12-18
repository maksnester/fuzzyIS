const mfTypes = require('./mfTypes');

/**
 * Describes Term for linguistic variables.
 * Term is a fuzzy definition of some variable. Like 'tall', 'low' - about height
 */
class Term {
    /**
     *
     * @param {string} name name of the Term ('tall', 'low', 'yong', 'old', 'fast', 'slow', etc...)
     * @param {string} mfType type of membership functions. See mfTypes.
     * @param {Array.<number>} mfParams parameters of the membership function. Here is some defaults.
     */
    constructor (name, mfType = 'triangle', mfParams = getDefaultParams(mfType)) {
        this.name = name;

        if (!mfTypes[mfType]) mfType = 'triangle';
        this.mfType = mfType;
        this.mf = mfTypes[mfType];
        this.mfParams = mfParams;
    }

    /**
     * Returns membership function value at x
     * @param {number} x
     * @returns {number}
     */
    valueAt (x) {
        let args = this.mfParams.slice();
        args.splice(0, 0, x); // insert to args value of x as first param
        return this.mf.apply(this, args);
    };
}

module.exports = Term;

/**
 * Some predefined args.
 * @param {string} mf membership function type from mfTypes
 * @param {Array.<number>} range domain of linguistic variable
 *
 */
function getDefaultParams(mf, range = [0, 1]) {

    let args = [];
    range = range[1] - range[0];

    switch (mf) {
        case 'triangle' :
            args = [parseFloat((0.1 * range).toFixed(4)), parseFloat((0.5 * range).toFixed(4)), parseFloat((0.9 * range).toFixed(4))];
            break;
        case 'trapeze':
            args = [parseFloat((0.1 * range).toFixed(4)), parseFloat((0.4 * range).toFixed(4)), parseFloat((0.6 * range).toFixed(4)), parseFloat((0.9 * range).toFixed(4))];
            break;
        case 'gauss':
            args = [parseFloat((0.17 * range).toFixed(4)), parseFloat((0.5 * range).toFixed(4))];
            break;
        case 'sigma':
            args = [parseFloat((18 / range).toFixed(4)), parseFloat((0.5 * range).toFixed(4))];
            break;
        case 'singleton':
            args = [parseFloat((0.5 * range).toFixed(4))];
            break;
        default: throw new Error(`getDefaultParams: unrecognized mfType ${mf}`);
    }

    return args;
}