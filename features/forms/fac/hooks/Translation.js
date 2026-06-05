(function () {
    'use strict';

    var event = [
        'app.record.edit.show'
    ]

    kintone.events.on(event, main);

    // Transliterate
    var Script_Russian = 'cyrl';
    var Script_Hebrew = 'hebr';
    var Script_English = 'latn';
    var Lang_Russian = 'ru';
    var Lang_Hebrew = 'he';
    var Lang_English = 'en';

    var options = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': azureSubscriptionKey,
        'Ocp-Apim-Subscription-Region': azureRegion,
        'ClientTraceId': azureClientTraceId
    };

    const TranslateFields = ["returning", "introduction", "aboutSchool", "personalLife", "future", "scholarship", "family", "brothers", "sisters", "isfrom",
        "languageAtHome", "aboutFamily", "favoriteSubject", "challengingSubject", "aboutMyTeacher", "aboutMeFromTeacher", "nickname", "favoriteColor", "favoriteFood",
        "hobbies", "interests", "makesMeSad", "loveMost", "futureDreams", "familySituation", "schoolSituation", "relationship"];

    const TransliterateFields = ["firstName", "lastName", "submittedBy"];



    function main(event) {

        var myIndexButton = createButton('myIndexButton');
        var promiseArray = [];

        myIndexButton.onclick = () => {
            checkLanguage();

            Promise.allSettled(promiseArray)
                .then((result) => {
                    console.log(result);
                });
        };



        function checkLanguage() {
            var record = kintone.app.record.get();
            var textLanguage = record.record['submitLang'].value;
            var fromScript;
            var language;

            if (textLanguage == 'Hebrew') {
                fromScript = Script_Hebrew;
                language = Lang_Hebrew;
            }
            else if (textLanguage == 'Russian') {
                fromScript = Script_Russian;
                language = Lang_Russian;
            }
            else { }

            checkTextFields(fromScript, language);
        }

        function checkTextFields(fromScript, language) {
            var record = kintone.app.record.get();
            var textField = Object.keys(record.record).map(function (key) { return [(key)]; });

            var consoleTrans = []; // for console
            var consoleTransliterate = []; // for console

            textField.forEach(async function (textField) {
                textField = textField[0];
                var translatedText;
                var toLang = Script_English;
                var toEng = Lang_English;

                // Check if text field is in the TransliterateFields
                if (TransliterateFields.includes(textField)) {

                    var dict = record.record[textField].value;
                    if (dict) {
                        consoleTransliterate.push(textField); // for console
                        promiseArray.push(aaa(record, fromScript, language, toLang, dict))
                    }
                }

                async function aaa(record, fromScript, language, toLang, dict) {
                    record.record[textField].value = await transliterate(fromScript, language, toLang, dict);
                    kintone.app.record.set(record);
                    return ('original: ' + dict + '| result: ' + record.record[textField].value); // console
                }

                // Check if... TranslateFields
                if (TranslateFields.includes(textField)) {

                    dict = record.record[textField].value;
                    if (dict) {
                        consoleTrans.push(textField); // for console
                        promiseArray.push(bbb(record, toEng, dict))
                    }
                }

                async function bbb(record, toEng, dict) {
                    record.record[textField].value = await translate(toEng, dict);
                    kintone.app.record.set(record);
                    return ('original: ' + dict + '| result: ' + record.record[textField].value); // console
                }
            })

            // console output: translated fields list
            console.log("◆translate fields: " + consoleTrans);
            console.log("◆transliterate fields: " + consoleTransliterate);
        }



        // Transliterate
        function transliterate(fromScript, language, toScript, dict) {
            var transDict = [{ "text": dict }];

            return new kintone.Promise(function (resolve, reject) {
                return kintone.proxy(
                    azureTransliterateUrl + '&fromScript=' + fromScript + '&language=' + language + '&toScript=' + toScript,
                    'POST',
                    options,
                    JSON.stringify(transDict),
                    //success callback
                    function (res) {
                        resolve(res);
                    },
                    //error callback
                    function (error) {
                        console.log(error);
                    }
                );

            }).then((res) => {
                var transliterateResponse = JSON.parse(res)[0].text;
                //console.log(transliterateResponse);
                return transliterateResponse;
            });
        }


        // Translate
        function translate(toLang, dict) {
            var translateDict = [{ "text": dict }];

            return new kintone.Promise(function (resolve, reject) {
                return kintone.proxy(
                    azureTranslateUrl + '&to=' + toLang,
                    'POST',
                    options,
                    JSON.stringify(translateDict),
                    // success callback
                    function (res) {
                        var detectedLanguage = JSON.parse(res)[0].detectedLanguage.language;
                        if (detectedLanguage == 'en') {
                            reject("Not translated: " + dict);
                        }
                        else {
                            var translateResponse = JSON.parse(res)[0].translations[0].text;
                            resolve(translateResponse);
                        }
                    },
                    // error callback
                    function (error) {
                        console.log(error);
                    }
                );
            }).then((res) => {
                return res;
            });
        }


        return event;
    }
})();





function createButton(button) {
    button = document.createElement('button');
    button.id = 'translateButton';
    button.innerText = 'Translate All';
    button.style.fontSize = '20px';
    button.style.marginLeft = '10px';
    button.style.marginTop = '30px';

    kintone.app.record.getHeaderMenuSpaceElement().appendChild(button);
    return button;
}
