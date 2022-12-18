$(document).ready(function () {
  $('.like-btn').click(function () {
    let reviewId = $(this).data('review-id');
    let likeCount = $(this).text().match(/\d+/)[0];
    let dislikeCount = $(this).text().match(/\d+/)[0];
    $.ajax({
      url: '/api/reviews/' + reviewId + '/like',
      type: 'POST',
      success: function (response) {
        console.log('Like count increased successfully');
        // Increment the like count by 1 and update the button text
        likeCount = response.likeCount
        dislikeCount = response.dislikeCount
        $('.like-btn[data-review-id="' + reviewId + '"]').text(`Like (${likeCount})`);
        $('.dislike-btn[data-review-id="' + reviewId + '"]').text(`Dislike (${dislike})`);
      }
    });
  });

  $('.dislike-btn').click(function () {
    let reviewId = $(this).data('review-id');
    let dislikeCount = $(this).text().match(/\d+/)[0];
    let likeCount = $('.like-btn').text().match(/\d+/)[0];

    $.ajax({
      url: '/api/reviews/' + reviewId + '/dislike',
      type: 'POST',
      success: function (response) {
        console.log('Dislike count increased successfully');
        // Increment the dislike count by 1 and update the button text
        let dislike = parseInt(dislikeCount)
        dislike = response.dislikeCount;
        like = response.likeCount;
        $('.dislike-btn[data-review-id="' + reviewId + '"]').text(`Dislike (${dislike})`);
        $('.like-btn[data-review-id="' + reviewId + '"]').text(`Like (${like})`);
      }
    });
  });
});
