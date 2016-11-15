% -- База Знаний в виде таблицы
table = cell(2);
table{1,1} = {struct('feature', 'Price', 'value', {'$', '$$', '$$$'}, 'viewvalue', {'$', '$$', '$$$'},'question', 'Please estimate your budget capabilities'); ... 
    struct('feature', 'Type', 'value', {'F', 'Y'}, 'viewvalue', {'Family', 'Friends'}, 'question', 'Do you want to travel with family or hangout with crazy friends?');...
    struct('feature', 'Season', 'value', {'S', 'W'}, 'viewvalue', {'Summer', 'Winter'}, 'question', 'When do you want to have a vacation? Summer or Winter?'); ...
    struct('feature', 'Culture', 'value', {'E', 'W'}, 'viewvalue', {'East', 'West'}, 'question', 'Which culture do you prefer? West or East?')};
table{1,2} = { 1 ,  2,   3 ,  4 ,  5  ,  6  ,  7  ,  8  ,  9  , 10  ,  11  ,  12  , 13;
              '$', '$', '$', '$', '$$', '$$', '$$', '$$', '$$', '$$', '$$$', '$$$', '$$$'; 
              'F', 'F', 'Y', 'Y', 'F' , 'F' , 'F' , 'F' , 'F' , 'Y' , 'Y'  , 'F'  , 'F'  ; 
              'S', 'W', 'S', 'W', 'S' , 'S' , 'W' , 'W' , 'S' , 'W' , 'S'  , 'S'  , 'W'  ; 
              'W', 'W', 'W', 'W', 'W' , 'E' , 'W' , 'E' , 'W' , 'E' , 'W'  , 'W'  , 'E'  ; };
          
table{2,1} = {'Belarus'; 'Poland'; 'Lithuania'; 'Cuba'; 'Greece'; 'Turkey'; 'Austria'; 'Sri-Lanka'; 'Spain'; 'Thailand'; 'USA'; 'France'; 'UAE'};   

table{2,2} = eye(13);
table{2,2}(2,1) = 1; 
table{2,2}(3,1) = 1;
table{2,2}(3,1) = 1;
table{2,2}(2,3) = 1;
table{2,2}(5,9) = 1;
table{2,2}(11,12) = 1;
%  -- База Знаний в виде таблицы
%  -- Алгоритм: Вопрос - Ответ - удаляем не подходящие варианты
[numberOfParams, a ]= size(table{1,1});
knowledge = struct();
for i = 1:numberOfParams
    [b, numberOfAlternatives] = size(table{1,2});
    param = table{1,1}(i,1);
    feature = param{1,1}.feature;
    value = {param{1,1}.value};
    viewvalue = {param{1,1}.viewvalue};
    question = param{1,1}.question;
    answer = value(1, menu(question, viewvalue));
    
    knowledge.(char(feature)) = answer;
    for j = numberOfAlternatives:-1:1
        if (~strcmp(char(table{1,2}(i+1,j)), char(answer)))
            table{1,2}(:, j) = [];
        end
    end       
end

%  -- Алгоритм: Вопрос - Ответ - удаляем не подходящие варианты
%  -- Собираем Результат
[n, m] = size(table{1,2});
if (m == 0)
     msgbox('Please, adjust your requiremnts and try again. We were unable to find you the right tour.', 'Try Again')
    return
end
answerIndexCell = table{1,2}(1,1);
answerIndex = answerIndexCell{1,1};
answer = table{2,2}(:, answerIndex);
[n, m] = size(answer);
result = '';
for i = 1:n
    if answer(i,1) == 1
        tour = table{2,1}(i, 1);
        result = strcat(result, ',', tour);
    end
end

[resultSize, c] = size(result{1,1});
if (strcmp(result, ''))
    msgbox('Please, adjust your requiremnts and try again. We were unable to find you the right tour.', 'Try Again')
else
   msgbox(strcat('Have a great vacation', result), 'Have a great vacation!');
end

%  -- Собираем Результат






