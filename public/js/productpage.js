
  // Get a reference to the form and the question list

  var form = document.querySelector('#question-form');
  var questionList = document.querySelector('#question-list');


  form.submit(function (event) {
    // Prevent the form from actually being submitted
    event.preventDefault();
    console.log()
    // Get the value of the question input field
    var question = form.question.value;
    fetch('/addquestion', {
      method: 'POST',
      body: JSON.stringify({ question: question }),
      headers: { 'Content-Type': 'application/json' }
    });
    // Create a new row for the question and answer
    var row = document.createElement('tr');

    // Create a cell for the question and add it to the row
    var questionCell = document.createElement('td');
    questionCell.innerHTML = question;
    row.appendChild(questionCell);

    // Create a cell for the answer and add it to the row
    var answerCell = document.createElement('td');
    row.appendChild(answerCell);

    // Create an answer input field and a submit button
    var answerInput = document.createElement('input');
    answerInput.type = 'text';
    var answerButton = document.createElement('button');
    answerButton.innerHTML = 'Submit';

    // When the answer button is clicked, add the answer to the cell
    answerButton.addEventListener('click', function () {
      // Get the value of the answer input field
      var answer = answerInput.value;
      fetch('/addAnswer', {
        method: 'POST',
        body: JSON.stringify({ answer: answer }),
        headers: { 'Content-Type': 'application/json' }
      });
      // Add the answer to the cell
      answerCell.innerHTML = answer;
    });

    // Add the answer input field and button to the cell
    answerCell.appendChild(answerInput);
    answerCell.appendChild(answerButton);

    // Add the row to the question list
    questionList.appendChild(row);
  });
