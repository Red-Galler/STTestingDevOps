Feature: Inlogervaring verbeteren

  Scenario: Verbeterde Inlogervaring
    Given de gebruiker is op de inlogpagina van OpinionOnline
    When de gebruiker zijn of haar inloggegevens correct invult
    Then moet de gebruiker snel en veilig toegang krijgen tot zijn of haar account

  Scenario: Ongeldige inloggegevens 
    Given de gebruiker is op de inlogpagina van OpinionOnline
    When de gebruiker zijn of haar inloggegevens niet correct invult
    Then zal hij een foutmelding te zien krijgen

  Scenario: Bekijken van alle enquetes 
    Given de gebruiker is op de inlogpagina van OpinionOnline
    When de gebruiker zijn of haar inloggegevens correct invult
    Then komt hij op de home pagina en ziet de gebruiker alle enquêtes 


  Scenario: Mobiele Responsiviteit bij Enquêtes Invullen
    Given de gebruiker opent OpinionOnline op een mobiel apparaat
    When de gebruiker probeert een enquête in te vullen
    Then moet de enquête goed weergegeven worden op het mobiele scherm

  Scenario: UI-aanpassingen voor Enquête Creatie
    Given de gebruiker wil een nieuwe enquête maken
    When de gebruiker de enquête-creatie interface gebruikt
    Then moet de interface gebruiksvriendelijk en intuïtief zijn

  Scenario: Status van enquête veranderen 
    Given de gebruiker is op de inlogpagina van OpinionOnline en logt zich met succes in en komt dan terecht op de home pagina
  	When de gebruiker de status van de enquête 295 correct veranderd naar voltooid
    Then is de nieuwe status van de enquête 295 voltooid

  
  Scenario: Voornaam veranderen 
    Given de gebruiker is op de inlogpagina van OpinionOnline en logt zich met succes en navigeert naar de pagina account
    When de gebruiker de naam veranderd
    Then zal de naam succesvol veranderd worden

  Scenario: Titel van een enquete veranderen
    Given de gebruiker is op de inlogpagina van OpinionOnline en logt zich met succes in en komt dan terecht bij de enquête 295
    When de gebruiker de titel van een enquête wilt veranderen
    Then is de titel van de enquête succesvol veranderd 

