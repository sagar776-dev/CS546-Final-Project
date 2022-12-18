const filter = require('leo-profanity');

const checkForProfanity = async (str) => {
  let temp = filter.clean(str);
  if(temp !== str){
    return true;
  }
  return false;
};

module.exports = {
  checkForProfanity,
};
