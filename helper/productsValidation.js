const usernameRegex = /^[A-Za-z0-9\s]*$/;
const charRegex = /^[A-Za-z\s]*$/
const digitRegex = /(?=.*[0-9])/;
const capitalRegex = /^[A-Z]/;
const specialRegex = /(?=.*[!@#$%^&*.])/;


// search
// manufacturer
// instoreavailabilit
// rating
// customerreviewcoun
// visitedtimes
const checkString = (strVal, varName) => {
    if (Array.isArray(strVal)) {
        search = search[0]
    }
    if (isNaN(strVal)) return strVal;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
        throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    return strVal;
}

// minimum
// maximum
const checkNumber = (num, varName) => {
    if (Array.isArray(num)) {
        num = num[0]
    }
    if (isNaN(num)) return num;
    if (/[a-z]/i.test(num)) throw `${varName} contains letters`
    num = parseInt(num)
    if (typeof num !== 'number') throw `${varName} is not a number`;
    if (num < 0) throw `Error: ${varName} is less than 0`;
    return num;
}

module.exports = {
    checkString,
    checkNumber
};