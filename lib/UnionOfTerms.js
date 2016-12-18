/**
 * Union of n Terms acts like Term which returns max value from all Terms in Union for specified point
 */
class UnionOfTerms {
    /**
     *
     * @param {Array.<Term>} arrayOfTerms
     */
    constructor(arrayOfTerms) {
        this.arrayOfTerms = arrayOfTerms;
    }

    /**
     *
     * @param {number} x
     * @returns {number} max value from all Terms
     */
    valueAt (x) {
        if (!this.arrayOfTerms[0]) throw new Error('UnionOfTerms.valueAt: No terms in Union');

        let max = this.arrayOfTerms[0].valueAt(x);
        this.arrayOfTerms.forEach((term) => {
            if (term) {
                max = Math.max(max, term.valueAt(x));
            }
        });

        return max;
    };
}

module.exports = UnionOfTerms;