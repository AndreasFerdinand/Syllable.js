
function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

function splittoSyllables(word,exception,Separator)
{
  let syllableword = "";
  let sourceposition = 0;

  for (let i = 0; i < exception.length; i++ )
  {
    if ( exception.charAt(i) == Separator )
    {
      syllableword = syllableword + Separator
    }
    else
    {
      syllableword = syllableword + word.charAt(sourceposition);

      sourceposition = sourceposition + 1;
    }
  }


  return syllableword;
}


function convertText(configuration)
{

      let SourceText = configuration.SourceText;
      let TargetText = "";

      let FirstColor = configuration.FirstColor;
      let SecondColor = configuration.SecondColor;

      let hyphenator = configuration.hyphenator;

      let SourceSeparator = configuration.SourceSeparator;


      let exceptionsMap = new Map();

      let exceptions = configuration.Exceptions;

      for (let n = 0; n < exceptions.length; n++ )
      {
        let key = exceptions[n].toLowerCase().split(SourceSeparator).join("");
        let value = exceptions[n].toLowerCase().split(SourceSeparator).join(Separator);

	exceptionsMap.set(key,value);
      }

      let Lines = SourceText.split("\n");

      for (let n = 0; n < Lines.length; n++ )
      {
        let Words = Lines[n].split(" ");

        for (let i = 0; i < Words.length; i++)
        {
          let currentWord = Words[i];

          let lastchar = currentWord.slice(-1);

          if ( !isLetter(lastchar) )
          {
            currentWord = currentWord.slice(0,-1);
          }
          else
          {
            lastchar = "";
          }

          let syllableword = exceptionsMap.has(currentWord.toLowerCase()) ? splittoSyllables( currentWord, exceptionsMap.get( currentWord.toLowerCase() ), Separator ) : hyphenator( currentWord ) ;

          let Syllables = syllableword.split(configuration.Separator);

          let UseFirstColor = true;

          for (let x = 0; x < Syllables.length; x++ )
          {
            let color = FirstColor;

            color = UseFirstColor ? FirstColor : SecondColor;

            TargetText = TargetText + '<font color="' + color + '">' + Syllables[x] + '</font>';

            UseFirstColor = !UseFirstColor;
          }

          if ( lastchar != "" )
          {
            TargetText = TargetText + '<font color="' + FirstColor + '">' + lastchar + '</font>';
          }

          TargetText = TargetText + " ";
        }

        TargetText = TargetText + "<br/>";
      }

  return TargetText;
}
