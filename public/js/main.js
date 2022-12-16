$(document).ready(function ($) {
  var compareNav = $("#compare-prods");
  var compareForm = $("#compare-form");
  var compareListInput = $("#compareList");
  var resetcomparelistbtn = $("#resetlist");

  var compareDiv = $("#compareDiv");
  var compareDivRow = $("#compareDivRow");

  function onLoad(event) {
    console.log("onload");
    var comparelist = JSON.parse(localStorage.getItem("comparelist"));
    console.log(comparelist)
    for(let prod of comparelist){
      console.log(prod.name);
      const col = `<div class="col"> ${prod.name} </div>`;
      console.log(col);
      compareDivRow.append(col);
      //compareDiv
    }
    //compareDivRow.
  }

  document.addEventListener('readystatechange', () => {    
    if (document.readyState == 'complete') onLoad();
  });

  compareNav.click(function (event) {
    event.preventDefault();
    console.log("Hello compare");

    let products = localStorage.getItem("comparelist");
    //compareForm.style.visibility = 'hidden';
    // var requestConfig = {
    //   method: "POST",
    //   url: "/api/products/compare",
    //   contentType: "application/json",
    //   data: JSON.stringify({
    //     products: products,
    //   }),
    // };
    compareListInput.val(JSON.stringify(products));

    compareForm.submit();
  });

  resetcomparelistbtn.click(function (event) {
    console.log("Reset");
    localStorage.setItem("comparelist", "[]");
    window.location.href = "/api";
  });
})(window.jQuery);
