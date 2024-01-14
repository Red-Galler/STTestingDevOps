const assert = require('assert');
const { Given, When, Then, AfterAll, After, Status } = require('@cucumber/cucumber');
const { Builder, By, Capabilities, Key } = require('selenium-webdriver');
// const { expect } = require('chai');
require("chromedriver");

// driver setup
const capabilities = Capabilities.chrome();
capabilities.set('chromeOptions', { "w3c": false });
const driver = new Builder().withCapabilities(capabilities).build();

Given('de admin staat op de enquete pagina van enquete met id: {int}', async function (int) {
// given de enquete met id 76 bestaat en antwoorden heeft

	// Write code here that turns the phrase above into concrete actions
	await driver.get('http://localhost:3000');

	await driver.findElement(By.id('email_input')).clear();
	await driver.findElement(By.id('email_input')).sendKeys('manal.moussaoui@student.odisee.be');

	await driver.findElement(By.id('password_input')).clear();
	await driver.findElement(By.id('password_input')).sendKeys('Manal2103');

	await driver.findElement(By.id('submit_btn')).click();

	await driver.get(`http://localhost:3000/Editor/${int}`);

	// await driver.manage().setTimeouts({implicit: 1000});	
	// await driver.findElement(By.id(int)).click;

});

When('admin op de antwoorden pagina klikt', async function () {
	// when de admin zich naar de antwoorden pagina begeeft van enquete met id 76
	await driver.get(`http://localhost:3000/Editor/76/Answers`);
	//or press answers button if redirects to the right page
});


Then('krijgt de admin de antwoorden te zien', function () {
	// Write code here that turns the phrase above into concrete actions
	let answers = driver.findElement(By.className('answers'));
	assert.ok(answers)

});

Given('admin begeeft zich op antwoord pagina van enquete met id: {int}', async function (int) {
// given de enquete met id 76 bestaat

	await driver.get(`http://localhost:3000/Editor/${int}/Answers`);

	// Given('admin begeeft zich op antwoord pagina van enquete met id: {float}', function (float) {
	// Write code here that turns the phrase above into concrete actions
	// return 'pending';
});

When('respondent een antwoord toevoegd aan enquete met id: {int}', function (int) {
		// when de admin zich naar de antwoorden pagina begeeft van enquete met id 76 en de respondent een antwoord toevoegd

	// When('respondent een antwoord toevoegd aan enquete met id: {float}', function (float) {
	// Write code here that turns the phrase above into concrete actions
	return 'pending';
});

Then('toont het systeem automatisch het nieuwe antwoord bovenaan op de antwoord pagina van enquete met id: {int}', function (int) {
	// Then('toont het systeem automatisch het nieuwe antwoord bovenaan op de antwoord pagina van enquete met id: {float}', function (float) {
	// Write code here that turns the phrase above into concrete actions
	return 'pending';
});

Given('admin begeeft zich nog steeds op antwoord pagina van enquete met id: {int}',async function (int) {
	await driver.get(`http://localhost:3000/Editor/${int}/Answers`);

	// Given('admin begeeft zich op antwoord pagina van enquete met id: {float}', function (float) {
	// Write code here that turns the phrase above into concrete actions
	// return 'pending';
});

When('respondent zijn antwoord met id: {int} wijzigt van “yvan Rooseleer” naar “Rogier van der Linden”', function (int) {
	// When('respondent zijn antwoord met id: {float} wijzigt van “yvan Rooseleer” naar “Rogier van der Linden”', function (float) {
	// Write code here that turns the phrase above into concrete actions
	return 'pending';
});

Then('toont het systeem automatisch het bijgewerkt antwoord op de antwoord pagina van enquete met id: {int}', function (int) {
	// Then('toont het systeem automatisch het bijgewerkt antwoord op de antwoord pagina van enquete met id: {float}', function (float) {
	// Write code here that turns the phrase above into concrete actions
	assert.match()
	return 'pending';
});

// After(function (scenario) {
// 	if (scenario.result.status === Status.FAILED) {
// 			var world = this;
// 			return driver.takeScreenshot().then(function(screenShot, error) {
// 					if (!error) {
// 							world.attach(screenShot, "image/png");
// 					}
// 			});
// 	}
// });

AfterAll(async function () {
	await driver.quit();
});