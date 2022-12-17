

document.getElementById('question-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    var question = document.getElementById('question').value;
    question=question.trim();
    if(!question){
        alert('please enter a question');
        return;
    }
    var xhr = new XMLHttpRequest();
  
    // set the callback function to be executed when the request is complete
    xhr.onload = function() {
      if (xhr.status === 200) {
      } else {
        alert("unable to handle request");
    }
    };
  
    // open a POST request to '/api/qna/id'
    xhr.open('POST', '/api/qna/');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('question=' + encodeURIComponent(question));
  });
  