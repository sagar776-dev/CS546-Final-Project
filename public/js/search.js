$(document).ready(function () {
    $("#searchInput").keyup(function () {
        let searchString = $(this).val();
        searchString = (encodeURIComponent(searchString));
    });
});