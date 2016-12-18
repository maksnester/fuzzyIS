/**
 * Describes Term limited by belief degree.
 */
class CorrectedTerm {
    /**
     *
     * @param {Term} term
     * @param {number} beliefDegree
     */
    constructor(term, beliefDegree){
        if (typeof term === 'undefined' || typeof beliefDegree === 'undefined')
            throw new Error('Corrected term: no params for constructor');
        this.term = term;
        this.beliefDegree = beliefDegree;
    }

    /**
     *
     * @param {number} x
     * @returns {number}
     */
    valueAt (x) {
        if (!this.term || this.beliefDegree === 0) {
            return 0;
        }

        let termValue = this.term.valueAt(x);
        let beliefDegree = this.beliefDegree;

        return Math.min(beliefDegree, termValue);
    }
}

module.exports = CorrectedTerm;