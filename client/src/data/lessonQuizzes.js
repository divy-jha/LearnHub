export const lessonQuizzes = {
  'web-development': [
    { question: 'Which technology describes the structure and meaning of a web page?', options: ['CSS', 'HTML', 'JavaScript'], correct: 1, explanation: 'HTML provides the structure and meaning. CSS styles it, while JavaScript adds behavior.' },
    { question: 'Which element is the best fit for the main content of a page?', options: ['<main>', '<span>', '<br>'], correct: 0, explanation: '<main> identifies the central content of the page.' },
    { question: 'Which CSS tool is designed to lay out items along a row or column?', options: ['Flexbox', 'A heading element', 'An event handler'], correct: 0, explanation: 'Flexbox arranges items along a main axis and can wrap them when needed.' },
    { question: 'What lets JavaScript respond when a user clicks a button?', options: ['A margin', 'An event handler', 'A heading'], correct: 1, explanation: 'An event handler runs code in response to an event such as a click.' },
    { question: 'In React, what is state used for?', options: ['Values that change and update the interface', 'Naming CSS files', 'Making a network cable'], correct: 0, explanation: 'React state stores changing values that should trigger an interface update.' },
    { question: 'Which is a useful first step when building a project?', options: ['Add every feature at once', 'Make one core user flow work', 'Polish animations before content'], correct: 1, explanation: 'A small working slice makes it easier to build and improve the rest safely.' },
  ],
  'data-structures': [
    { question: 'How does a single pass over n items usually grow in Big O notation?', options: ['O(1)', 'O(n)', 'O(n²)'], correct: 1, explanation: 'One pass does work proportional to the number of items, so it is O(n).' },
    { question: 'Which structure is useful for looking up a value by a key?', options: ['Hash map', 'Queue', 'Stack'], correct: 0, explanation: 'A hash map associates keys with values for efficient lookup.' },
    { question: 'Which structure removes the oldest item first?', options: ['Stack', 'Queue', 'Tree'], correct: 1, explanation: 'A queue is first-in, first-out, so the oldest item leaves first.' },
    { question: 'In a tree, what is a node’s immediate connected item below it called?', options: ['Child', 'Queue', 'Edge case'], correct: 0, explanation: 'A child is a node directly below another node in the hierarchy.' },
    { question: 'Which graph traversal explores nearby nodes before moving farther away?', options: ['Breadth-first search', 'Depth-first search', 'Binary insertion'], correct: 0, explanation: 'Breadth-first search explores a graph layer by layer.' },
    { question: 'What should you clarify before choosing a problem-solving pattern?', options: ['Input, output, and constraints', 'The color of the code editor', 'The number of comments'], correct: 0, explanation: 'Understanding the input, desired output, and constraints helps select an appropriate approach.' },
  ],
  'machine-learning': [
    { question: 'What does supervised learning use during training?', options: ['Examples with known answers', 'Only random numbers', 'No data'], correct: 0, explanation: 'Supervised learning uses labeled examples that include the expected answer.' },
    { question: 'In a typical dataset, what does a feature describe?', options: ['An attribute of an example', 'The model’s final score only', 'A server address'], correct: 0, explanation: 'A feature is an input attribute that describes a data example.' },
    { question: 'What kind of value does a regression model predict?', options: ['A numeric value', 'Only a category name', 'A graph node'], correct: 0, explanation: 'Regression predicts a number, such as a price or travel time.' },
    { question: 'What is a classification model designed to predict?', options: ['A category or class', 'A CSS layout', 'A continuous distance only'], correct: 0, explanation: 'Classification assigns an example to one of a set of categories.' },
    { question: 'Why keep test examples separate from training examples?', options: ['To estimate performance on unseen data', 'To make the dataset look larger', 'To remove all model errors'], correct: 0, explanation: 'Separate test data gives a more realistic check of how the model handles new examples.' },
    { question: 'What should a responsible project report alongside its model result?', options: ['Data context and limitations', 'Only the best looking number', 'The model’s color'], correct: 0, explanation: 'Context and limitations help people understand where a model may not work well.' },
  ],
}
