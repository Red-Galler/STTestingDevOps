/* eslint-disable no-undef */
const { Given, When, Then, AfterAll } = require('@cucumber/cucumber');
const { Builder, By, Capabilities, until } = require('selenium-webdriver');
require('chromedriver');

// Assume you have already set up the driver globally or in a Before hook

// Stel de browser driver in
const driver = new Builder().forBrowser('chrome').build();

Given('de gebruiker maakt een nieuwe enquête', async function () {

    //await driver.get('http://localhost:3000/Editor/313');

    //await driver.findElement(By.css('.text-5xl.rounded-2xl.p-4.dark\\:text-dark-text.z-10.hover\\:bg-gray-normal.text-gray-darker.dark\\:text-dark-text.dark\\:hover\\:bg-dark-third.hover\\:text-primary-normal.p-2.rounded-md')).click();


    await driver.get('http://localhost:3000');
    const emailInputLocator = By.css('#email_input');
    const passwordInputLocator = By.css('#password_input');
  
    const emailInput = await driver.wait(until.elementLocated(emailInputLocator), 10000);
    await driver.wait(until.elementIsVisible(emailInput), 10000);
    await emailInput.sendKeys('manal.moussaoui@student.odisee.be');
  
    const passwordInput = await driver.wait(until.elementLocated(passwordInputLocator), 10000);
    await driver.wait(until.elementIsVisible(passwordInput), 10000);
    await passwordInput.sendKeys('Manal2103');
  
    await driver.findElement(By.id('submit_btn')).click();
  
    const editorPageElementLocator = By.id('statusPickerDropdown'); 
    await driver.wait(until.elementLocated(editorPageElementLocator), 20000);
    await driver.get('http://localhost:3000/Editor/314');
});


When('de gebruiker verschillende vraagtypen toevoegt, zoals multiple-choice en open vragen en weergeven', async function () {

   // const naamloosInput = await driver.findElement(By.xpath('//input[@value="naamloos"]'));
    //await naamloosInput.sendKeys('test');

   // const naamlozeSectieInput = await driver.findElement(By.xpath('//input[@value="Naamloze sectie"]'));
   // await naamlozeSectieInput.sendKeys('test');

    //const beschrijvingInput = await driver.findElement(By.xpath('//input[@placeholder="Beschrijving"]'));
    //await beschrijvingInput.sendKeys('test');

    //const VraagInput = await driver.findElement(By.xpath('//input[@placeholder="Uw vraag"]'));
    //await VraagInput.sendKeys('test');

    const inputElement = await driver.findElement(By.id('titleElement'));
    await inputElement.sendKeys('Test');

  });
  

  Then('moet de gebruiker de enquête kunnen opslaan en weergeven', async function () {

    const saveButton = await driver.findElement(By.css('.w-20.h-full.p-2.cursor-pointer'));
    await saveButton.click();
  
  });