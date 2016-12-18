/**
 * Describe a rule for fuzzy inference system.
 * Rule is:
 * 1) Matching for every linguistic variable with one of it terms.
 * 2) Connection between input terms of linguistic variables: "or" / "and"
 *      example: if *food* is good AND *service* is normal than *tips* should be good
 * 3) Weight coefficient of Rule. Or how much rule will effort on system's conclusions.
 */
class Rule {
    /**
     * @param {Array.<string>} conditions массив вида [терм-значение-первой-LV, терм-значение-второй-LV...]
     * @param {Array.<string>} conclusions
     * @param {string} connection
     * @param {number} weight
     */
    constructor (conditions, conclusions, connection = 'and', weight = 1) {
        if (!conditions || !conclusions || !conditions.length || !conclusions.length)
            throw new Error('Rule: check input params');

        this.conditions = conditions.map(function(c) {
            if (c === "null") return null;
            else return c;
        });

        this.conclusions = conclusions.map(function(c) {
            if (c === "null") return null;
            else return c;
        });

        if (typeof(connection) === "string") {
            if (connection.toLowerCase() === "or") {
                this.connection = "or";
            } else {
                this.connection = "and";
            }
        } else throw new Error(`Rule: unrecognized connection ${connection}`);

        this.weight = weight;
    }
}

module.exports = Rule;