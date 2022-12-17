$(document).ready(function ($) {
  var compareNav = $("#compare-prods");
  var compareBtn = $("#compare-prods-btn");
  var compareForm = $("#compare-form");
  var compareListInput = $("#compareList");
  var resetcomparelistbtn = $("#resetlist");
  var resetcomparelistbtn2 = $("#resetlist-btn");

  var compareDiv = $("#compareDiv");
  var compareDivRow = $("#compareDivRow");

  var dummybtn = $('#clear-storage');

  dummybtn.click(function (event){
    alert("Dummy btn");
  })

  function onLoad(event) {
    console.log("onload");
    console.log("Path ", window.location.href);
    if (window.location.href.endsWith("/api")) {
      compareDiv.show();
    } else {
      compareDiv.hide();
    }
    var comparelist = JSON.parse(localStorage.getItem("comparelist"));
    console.log(comparelist);
    for (let prod of comparelist) {
      console.log(prod.name);
      const col = `<div class="col"> ${prod.name} </div>`;
      console.log(col);
      compareDivRow.append(col);
      //compareDiv
    }
  }

  document.addEventListener("readystatechange", () => {
    if (document.readyState == "complete") onLoad();
  });

  compareNav.click(function (event) {
    event.preventDefault();
    console.log("Hello compare");

    let products = localStorage.getItem("comparelist");
    compareListInput.val(JSON.stringify(products));
    compareForm.submit();
  });

  compareBtn.click(function (event) {
    event.preventDefault();
    console.log("Hello compare");

    let products = localStorage.getItem("comparelist");
    compareListInput.val(JSON.stringify(products));
    compareForm.submit();
  });

  resetcomparelistbtn.click(function (event) {
    console.log("Reset");
    localStorage.setItem("comparelist", "[]");
    window.location.href = "/api";
  });

  resetcomparelistbtn2.click(function (event) {
    console.log("Reset");
    localStorage.setItem("comparelist", "[]");
    window.location.href = "/api";
  });
})(window.jQuery);
