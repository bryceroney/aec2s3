const AWS = require('aws-sdk');


module.exports = function(csv) {
	return new Promise(function(res, rej) {
			console.log("Uploading to S3")

	AWS.config.update({
		region: process.env.AWS_REGION
	});
	var credentials = new AWS.SharedIniFileCredentials({profile: process.env.AWS_PROFILE});
	AWS.config.credentials = credentials;

	const s3 = new AWS.S3({apiVersion: '2006-03-01'});


	const uploadParams = {
		Bucket: process.env.S3_BUCKET,
		Key: process.env.S3_KEY,
		Body: csv
	}

	s3.upload(uploadParams, function(err, data)  {
		if(err) {
			rej(err)
		} 

		if(data) {
			console.log("Uploaded to S3!")
			res(data);
		}
	})

	})

}