$(document).ready(function ($) {
  var compareNav = $("#compare-prods");
  var compareForm = $("#compare-form");
  var compareListInput = $("#compareList");
  compareNav.click(function (event) {
    event.preventDefault();
    console.log("Hello compare");

    let products = localStorage.getItem("comparelist");
    //compareForm.style.visibility = 'hidden';
    var requestConfig = {
      method: "POST",
      url: "/api/products/compare",
      contentType: "application/json",
      data: JSON.stringify({
        products: products,
      }),
    };
    compareListInput.val(JSON.stringify(products));

    compareForm.submit();
  });
})(window.jQuery);
