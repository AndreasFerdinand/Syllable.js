# Syllable.js
This project was created during the [coronavirus pandemic](https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic) when schools were closed. The aim of the project was the creation of new web application where children can enhance their reading skills using the Syllable-Method.

## Install
Download the latest release of [Hyphenopoly](https://github.com/mnater/Hyphenopoly). You need the follwoing files/directories:

* hyphenopoly.module.js
* Hyphenopoly.js
* Hyphenopoly_Loader.js
* patterns/LANGUAGE.wasm

Replace LANGUAGE with the language you actually need. Additionally you need the latest release of Syllable.js.

## Usage
First you have to load and initialize Hyphenopoly.
```HTML
<script>
var Separator = "•";

var Hyphenopoly = {
  "require": {
    "de": "FORCEHYPHENOPOLY"
  },
  "setup": {
    "exceptions": { "global" : ""},
    "selectors": {
      ".hyphenate": {
        "hyphen": Separator,
        "minWordLength": 3
      }
    }
  }
}
</script>
<script src="./Hyphenopoly_Loader.js"></script>
```

Then you can use Syllable.js:
```HTML
<script src="./syllables.js"></script>
<script>
...
    Hyphenopoly.hyphenators["en"].then((hyphenator) => {

      let SyllableConfig = {
        Separator: Separator,
        SourceSeparator: " ",
        SourceText : "Some Source Text",
        FirstColor : "blue",
        SecondColor : "red",
        Exceptions : [ "S o m e" ],
        hyphenator : hyphenator
      };

      let SyllableText = convertText( SyllableConfig );

    });
...
</script>
```