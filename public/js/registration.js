(function ($) {
  var loginForm = $("#login-form"),
    usernameInput = $("#username"),
    passwordInput = $("#password"),
    errorLi = $("#errorlist"),
    errorDiv = $("#errorDiv");

  const usernameRegex = /^[A-Za-z0-9\s]*$/;
  const charRegex = /^[A-Za-z\s]*$/;
  const digitRegex = /(?=.*[0-9])/;
  const capitalRegex = /^[A-Z]/;
  const specialRegex = /(?=.*[!@#$%^&*.])/;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  var usernameErrorMessage = "";
  var passwordErrorMessage = "";

  function userLoginValidate(username, password) {
    usernameErrorMessage = "";
    passwordErrorMessage = "";
    if (!username) {
      usernameErrorMessage = "Username should not be empty";
    } else {
      username = username.trim().toLowerCase();
      if (username.length < 1)
        usernameErrorMessage = "Username should not be empty";
      else if (username.length < 4)
        usernameErrorMessage = "Username should have atleast 4 characters";
      else if (!usernameRegex.test(username))
        usernameErrorMessage =
          "Username should only have alphanumeric characters";
    }

    if (!password) {
      passwordErrorMessage = "Error: Password should not be empty";
    } else {
      password = password.trim();
      if (password.length < 6)
        passwordErrorMessage = "Password should have atleast 6 characters";
      else if (!digitRegex.test(password))
        passwordErrorMessage = "Password should have atleast 1 digit";
      else if (!capitalRegex.test(password))
        passwordErrorMessage = "Password should have atleast 1 capital letter";
      else if (!specialRegex.test(password))
        passwordErrorMessage =
          "Password should have atleast 1 special character";
    }
  }

  function userSignupValidate() {}

  loginForm.submit(function (event) {
    event.preventDefault();
    console.log(errorDiv);
    errorDiv.addClass("hidden");
    errorLi.empty();

    var username = usernameInput.val();
    var password = passwordInput.val();

    userLoginValidate(username, password);

    if (
      usernameErrorMessage.length === 0 &&
      passwordErrorMessage.length === 0
    ) {
      //AJAX call to login API

      var requestConfig = {
        method: "POST",
        url: "/users/login",
        contentType: "application/json",
        data: JSON.stringify({
          userid: username.trim(),
          password: password.trim(),
        }),
      };

      $.ajax(requestConfig).then(function (responseMessage) {
        console.log(responseMessage);
        //newContent.html(responseMessage.message);
        if (responseMessage.error) {
          errorDiv.removeClass("hidden");
          errorLi.append($("<li>").text(responseMessage.error));
        } else {
          //Redirect to home page
          window.location.href = "/api/products";
        }
      });
    } else {
      console.log("Errors");
      if (usernameErrorMessage.length !== 0) {
        errorDiv.removeClass("hidden");
        errorLi.append($("<li>").text(usernameErrorMessage));
      }
      if (passwordErrorMessage.length !== 0) {
        errorDiv.removeClass("hidden");
        errorLi.append($("<li>").text(passwordErrorMessage));
      }
    }
  });
})(window.jQuery);
