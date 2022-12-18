//action="/api/reviews/{{_id}}" 

$(document).ready(function () {
    var form = $("#add-review-form")
    var reviewTitleInput = $("#reviewTitle"),
        reviewTextInput = $("#reviewText"),
        //fileInput = $('#reviewPhoto')[0];
        ratingInput = $("#ratingSelect"),
        errorLi = $("#errorlist"),
        errorDiv = $("#errorDiv");


    form.submit(function (event) {
        event.preventDefault();
        errorDiv.addClass("hidden");
        errorLi.empty();
        let reviewId = $('.submit-btn').data('review-id');
        var reviewTitle = reviewTitleInput.val().trim();
        var reviewText = reviewTextInput.val().trim();
        var rating = ratingInput.val();
        // flag to keep track of whether the form is valid
        var isValid = true;
        var errorMessage="";

        // // check if a file was selected
        // if (fileInput.files.length > 0) {
        //   // get the selected file
        //   var file = fileInput.files[0];
    
        //   // check if the file's MIME type is an image
        //   if (!file.type.startsWith('image/')) {
        //     isValid = false;
        //     errorMessage="Please select an image file";
        //   }
        // }


        // check if reviewTitle is valid
        if (reviewTitle.length < 2 ) {
            isValid = false;
            errorMessage="Please enter a valid title (at least 2 characters)";

        }

        // check if reviewText is valid
        if (reviewText.length < 2){
            // || !/^[a-zA-Z0-9 ]+$/.test(reviewText)) {
            isValid = false;
            errorMessage="Please enter a valid review (at least 2 characters)";

        }

        // check if rating is valid
        if (rating < 1 || rating > 5) {
            isValid = false;
            errorMessage="Please select a valid rating";

        }

        if (isValid) {
            $.ajax({
                url: '/api/reviews/' + reviewId,
                type: 'POST',
                data: {
                    reviewTitle: reviewTitle,
                    reviewText: reviewText,
                    rating: rating
                  },
                success: function (data) {
                    // handle the response data
                    window.location.href='/api/products/' + data.product_category + '/' + data.product_id;
                },
                error: function (xhr, status, error) {
                    // handle the error
                    errorDiv.removeClass("hidden");
                    errorLi.append($("<li>").text(errorMessage));
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

