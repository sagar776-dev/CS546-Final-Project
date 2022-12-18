//action="/api/reviews/{{_id}}" 

$(document).ready(function () {
  var form = $("#answer-form")
  var answerInput = $("#answer"),
    errorLi = $("#errorlist"),
    errorDiv = $("#errorDiv");


  form.submit(function (event) {
    event.preventDefault();
    errorDiv.addClass("hidden");
    errorLi.empty();
    let question_id = $('.submit-btn').data('question-id');
    var answer = answerInput.val().trim();

    // flag to keep track of whether the form is valid
    var isValid = true;
    var errorMessage = "";

    // check if answer is valid
    if (answer.length < 2) {
      isValid = false;
      errorMessage = "Please enter a valid answer (at least 2 characters)";

    }

    if (isValid) {
      $.ajax({
        url: '/api/qna/answer/' + question_id,
        type: 'POST',
        data: {
          question_id: question_id,
          answer: answer
        },
        success: function (data) {
          // handle the response data
          window.location.href = '/api/products/' + data.product_category + '/' + data.product_id;
        },
        error: function (xhr, status, error) {
          // handle the error
          errorDiv.removeClass("hidden");
          errorLi.append($("<li>").text(errorMessage, error.error));
        }
      });
    }
    else {
      errorDiv.removeClass("hidden");
      errorLi.append($("<li>").text(errorMessage));
      return;
    }
  });
});

