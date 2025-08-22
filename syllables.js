const SyllableConverter = function(configuration) {
    const defaultTextSplitterRegex = /(?<Word>[\wüäöÜÄÖßẞ]+)|(?<Other>\s|[^\wüäöÜÄÖßẞ]+)/g;

    const m_hyphenator = configuration.hyphenator;
    const m_hyphenatorSeparator = configuration.hyphenatorSeparator || '•';
    const m_exceptionSeparator = configuration.exceptionSeparator || ' ';
    const m_textDecorator = configuration.textDecorator || this;
    const m_textSplitterRegex = configuration.textSplitterRegex || defaultTextSplitterRegex;

    let m_syllableColors = configuration.syllableColors || ["blue", "red"];
    let m_otherColor = configuration.otherColor || "black";

    let m_styleClassNames = configuration.styleClassNames || ["first_syllable", "second_syllable"];

    const m_syllableOutputSeparator = configuration.syllableOutputSeparator || "";

    let m_wordCount = 0;

    const m_exceptionsMap = new Map();

    const separateSyllables = (wordToSplit) => {
        let syllableword = "";
        let sourceposition = 0;
        const exceptionPattern = m_exceptionsMap.get(wordToSplit.toLowerCase());

        for (let i = 0; i < exceptionPattern.length; i++) {
            if (exceptionPattern.charAt(i) === m_hyphenatorSeparator) {
                syllableword += m_hyphenatorSeparator;
            } else {
                syllableword += wordToSplit.charAt(sourceposition);
                sourceposition++;
            }
        }

        return syllableword;
    };

    this.setExceptions = (exceptions) => {
        m_exceptionsMap.clear();

        exceptions.forEach((exception) => {
            const key = exception.toLowerCase().split(m_exceptionSeparator).join("");
            const value = exception.toLowerCase().split(m_exceptionSeparator).join(m_hyphenatorSeparator);

            m_exceptionsMap.set(key, value);
        });
    };

    this.decorateWord = (primarilyWord, syllables) => {
        let syllableCount = 0;
        const htmlChunks = [];

        syllables.forEach((syllable) => {
            const fontColor = m_syllableColors[syllableCount % m_syllableColors.length];
            const styleClassName = m_styleClassNames[syllableCount % m_syllableColors.length];

            const syllableHTML = m_textDecorator.decorateSyllable(syllable, fontColor, styleClassName, syllableCount);
            htmlChunks.push(syllableHTML);

            syllableCount++;
        });

        return htmlChunks.join(m_syllableOutputSeparator);
    };

    this.decorateSyllable = (syllable, fontColor, styleClassName, index) => {
        return `<font color="${fontColor}" class="${styleClassName}">${syllable}</font>`;
    };

    this.decorateOther = (other) => {
        const pattern = /[\n\r\s]+/;

        if (pattern.test(other)) {
            return other;
        } else {
            return `<font color="${m_otherColor}">${other}</font>`;
        }
    };

    this.setSyllableColors = (colors = ["red", "blue"]) => {
        m_syllableColors = colors;
    };

    this.setOtherColor = (color) => {
        m_otherColor = color;
    };

    this.setStyleClassNames = (styleClassNames = ["first_syllable", "second_syllable"]) => {
        m_styleClassNames = styleClassNames;
    };

    this.setSyllableOutputSeparator = (syllableOutputSeparator = "") => {
        m_syllableOutputSeparator = syllableOutputSeparator;
    };

    this.convertText = (text) => {
        let htmlChunk = "";
        m_wordCount = 0;

        for (const match of text.matchAll(m_textSplitterRegex)) {
            if (match.groups.Word) {
                const currentWord = match.groups.Word;
                let separatedWord = "";

                if (m_exceptionsMap.has(currentWord.toLowerCase())) {
                    separatedWord = separateSyllables(currentWord);
                } else {
                    separatedWord = m_hyphenator(currentWord);
                }

                htmlChunk += m_textDecorator.decorateWord(currentWord, separatedWord.split(m_hyphenatorSeparator));
                m_wordCount++;
            }

            if (match.groups.Other) {
                htmlChunk += m_textDecorator.decorateOther(match.groups.Other);
            }
        }

        return htmlChunk;
    };

    this.getWordCount = () => {
        return m_wordCount;
    };

    this.setExceptions(configuration.exceptions || []);
};

module.exports = SyllableConverter;