// типы функций принадлежности
module.exports = {
    triangle: mf_triangle,
    trapeze: mf_trapezoidal,
    gauss: mf_gaussian,
    sigma: mf_sigmoid,
    singleton: mf_singleton
};

/**
 * Triangle membership function.
 * @param {number} input
 * @param {number} left border of domain function, f(left) = 0 (pessimistic estimate)
 * @param {number} max coordinate where f(max) = 1 (optimistic estimate)
 * @param {number} right border of domain function, f(right) = 0 (pessimistic estimate)
 * @returns {number}
 */
function mf_triangle(input, left, max, right) {
    if (input < left || input > right) return 0;
    if (left <= input && input <= max) return (input - left) / (max - left);

    return (right - input) / (right - max);
}

/**
 * Trapezoidal membership function.
 * @param {number} input
 * @param {number} left f(left) = 0
 * @param {number} maxLeft f(maxLeft) = 1
 * @param {number} maxRight f(maxRight) = 1
 * @param {number} right f(right) = 0
 * @returns {number}
 */
function mf_trapezoidal(input, left, maxLeft, maxRight, right) {
    if (input < left || input > right) return 0;
    if (left <= input && input <= maxLeft) return (input - left) / (maxLeft - left);
    if (maxLeft <= input && input <= maxRight) return 1;
    return (right - input) / (right - maxRight);
}

/**
 * Gaussian membership function.
 * @param {number} input
 * @param {number} concentration coefficient
 * @param {number} max f(max) = 1
 * @returns {number}
 */
function mf_gaussian(input, concentration, max) {
    return (input === max) ? 1 :
        Math.exp((-1) * ((input - max) * (input - max)) / (2 * concentration * concentration));
}


/**
 * Sigmoid membership function.
 * @param {number} input
 * @param {number} steepness coefficient
 * @param {number} transitionCoordinate f(transitionCoordinate) = 0.5
 * @returns {number}
 */
function mf_sigmoid(input, steepness, transitionCoordinate) {
    return (input === transitionCoordinate) ? 0.5 :
        1 / (1 + Math.exp((-1) * steepness * (input - transitionCoordinate)));
}

/**
 * Singleton membership function.
 * @param {number} input
 * @param {number} number concrete value. f(number) = 1 otherwise 0
 * @returns {number} 0 or 1
 */
function mf_singleton(input, number) {
    return (input === number) ? 1 : 0;
}