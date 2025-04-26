const urlValidator = (url) => {
  const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}\/?/;
  return urlRegex.test(url);
};

module.exports = urlValidator;
