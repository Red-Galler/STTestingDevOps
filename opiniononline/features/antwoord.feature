Feature: antwoorden bekijken

    Scenario: admin vraagt de antwoorde van een enquete op.
        Given de admin staat op de enquete pagina van enquete met id: 76
        When admin op de antwoorden pagina klikt
        Then krijgt de admin de antwoorden te zien

    Scenario: respondent voegt een antwoord toe.
        Given admin begeeft zich op antwoord pagina van enquete met id: 76
        When respondent een antwoord toevoegd aan enquete met id: 2
        Then toont het systeem automatisch het nieuwe antwoord bovenaan op de antwoord pagina van enquete met id: 2

    Scenario: respondent wijzigt zijn antwoord.
        Given admin begeeft zich nog steeds op antwoord pagina van enquete met id: 76
        When respondent zijn antwoord met id: 3 wijzigt van “yvan Rooseleer” naar “Rogier van der Linden”
        Then toont het systeem automatisch het bijgewerkt antwoord op de antwoord pagina van enquete met id: 2
