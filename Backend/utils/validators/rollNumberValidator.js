const isValidRollNumber = (rollNumber) => {
  const rollRegex = /^[lipkfm]\d{6}$/;
  return rollRegex.test(rollNumber);
};
module.exports = isValidRollNumber;
