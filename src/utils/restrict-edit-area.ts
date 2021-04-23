export function restrictEditArea(value: any) {
    const editable = (() => {
        const regexObjects = {};
        const labels: any[] = [];
        const generateRegexUsing = (label: string, flag = '', consumeSpace = false) => new RegExp((consumeSpace ? '\\^\\s*' : '') + '\\/\\*\\s*(' + label + ')(#([^#]+?))?\\s*(=\\s*([\\S\\s]+?))?\\s*\\*\\/' + (consumeSpace ? '\\s*\\$' + '\\' + '\\n' : ''), 'g');
        return {
            // @ts-ignore
            add: (name: string | number, label: any, regexReplacer: any, {consumeSpace} = {}, flag: any) => {
                // @ts-ignore
                regexObjects[name] = {
                    valueRegex: generateRegexUsing(label, flag),
                    regex: generateRegexUsing(label, flag, consumeSpace),
                    idIndex: 3,
                    fallbackContentIndex: 5,
                    regexReplacer: regexReplacer
                };
                labels.indexOf(label) === -1 && labels.push(label);
                // @ts-ignore
                return regexObjects[name];
            },
            getAll: () => regexObjects,
            getIdReplacerRegex: () => generateRegexUsing(labels.join('|'))
        };
    })();
    // @ts-ignore
    editable.add('singleLine', 'editableArea', '(.*?)');
    editable.add('multiLine', 'multiLineEditableArea', '((^.*?$\\n)*)', {consumeSpace: true}, 'gm');
    const generateRegexFromValue = (string: any, {
        // @ts-ignore
        singleLine,
        // @ts-ignore
        multiLine
    }: {}, idReplacer: RegExp) => {
        let valueToSet = string;
        let regexString = string;
        let map = {};
        let matchCount = 0;
        const regexFor = {
            brackets: /(\(|\)|\{|\}|\[|\])/g,
            newLine: /\n/g,
            blankSpace: /\s/g
        };
        valueToSet = valueToSet.replace(singleLine.valueRegex, '$' + singleLine.fallbackContentIndex);
        valueToSet = valueToSet.replace(multiLine.valueRegex, '$' + multiLine.fallbackContentIndex);
        regexString = regexString.replace(regexFor.brackets, '\\$1'); //! This order matters
        regexString = '^' + regexString.split(regexFor.newLine).join('$\\n^') + '$';
        regexString = regexString.replace(singleLine.regex, singleLine.regexReplacer);
        regexString = regexString.replace(multiLine.regex, multiLine.regexReplacer);
        string.replace(idReplacer, function (...matches: any[]) {
            // @ts-ignore
            map[matchCount++] = matches[3];
        });

        return {
            valueToSet: valueToSet,
            // @ts-ignore
            regexForValidation: new RegExp(regexString, 'm'),
            map: map
        };
    };
    // @ts-ignore
    return generateRegexFromValue(value, editable.getAll(), editable.getIdReplacerRegex());
}
