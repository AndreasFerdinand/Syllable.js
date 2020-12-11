
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

      let FirstColor = (typeof configuration.FirstColor === 'undefined') ? '#0000ff' : configuration.FirstColor;
      let SecondColor = (typeof configuration.SecondColor === 'undefined') ? '#ff0000' : configuration.SecondColor;

      let hyphenator = configuration.hyphenator;

      let Separator = (typeof configuration.Separator === 'undefined') ? '•' : configuration.Separator;
      let ExceptionsSeparator = (typeof configuration.ExceptionsSeparator === 'undefined') ? ' ' : configuration.ExceptionsSeparator;


      let exceptionsMap = new Map();

      if ( typeof configuration.Exceptions !== 'undefined' )
      {
        let exceptions = configuration.Exceptions;

        for (let n = 0; n < exceptions.length; n++ )
        {
          let key = exceptions[n].toLowerCase().split(ExceptionsSeparator).join("");
          let value = exceptions[n].toLowerCase().split(ExceptionsSeparator).join(Separator);

          exceptionsMap.set(key,value);
        }
      }

      let Lines = SourceText.split(/\r\n|\r|\n/g);

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

          let Syllables = syllableword.split(Separator);

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

      if (SourceText.slice(-1) !== "\n" && TargetText.slice(-5) === "<br/>")
      {
        TargetText = TargetText.slice(0,-5);
      }

  return TargetText;
}
