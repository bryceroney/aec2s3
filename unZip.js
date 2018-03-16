const fs = require('fs');
const unzip = require('unzip');

module.exports = function unZip(pathName) {

	return new Promise(function(res, rej) {
		fs.createReadStream(pathName)
		.pipe(unzip.Parse())
		.on('entry', (entry) => {

			if(entry.path == `xml/aec-mediafeed-results-detailed-verbose-${process.env.ELEC_EVENT}.xml`) {
				const stream = fs.createWriteStream(`tmp/mediafeed.xml`);
				entry.pipe(stream);
				stream.on('close', () => {res()})
			} else {
				entry.autodrain();
			}

		})
	})

}