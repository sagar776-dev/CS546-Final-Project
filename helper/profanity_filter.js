const checkForProfanity = (str) =>{
    let splitStr = str.split(" ");
    let profaneWords = loadData();
    for(let s in splitStr){
        if(profaneWords.toLowerCase().includes(s.toLowerCase())){
            return true;
        }
    }
    return false;
}

const loadData = () => {
    fs.readFile("./public/bad-words.csv", 'utf8', function (err, data) {
      let dataArray = data.split(/\r?\n/);
      return dataArray;
    })
};

module.exports = {
    loadData,
    checkForProfanity
  };