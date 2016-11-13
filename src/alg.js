import features from '../data/features.json';
import _rules from '../data/rules.json';

let rules = _rules;

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

function startAlg(question, answer) {
    if (question) {
        knowledge[question] = answer;
    }

    while (!result) {
        const currentTarget = targetStack[targetStack.length - 1];
        const rule = rules.find((rule) =>
            (rule.then.feature === currentTarget));
        if (rule) {
            const checkResult = checkRule(rule.if);
            switch (checkResult) {
                case true:
                    knowledge[targetStack.pop()] = rule.then.value;
                    if (targetStack.length === 0) {
                        result = true;
                    } else {
                        rules = rules.filter((_rule) => _rule !== rule);
                    }
                    break;

                case false:
                    rules = rules.filter((_rule) => _rule !== rule);
                    break;

                default:
                    targetStack.push(checkResult.feature);
                    break;
            }
        } else {
            const question = targetStack.pop();
            if (noQuestions.indexOf(question) === -1) {
                /*
                const value = answer[question];
                knowledge[question] = value;
                */

                /* return new question */
                return {
                    finished: false,
                    question,
                    feature: features.find((feature) => feature.name === question)
                };
            } else {
                if (question !== target) {
                    knowledge[question] = knowledge[question] || false;
                } else {
                    result = true;
                }
            }
        }
    }

    if (knowledge[target]) {
        console.log('Result: ', knowledge[target]);
        return {
            isFinished: true,
            result: knowledge[target]
        };
    } else {
        return {isFinished: true};
    }
}

export function alg(q, a) {
    return startAlg(q, a);
}

function checkRule(conditions) {
    for (let i = 0; i < conditions.length; i++) {
        const feature = conditions[i].feature;
        if (Object.keys(knowledge).indexOf(feature) !== -1) {
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


