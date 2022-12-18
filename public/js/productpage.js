
$(document).ready(function ($) {
  var comparecheckbox = $("#comparecheckbox");

  var addWishlistbtn = $("#add-wishlist");
  var removeWishlistbtn = $("#remove-wishlist");

  var removeWishlistp = $("#remove-wishlist-p");
  var addWishlistp = $("#add-wishlist-p");
  //var isWishListed = $("#isWishListed");

  var resetlistbtn = $('#resetlist');

  function onLoad(event) {
    //var isWishListed = $("#isWishListed");
    resetlistbtn.hide();
    var comparelist = JSON.parse(localStorage.getItem("comparelist"));
    console.log("onload");
    console.log("Path ", window.location.href);
    //var isWishlisted = document.getElementById("isWishListed");
    var idField = document.getElementById("id_field");
    var productId = idField.innerText
      .slice(idField.innerText.indexOf(":") + 1, idField.innerText.length)
      .trim();
    console.log("Is wishlisted :", $("#isWishListed").text());
    var ids = new Array();
    for (let p of comparelist) {
      console.log("ID ", p.id);
      ids.push(p.id);
    }
    if($("#isWishListed").text().toLowerCase() === 'true'){
      removeWishlistp.show();
      addWishlistp.hide();
    } else{
      addWishlistp.show();
      removeWishlistp.hide();
    }
    if (ids.includes(productId)) {
      comparecheckbox.prop("checked", true);
    } else {
      comparecheckbox.prop("checked", false);
    }
  }

  document.addEventListener("readystatechange", () => {
    if (document.readyState == "complete") onLoad();
  });

  comparecheckbox.change(function (event) {
    var comparelist = JSON.parse(localStorage.getItem("comparelist"));
    var flag = true;
    var idField = document.getElementById("id_field");
    var nameField = document.getElementById("name_field");
    var typeField = document.getElementById("category_field");
    console.log(idField.innerText, nameField.value, typeField.value);

    var productId = idField.innerText
      .slice(idField.innerText.indexOf(":") + 1, idField.innerText.length)
      .trim();
    var productName = nameField.innerText
      .slice(nameField.innerText.indexOf(":") + 1, nameField.innerText.length)
      .trim();
    var productType = typeField.innerText
      .slice(typeField.innerText.indexOf(":") + 1, typeField.innerText.length)
      .trim();

    if ($(this).is(":checked")) {
      console.log("add");
      var prod = {
        id: productId,
        name: productName,
        type: productType,
      };
      var ids = new Array();
      for (let p of comparelist) {
        console.log("ID ", p.id);
        ids.push(p.id);
      }
      if (ids.includes(prod.id)) {
        alert("Product already in the compare list");
      } else if (ids.length > 2) {
        alert("You can compare a maximum of 3 products");
      } else {
        if (!comparelist) {
          localStorage.setItem("comparelist", "[]");
          comparelist = new Array();
        }
        comparelist.push(prod);
      }
    } else {
      console.log("remove");
      var newCompareList = new Array();
      var ids = new Array();
      for (let p of comparelist) {
        console.log("ID ", p.id);
        ids.push(p.id);
      }
      for (let p of comparelist) {
        if (productId !== p.id) {
          newCompareList.push(p);
        }
      }
      comparelist = newCompareList;
    }
    localStorage.setItem("comparelist", JSON.stringify(comparelist));
  });

  addWishlistbtn.click(function (event) {
    var idField = document.getElementById("id_field");
    var productId = idField.innerText
      .slice(idField.innerText.indexOf(":") + 1, idField.innerText.length)
      .trim();
    var requestConfig = {
      method: "GET",
      url: "/users/addwishlist/"+productId,
      contentType: "application/json",
    };

    $.ajax(requestConfig).then(function (responseMessage) {
      console.log(responseMessage);
      addWishlistp.hide();
      removeWishlistp.show();
    });
  });

  removeWishlistbtn.click(function (event) {
    var idField = document.getElementById("id_field");
    var productId = idField.innerText
      .slice(idField.innerText.indexOf(":") + 1, idField.innerText.length)
      .trim();
    var requestConfig = {
      method: "GET",
      url: "/users/removewishlist/"+productId,
      contentType: "application/json",
    };

    $.ajax(requestConfig).then(function (responseMessage) {
      console.log(responseMessage);
      addWishlistp.show();
      removeWishlistp.hide();
    });
  });
})(window.jQuery);

