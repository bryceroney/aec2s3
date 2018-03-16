
const FTP = require('jsftp');
const _ = require('underscore');


function getFile() {
  console.log("Getting file")

  return new Promise(function(res, rej) {
    const domain = process.env.DOMAIN;
    const eventID = process.env.ELEC_EVENT;
    const path = `/${eventID}/Detailed/Verbose/`;

    console.log(path);

    const client = new FTP({
      host: domain
    })

    client.ls(path, (err, result) => {
      console.log("Finding latest file")

      if(err) { console.error(err);  rej(err) ; client.destroy(); return; }
      const timestamps = result.map(i => ({
        name: i.name,
        ts: parseInt(i.name.match(/([0-9]){14}/g)[0])
      }))

      let latestFile = _.sortBy(timestamps, 'ts')
      latestFile = latestFile[latestFile.length - 1]

      console.log(`Latest file is ${latestFile.name}`);


      client.get(`${path}${latestFile.name}`, `tmp/${latestFile.name}`, err => {
        if(err) {
          return rej(err);
        } 

        client.raw("QUIT");
        client.destroy();

        res(`tmp/${latestFile.name}`);

      })

    });


  })

}

module.exports = getFile;