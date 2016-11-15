'use strict';
const fs = require('fs');

const features = JSON.parse(fs.readFileSync('./data/features.json'));
let rules = JSON.parse(fs.readFileSync('./data/rules.1.json'));
//let rules = JSON.parse(fs.readFileSync('./data/rules.json'));

const needsChecking = features.reduce((prev, curr) => {
    if (curr.needsChecking) {
        prev[curr.name] = curr.needsChecking;
    }
    return prev;
}, {});


/* facts we know */
const knowledge = {

};

/* user's answer */
const answer = {
    'culture': 'Западная',
    'sights': true,
    'sea': true,
    'season': 'Лето',
    'nightlife': true,
    'family': false,
    'price': '$$$',
    'visa': 'Да'
};

const noQuestions = [
    'tour',
    'type'
];

const target = 'tour';
let targetStack = [target];
let result;

while (!result) {
    const currentTarget = targetStack[targetStack.length - 1];
    const rule = rules.find((rule) =>
        !rule.skip && (rule.then.feature === currentTarget));
    if (rule) {
        const checkResult = checkRule(rule.if);
        switch (checkResult) {
            case true:
                knowledge[targetStack.pop()] = rule.then.value;
                if (targetStack.length === 0) {
                    result = true;
                } else {
                    rules = rules.filter((_rule) => _rule !== rule);
                    resetSkip();
                }
            break;

            case false:
                rules = rules.filter((_rule) => _rule !== rule);
            break;

            default:
                if (checkResult.feature === currentTarget) {
                    rule.skip = true;
                }

                if (needsChecking[checkResult.feature]) {
                    for (let i = 0; i < needsChecking[checkResult.feature]; i++) {
                         targetStack.push(checkResult.feature);
                    }
                } else {
                    targetStack.push(checkResult.feature);
                }
            break;
        }
    } else {
        const question = targetStack.pop();
        if (noQuestions.indexOf(question) === -1) {
            const value = answer[question];
            knowledge[question] = value;
        } else {
            if (question !== target) {
                knowledge[question] = knowledge[question] || false;
                resetSkip();
            } else {
                result = true;
            }
        }
    }
}

if (knowledge[target]) {
    console.log('Result: ', knowledge[target]);
} else {
    console.log('NOOOOO');
    console.log(knowledge);
}


function checkRule(conditions) {
    for (let i = 0; i < conditions.length; i++) {
        const feature = conditions[i].feature;
        if (Object.keys(knowledge).indexOf(feature) !== -1 ) {
            /* this key is in knowledge */
            if (conditions[i].value !== knowledge[feature]) {
                return false;
            }
        } else {
            return conditions[i];
        }
    }

    return true;
}

function resetSkip() {
    rules.forEach((rule) => {
        rule.skip = false;
    });
}

