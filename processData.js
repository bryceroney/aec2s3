// const xpath = require('xpath');
// const dom = require('xmldom').DOMParser;
const fs = require('fs');
const xml = require('xml2js');


function processData() {
	return new Promise((res, rej) => {
		// Load our file
		const file = fs.readFileSync('tmp/mediafeed.xml', "utf8");
		const parser = new xml.Parser();

		parser.parseString(file, (err, data) => {

			// Load candidates

			const candidateContainer = data.MediaFeed.Results[0].Election[0].House[0].Contests[0].Contest[0].FirstPreferences[0].Candidate;
			let candidates = {}

			candidateContainer.forEach(function(i) {
				let candidateId = 0;
				let party = '';

				if(i.hasOwnProperty('eml:CandidateIdentifier')) {
					candidateID = i['eml:CandidateIdentifier'][0]['$']['Id'];
				} 

				if(i.hasOwnProperty('eml:AffiliationIdentifier')) {
					party = i['eml:AffiliationIdentifier'][0]['$']['ShortCode'];
				} else {
					party = 'IND'
				}


				const append = {};
				candidates[candidateID] = party;

			})


			const ppContainer = data.MediaFeed.Results[0].Election[0].House[0].Contests[0].Contest[0].PollingPlaces[0].PollingPlace;

			const ppResults = [];

			ppContainer.forEach(i => {
				let results = {}
				results['name'] = i.PollingPlaceIdentifier[0]['$'].Name;

				// FP VOTES
				i.FirstPreferences[0].Candidate.forEach((c, index) => {
					const candidateId = c['eml:CandidateIdentifier'][0]['$']['Id'];
					const votes = c['Votes'][0]['_'];

					let party = candidates[candidateId];
					if(party == 'IND') { party = `${party}_${index}`};

					results[party] = votes;

				})

				// TCP VOTES
				if(i.TwoCandidatePreferred[0]['$']['Restricted'] == 'true') {
					results['TCP_ALP'] = 0;
					results['TCP_LP'] = 0;
				} else {
				i.TwoCandidatePreferred[0].Candidate.forEach((c, index) => {
					const candidateId = c['eml:CandidateIdentifier'][0]['$']['Id'];
					const votes = c['Votes'][0]['_'];

					let party = `TCP_${candidates[candidateId]}`;

					results[party] = votes;
				})
				}


				ppResults.push(results);

			})

			res(ppResults);

		})
	})
}

module.exports = processData;