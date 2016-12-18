module.exports = {
    indexOfObjByAttr,
    getMin,
    getMax,
    minOfTwoFunctions,
    maxOfTwoFunctions,
    getMinOrMaxOfTwoFunction,
    getMaxFromFunctions,
    objClear
};

/**
 * Searches in array for an object which has specified pair attr:value
 * @param {Array.<Object>} array
 * @param {string} attr
 * @param value
 * @returns {number} index of obj or -1 if not found
 */
function indexOfObjByAttr(array, attr, value) {
    for(let i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }

    return -1;
}

/**
 * Null is not compares with numbers.
 * @param {Array.<Number>} array
 * @returns {number | null}
 */
function getMin(array) {
    if (!array.length) return null;
    let min = null;

    for (let i = 0; i < array.length; i++) {
        if (array[i] !== null && (min === null || array[i] < min)) min = array[i];
    }

    return min;
}

/**
 * Null is not compares with numbers.
 * @param array
 * @returns {number | null}
 */
function getMax(array) {
    if (!array.length) return null;
    var max = null;

    for (var i = 0; i < array.length; i++) {
        if (array[i] !== null && (max === null || array[i] > max)) max = array[i];
    }

    return max;
}

/**
 * Get min value of two functions at specific point
 * @param {function|Number} f1
 * @param {function|Number} f2
 * @param {number} point
 * @returns {number}
 */
function minOfTwoFunctions(f1, f2, point) {
    return getMinOrMaxOfTwoFunction(f1, f2, point, true);
}

/**
 * Get min value of two functions at specific point
 * @param {function|Number} f1
 * @param {function|Number} f2
 * @param {number} point
 * @returns {number}
 */
function maxOfTwoFunctions(f1, f2, point) {
    return getMinOrMaxOfTwoFunction(f1, f2, point, false);
}

/**
 * Get min or max value of two functions at specific point
 * @param {function|Number} f1
 * @param {function|Number} f2
 * @param {number} point
 * @param {boolean} isMin
 * @returns {number|null}
 */
function getMinOrMaxOfTwoFunction(f1, f2, point, isMin) {
    let value1 = null;
    let value2 = null;

    if (typeof(f1) === "function") {
        value1 = f1(point);
    } else if (f1 !== null) value1 = f1;

    if (typeof(f2) === "function") {
        value2 = f2(point);
    } else if (f2 !== null) value2 = f2;

    if (typeof(f1) !== 'function' && typeof(f2) !== 'function') {
        return null;
    }

    if (value1 !== null && value2 !== null) {
        if (isMin) {
            return (value1 < value2) ? value1 : value2;
        } else {
            return (value1 > value2) ? value1 : value2;
        }
    } else if (value1 === null) return value2;

    return value1;
}

/**
 * Get max value at specific point from all specified functions
 * @param {Array.<function>} arrayOfFunctions
 * @param {number} x
 * @returns {number}
 */
function getMaxFromFunctions(arrayOfFunctions, x) {
    var max = 0;
    arrayOfFunctions.forEach(function(func) {
        if (func) {
            var value = func(x);
            if (value > max) max = value;
        }
    });

    return max;
}

/**
 * Removes all own object properties.
 * @param obj
 */
function objClear(obj) {
    if (!obj) return;
    for (let member in obj) {
        if (obj.hasOwnProperty(member)) {
            delete obj[member];
        }
    }
}