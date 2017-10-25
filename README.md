# Privacy tool
De privacytool is een eenvoudige webapplicatie die helpt bij het maken van een eerste inschatting van de geoorloofdheid van een voorgenomen nieuw gebruik, waaronder het koppelen, van reeds (rechtmatig) verzamelde persoonsgegevens door overheidsorganisaties.

## Live versie
Zie http://privacy.locatielab.nl/ voor de huidige (productie) versie.

## Hergebruik broncode en content
De broncode en gebruikte content zijn respectievelijk beschikbaar onder [een open source en creative commons](LICENSE.md).

De broncode bestaat uit:
* HTML, CSS en Javascript voor de behandeling van de vragen en tonen van de resultaten
* 2 eenvoudige PHP scripts voor uploaden/downloaden van de resultaten in CSV
* een Python script voor het omzetten van de oorspronkelijke vragen uit de spreadsheet naar HTML

## Feedback en issues
Inhoudelijke feedback kan gegeven worden via: [de website van Geonovumm](http://www.geonovum.nl/feedback-privacytool).

Bugs en technische suggesties kunnen via de [GitHub issues](https://github.com/Geonovum/privacytool/issues) gemeld worden.

## Opslaan van antwoorden in CSV bestand
### CSV formaat
Voor het (tussentijds) opslaan van de input van de gebruiker (antwoorden en notities) is een eenvoudig CSV formaat in gebruik:

```
{HTML id van formulier veld},{type form veld},{waarde van form veld}
```

Voorbeeld gegevens:

```
"voorvragen-A","radio","ja"
"voorvragen-B","radio","ja"
...
"voorvragen-H","radio","ja"
"intakevragen-A","textarea","lorum ipsum etc"
"intakevragen-B","textarea",".. dolor sit amet, consectetur adipiscing elit ..."
...
"intakevragen-F","textarea","...mollit anim id est laborum."
"onverenigbaarheid-1-notes","textarea","lorum ipsum etc"
"onverenigbaarheid-2-notes","textarea",""
```
Met Javascript functies worden de gegeven antwoorden in het CSV formaat gezet. Via een PHP script worden deze CSV data in een bestand gezet, on-the-fly. Er vindt geen opslag op de server plaats van deze data of het bestand.

### Verwerking upload van antwoorden
Bij uploaden van CSV geformatteerde antwoorden worden de waardes via Javascript weer geladen in het formulier. Let op dat de inputvelden en ids/names een vast patroon gebruiken. Zie de HTML code voor het HTML patroon bij de form input velden dat nodig is voor goede verwerking.
