const expect = require('expect.js');
const initCms = require('../../src/components/cms');
const config = require('../../config');

describe('CMS tests', () => {
	let englishLookup;
	let spanishLookup;

	before(async () => {
		const cms = await initCms(config.airtable).start();
		englishLookup = cms.lookup('EN');
		spanishLookup = cms.lookup('ES');
	});

	describe('Vocabulary', () => {
		it('Returns an output for a vocabulary entry in spanish', () => {
			const output = spanishLookup('hola');
			expect(output).to.only.have.keys('category', 'data');
			expect(output.category).to.equal('Vocabulary');
			expect(output.data).to.be.an('array');
			output.data.map(item => expect(item).to.be.a('string'));
		});

		it('Returns an output for a vocabulary entry in english', () => {
			const output = englishLookup('hello');
			expect(output).to.only.have.keys('category', 'data');
			expect(output.category).to.equal('Vocabulary');
			expect(output.data).to.be.an('array');
			output.data.map(item => expect(item).to.be.a('string'));
		});

		it('Cleans input from tildes, commas and other symbols', () => {
			const output = spanishLookup('¿cómo estás?');
			const sameOutput = spanishLookup('como estas');
			expect(output).to.eql(sameOutput);
		});
	});

	describe('Coordinates', () => {
		it('Returns an output for a coordinates entry in spanish', () => {
			const output = spanishLookup('donde esta la iglesia?');
			expect(output).to.only.have.keys('category', 'data');
			expect(output.data).to.only.have.keys('captions', 'longitude', 'latitude');
			expect(output.category).to.equal('Coordinates');
			expect(output.data.captions).to.be.an('array');
			output.data.captions.map(item => expect(item).to.be.a('string'));
			expect(parseFloat(output.data.longitude)).to.be.a('number');
			expect(parseFloat(output.data.latitude)).to.be.a('number');
		});

		// it('Returns an output for a coordinates entry in english', () => {
		// const output = spanishLookup('donde esta la iglesia?');
		// expect(output).to.only.have.keys('category', 'data');
		// expect(output.data).to.only.have.keys('captions', 'longitude', 'latitude');
		// expect(output.category).to.equal('Coordinates');
		// expect(output.data.captions).to.be.an('array');
		// output.data.captions.map(item => expect(item).to.be.a('string'));
		// expect(parseFloat(output.data.longitude)).to.be.a('number');
		// expect(parseFloat(output.data.latitude)).to.be.a('number');
		// });
	});

	describe('Pictures', () => {
		it('Returns an output for a pictures entry in spanish', () => {
			const output = spanishLookup('enviame una foto de la pareja');
			expect(output).to.only.have.keys('category', 'data');
			expect(output.data).to.only.have.keys('captions', 'pictures');
			expect(output.category).to.equal('Pictures');
			expect(output.data.captions).to.be.an('array');
			expect(output.data.pictures).to.be.an('array');
			output.data.captions.map(item => expect(item).to.be.a('string'));
			output.data.pictures.map(item => expect(item).to.be.a('string'));
		});

		// it('Returns an output for a pictures entry in english', () => {
		// 	const output = englishLookup('hello');
		// 	expect(output).to.only.have.keys('category', 'data');
		// 	expect(output.category).to.equal('Vocabulary');
		// 	expect(output.data).to.be.an('array');
		// 	output.data.map(item => expect(item).to.be.a('string'));
		// });
	});
});
