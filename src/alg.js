import features from '../data/features.json';
import _rules from '../data/rules.json';
import deepcopy from 'deepcopy';

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
let step = 0;
const logs = [];
let rule;
let currentTarget;

function startAlg(question, answer) {
    if (question) {
        knowledge[question] = answer;
        log('Задаем вопрос: ' + question + ', получаем ответ: ' + answer);
    }

    while (!result) {
        step++;
        currentTarget = targetStack[targetStack.length - 1];
        rule = rules.find((rule) =>
            (rule.then.feature === currentTarget));
        if (rule) {
            const checkResult = checkRule(rule.if);
            switch (checkResult) {
                case true:
                    knowledge[targetStack.pop()] = rule.then.value;
                    if (targetStack.length === 0) {
                        log('Нашли ответ: ' + rule.then.value);
                        result = true;
                    } else {
                        log('Правило подходит! Принимаем правило: ', rule.then.value);
                        rules = rules.filter((_rule) => _rule !== rule);
                    }
                    break;

                case false:
                    log('Правило не подходит! Отбрасываем правило');
                    rules = rules.filter((_rule) => _rule !== rule);
                    break;

                default:
                    log('Не получается оценить истинность правила, добавляем новый признак в стек: ' + checkResult.feature);
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
                    log('Не смогли найти правило, результат не может быть получен');
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
        return { isFinished: true };
    }

    function log(message) {
        logs.push(deepcopy({
            step,
            rule,
            knowledge,
            targetStack,
            currentTarget,
            message
        }));
    }
}

export function alg(q, a) {
    return startAlg(q, a);
}

export function getLogs() {
    return logs;
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


