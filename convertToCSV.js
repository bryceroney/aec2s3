const json2csv = require('json2csv').Parser;

module.exports = function(data) {
	return new Promise(function(res, rej) {
		const parser = new json2csv();
		try {
			const csv = parser.parse(data)

			res(csv);		
		} catch(err) {
			rej(err)
		}
	})
}
