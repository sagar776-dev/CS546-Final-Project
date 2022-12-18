//action="/api/reviews/{{_id}}" 

$(document).ready(function () {
  var form = $("#question-form")
  var questionInput = $("#question"),
    errorLi = $("#errorlist"),
    errorDiv = $("#errorDiv");


  form.submit(function (event) {
    event.preventDefault();
    errorDiv.addClass("hidden");
    errorLi.empty();
    let product_id = $('.submit-btn').data('product-id');
    var question = questionInput.val().trim();

    // flag to keep track of whether the form is valid
    var isValid = true;
    var errorMessage = "";

    // check if question is valid
    if (question.length < 2) {
      isValid = false;
      errorMessage = "Please enter a valid question (at least 2 characters)";

    }

    if (isValid) {
      $.ajax({
        url: '/api/qna/' + product_id,
        type: 'POST',
        data: {
          product_id: product_id,
          question: question
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

