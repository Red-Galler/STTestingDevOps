const { Given, When, Then, AfterAll } = require('@cucumber/cucumber');
const { Builder, By, Capabilities, until } = require('selenium-webdriver');
require('chromedriver');
const { setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(60 * 1000); // Zet de timeout op 60 seconden



// Stel de browser driver in
const driver = new Builder().forBrowser('chrome').build();

// Scenario 1: Verbeterde Inlogervaring
Given('de gebruiker is op de inlogpagina van OpinionOnline', async function () {
  await driver.get('http://localhost:3000/login');
});

When('de gebruiker zijn of haar inloggegevens correct invult', async function () {
  const emailInputLocator = By.css('#email_input'); // Selector gebaseerd op de id van het e-mail inputveld
  const passwordInputLocator = By.css('#password_input'); // Selector gebaseerd op de id van het wachtwoord inputveld

  // Wacht tot het e-mailveld aanwezig en zichtbaar is
  const emailInput = await driver.wait(until.elementLocated(emailInputLocator), 10000);
  await driver.wait(until.elementIsVisible(emailInput), 10000);
  await emailInput.sendKeys('manal.moussaoui@student.odisee.be');

  // Wacht tot het wachtwoordveld aanwezig en zichtbaar is
  const passwordInput = await driver.wait(until.elementLocated(passwordInputLocator), 10000);
  await driver.wait(until.elementIsVisible(passwordInput), 10000);
  await passwordInput.sendKeys('Manal2103');
});

Then('moet de gebruiker snel en veilig toegang krijgen tot zijn of haar account', async function () {
  await driver.findElement(By.id('submit_btn')).click();
  await driver.get('http://localhost:3000/Account');
});

//Scenario : Ongeldige inloggegevens 
When('de gebruiker zijn of haar inloggegevens niet correct invult', async function () {
  const emailInputLocator = By.css('#email_input'); // Selector gebaseerd op de id van het e-mail inputveld
  const passwordInputLocator = By.css('#password_input'); // Selector gebaseerd op de id van het wachtwoord inputveld

  // Wacht tot het e-mailveld aanwezig en zichtbaar is
  const emailInput = await driver.wait(until.elementLocated(emailInputLocator), 10000);
  await driver.wait(until.elementIsVisible(emailInput), 10000);
  await emailInput.sendKeys('manal.moussaoui@student.odisee.be');

  // Wacht tot het wachtwoordveld aanwezig en zichtbaar is
  const passwordInput = await driver.wait(until.elementLocated(passwordInputLocator), 10000);
  await driver.wait(until.elementIsVisible(passwordInput), 10000);
  await passwordInput.sendKeys('Manal2003');
  await driver.findElement(By.id('submit_btn')).click();

});

Then('zal hij een foutmelding te zien krijgen', async function () {
  // Zoek naar het element met de foutmelding met de class 'text-red-400'
  const errorMessage = await driver.wait(until.elementLocated(By.css('.text-red-400')), 10000);
  const isDisplayed = await errorMessage.isDisplayed();

});

// Scenario: Bekijken van alle enquetes 
Then('komt hij op de home pagina en ziet de gebruiker alle enquêtes', async function () {
  await driver.get('http://localhost:3000');

});
// Scenario 2: Mobiele Responsiviteit bij Enquêtes Invullen
Given('de gebruiker opent OpinionOnline op een mobiel apparaat', async function () {
  await driver.manage().window().setRect({ width: 375, height: 667 });
  await driver.get('http://localhost:3000/');
});
 
When('de gebruiker probeert een enquête in te vullen', async function () {
  // Vind de enquête op de pagina.
  await driver.get('http://localhost:3000/Preview/76');
 
 
  // Vul de enquête in. Bijvoorbeeld, vul een tekstveld in en selecteer een keuze.
});
 
Then('moet de enquête goed weergegeven worden op het mobiele scherm', async function () {
  await driver.get('http://localhost:3000/Preview/76');

  // Wacht tot een bekend element dat aangeeft dat de enquête is geladen zichtbaar is.
  const bekendElement = await driver.findElement(By.tagName('h1')); 
  const isVisible = await bekendElement.isDisplayed();

  if (!isVisible) {
    throw new Error('De enquête wordt niet correct weergegeven op het mobiele scherm.');
  }
});




 
 
// Scenario 3: UI-aanpassingen voor Enquête Creatie
Given('de gebruiker wil een nieuwe enquête maken', async function () {
  await driver.get('http://localhost:3000/login');
  const emailInputLocator = By.css('#email_input'); // Selector gebaseerd op de id van het e-mail inputveld
  const passwordInputLocator = By.css('#password_input'); // Selector gebaseerd op de id van het wachtwoord inputveld

  // Wacht tot het e-mailveld aanwezig en zichtbaar is
  const emailInput = await driver.wait(until.elementLocated(emailInputLocator), 10000);
  await driver.wait(until.elementIsVisible(emailInput), 10000);
  await emailInput.sendKeys('manal.moussaoui@student.odisee.be');

  // Wacht tot het wachtwoordveld aanwezig en zichtbaar is
  const passwordInput = await driver.wait(until.elementLocated(passwordInputLocator), 10000);
  await driver.wait(until.elementIsVisible(passwordInput), 10000);
  await passwordInput.sendKeys('Manal2103');
  await driver.findElement(By.id('submit_btn')).click();
  await driver.get('http://localhost:3000/Editor/273');
});
When('de gebruiker de enquête-creatie interface gebruikt', async function () {
    // Wachten op en klikken op de titel
   // const titleElement = await driver.findElement(By.id('titleElement'));
    //await titleElement.click();

    // Wachten op en klikken op de vetgedrukte knop voor de titel
   // const boldButton = await driver.findElement(By.id('boldButton'));
   // await boldButton.click();
 
});



Then('moet de interface gebruiksvriendelijk en intuïtief zijn', async function () {
  //const boldButton = await driver.wait(until.elementLocated(By.id('boldButton')), 10000);
  //await driver.wait(until.elementIsVisible(boldButton), 10000);
 // await boldButton.click();
});




//Scenario: Status van enquête veranderen 

Given('de gebruiker is op de inlogpagina van OpinionOnline en logt zich met succes in en komt dan terecht op de home pagina', async function () {
  await driver.get('http://localhost:3000');
  const emailInputLocator = By.css('#email_input'); // Selector gebaseerd op de id van het e-mail inputveld
  const passwordInputLocator = By.css('#password_input'); // Selector gebaseerd op de id van het wachtwoord inputveld

  // Wacht tot het e-mailveld aanwezig en zichtbaar is
  const emailInput = await driver.wait(until.elementLocated(emailInputLocator), 10000);
  await driver.wait(until.elementIsVisible(emailInput), 10000);
  await emailInput.sendKeys('manal.moussaoui@student.odisee.be');

  // Wacht tot het wachtwoordveld aanwezig en zichtbaar is
  const passwordInput = await driver.wait(until.elementLocated(passwordInputLocator), 10000);
  await driver.wait(until.elementIsVisible(passwordInput), 10000);
  await passwordInput.sendKeys('Manal2103');
  await driver.findElement(By.id('submit_btn')).click();

 
  

});
 
When('de gebruiker de status van de enquête 295 correct veranderd naar voltooid', async function () {

  // Zoek en klik op de knop om het keuzemenu te openen
 // const revealDropdownButton = await driver.wait(until.elementLocated(By.css('button.relative.m-2')));
  //await revealDropdownButton.click();
  
  // Wacht op het pijlelement in het keuzemenu
  //const arrowElement = await driver.wait(until.elementLocated(By.css('button.relative.m-2 svg')), 10000);
 // await arrowElement.click();

  // Wacht tot het statusPickerDropdown-element zichtbaar is na de bovenstaande actie
  //const statusPickerDropdown = await driver.wait(until.elementIsVisible(driver.findElement(By.id('statusPickerDropdown'))), 10000);

  // Klik op het keuzemenu om de opties weer te geven
 // await statusPickerDropdown.click();

  // Wacht tot de 'voltooid' statusoptie klikbaar is
  //const completedStatusOption = await driver.wait(until.elementIsVisible(driver.findElement(By.id('statusOption-3'))), 10000);
 // await completedStatusOption.click();
});


Then('is de nieuwe status van de enquête 295 voltooid', async function () {
  // Verifieer dat de geselecteerde status nu 'Voltooid' is
  //const selectedStatus = await driver.findElement(By.css('div > ul .selected')); // Aangepaste selector voor geselecteerde status
 // const statusText = await selectedStatus.getText();
 // assert.equal(statusText, 'Voltooid', 'De status van de enquête is niet correct bijgewerkt naar Voltooid');
});





//  Scenario: Titel van een enquete veranderen

Given('de gebruiker is op de inlogpagina van OpinionOnline en logt zich met succes in en komt dan terecht bij de enquête 295', async function () {
  await driver.get('http://localhost:3000');
  //const emailInputLocator = By.css('#email_input');
  //const passwordInputLocator = By.css('#password_input');

  //const emailInput = await driver.wait(until.elementLocated(emailInputLocator), 15000);
 // await driver.wait(until.elementIsVisible(emailInput), 10000);
  //await emailInput.sendKeys('manal.moussaoui@student.odisee.be');

  //const passwordInput = await driver.wait(until.elementLocated(passwordInputLocator), 10000);
  //await driver.wait(until.elementIsVisible(passwordInput), 10000);
  //await passwordInput.sendKeys('Manal2103');

 // await driver.findElement(By.id('submit_btn')).click();

  //const editorPageElementLocator = By.id('statusPickerDropdown'); // Replace with an actual ID of an element unique to the editor page
  //await driver.wait(until.elementLocated(editorPageElementLocator), 20000);
  
});

const { Key } = require('selenium-webdriver');


When('de gebruiker de titel van een enquête wilt veranderen', async function () {
  // Wait to ensure any redirects after login are complete or the session is established
  
  // Now navigate to the editor page
  await driver.get('http://localhost:3000/Editor/295');


  let titleElement = await driver.wait(until.elementLocated(By.id('titleElement')), 10000);

    // Wait until the element is visible (the element is not only present but also has a non-zero size)
   await driver.wait(until.elementIsVisible(titleElement), 10000);

    // Now interact with the element, for example, click it or send some keys
    // Example: Clear the element and type a new title
    //await titleElement.clear();
    //await titleElement.sendKeys('New Survey Title');

  // Perform actions with the title element here
 
 // Haal de huidige tekst op
    let currentText = await titleElement.getAttribute('value');

    // Wis de huidige tekst door deze te vervangen door een lege string
    await titleElement.clear();

    // Voer nieuwe gegevens in
    await titleElement.sendKeys('TEST VAN STATUS');
});

Then('is de titel van de enquête succesvol veranderd', async function () {

  let titleElement = await driver.wait(until.elementLocated(By.id('titleElement')), 10000);

  // Wacht tot het element weer zichtbaar is na het wijzigen van de titel
  await driver.wait(until.elementIsVisible(titleElement), 10000);

  // Haal de nieuwe tekst op
  let newText = await titleElement.getAttribute('value');

  // Verifieer of de tekst succesvol is gewijzigd
  if (newText === 'TEST VAN STATUS') {
    console.log('De enquêtetitel is succesvol veranderd.');
  } else {
    console.log('Fout: De enquêtetitel is niet succesvol veranderd.');
  }
});


//  Scenario: Voornaam veranderen 
Given('de gebruiker is op de inlogpagina van OpinionOnline en logt zich met succes en navigeert naar de pagina account', async function () {
  // Implementeer hier de code om in te loggen en naar de accountpagina te navigeren
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
  await driver.get('http://localhost:3000/Account');


});

When('de gebruiker de naam veranderd', async function () {
  // Zoek het inputveld met id "voornaam"
  const naamInput = await driver.findElement(By.id('voornaam'));

  // Wacht tot het inputveld zichtbaar is
  await driver.wait(until.elementIsVisible(naamInput), 10000);

  // Vervang de waarde van het inputveld door "NEL"
  await naamInput.clear();
  await naamInput.sendKeys('NEL');
});

const assert = require('assert'); 

Then('zal de naam succesvol veranderd worden', async function () {
  // Wacht een korte periode om ervoor te zorgen dat de wijzigingen zijn toegepast (pas dit indien nodig aan)
  await driver.sleep(1000);

  // Zoek het inputveld met id "voornaam"
  const naamInput = await driver.findElement(By.id('voornaam'));

  // Verkrijg de waarde van het inputveld
  const nieuweNaam = await naamInput.getAttribute('value');

  // Voer verificaties uit om te controleren of de naam succesvol is gewijzigd
  assert.strictEqual(nieuweNaam, 'NEL', 'De naam is niet succesvol gewijzigd');
});









// Optioneel: Sluit de browser na alle tests
AfterAll(async function () {
 await driver.quit();
});

