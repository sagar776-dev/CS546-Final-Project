$(document).ready(function ($) {
  var loginForm = $("#login-form"),
    signupForm = $("#registration-form"),
    usernameInput = $("#username"),
    passwordInput = $("#password"),
    errorLi = $("#errorlist"),
    errorDiv = $("#errorDiv"),
    userForm = $("#user-form"),
    profileNav = $("#profile-nav");

  const usernameRegex = /^[A-Za-z0-9\s]*$/;
  const charRegex = /^[A-Za-z\s]*$/;
  const digitRegex = /(?=.*[0-9])/;
  const capitalRegex = /(?=.*[A-Z])/;
  const specialRegex = /(?=.*[!@#$%^&*.])/;
  const emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  var usernameErrorMessage = "";
  var passwordErrorMessage = "";
  var emailErrorMessage = "";
  var genderErrorMessage = "";
  var firstnameErrorMessage = "";
  var lastnameErrorMessage = "";

  function validateEmail(email) {
    emailErrorMessage = "";
    if (!email) emailErrorMessage = "Email should not be empty";
    email = email.trim();
    if (email.length === 0) emailErrorMessage = "Email should not be empty";
    if (!email.match(emailRegex)) emailErrorMessage = "Email is invalid";
  }

  function validateGender(gender) {
    genderErrorMessage = "";
    if (!gender) genderErrorMessage = "Gender should not be empty";
    gender = gender.trim();
    if (gender.length === 0) genderErrorMessage = "Gender should not be empty";
    if (
      !(
        gender.toLowerCase() === "man" ||
        gender.toLowerCase() === "woman" ||
        gender.toLowerCase() === "transgender" ||
        gender.toLowerCase() === "non-binary/non-conforming" ||
        gender.toLowerCase() === "prefer not to respond"
      )
    ) {
      genderErrorMessage = "Gender is invalid";
    }
  }

  function validateFirstName(name) {
    firstnameErrorMessage = "";
    if (!name) firstnameErrorMessage = "Firstname should not be empty";
    name = name.trim();
    if (name.length === 0)
      firstnameErrorMessage = "Firstname should not be empty";
    if (name.length < 3)
      firstnameErrorMessage = "Firstname should have atleast 3 letters";
    if (!name.match(charRegex))
      firstnameErrorMessage = "Firstname  should only have alphabets";
    return name;
  }

  function validateLastName(name) {
    lastnameErrorMessage = "";
    if (!name) lastnameErrorMessage = "Lastname should not be empty";
    name = name.trim();
    if (name.length === 0)
      lastnameErrorMessage = "Lastname should not be empty";
    if (name.length < 3)
      lastnameErrorMessage = "Lastname should have atleast 3 letters";
    if (!name.match(charRegex))
      lastnameErrorMessage = "Lastname should only have alphabets";
    return name;
  }

  // function validateId (id, variableName){
  //   if(!id) throw `${variableName} should not be empty`;
  //   id = id.trim();
  //   if(id.length === 0) throw `${variableName} should not be empty`;
  //   if (!ObjectId.isValid(id)) throw "Error: Invalid movie ID";
  // }

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
          "Password should have atleast 1 special character among ! @ # $ % ^ & * . ";
    }
  }

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
          username: username.trim(),
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
          //alert("Logged in");
          var comparelist = localStorage.getItem("comparelist");
          console.log("Initial list ", comparelist);
          localStorage.setItem("comparelist", "[]");
          window.location.href = "/api";
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

  signupForm.submit(function (event) {
    event.preventDefault();
    var dataValues = {};
    signupForm.find("input").each(function (unusedIndex, child) {
      dataValues[child.name] = child.value;
    });
    signupForm.find("select").each(function (unusedIndex, child) {
      dataValues[child.name] = child.value;
    });
    //console.log(event);
    console.log(dataValues);
    errorDiv.addClass("hidden");
    errorLi.empty();

    var username = dataValues.username;
    var password = dataValues.password;
    var confirmPassword = dataValues.passwordConfirm;
    var email = dataValues.email;
    var firstname = dataValues.firstName;
    var lastname = dataValues.lastName;
    var gender = dataValues.gender;

    userLoginValidate(username, password);
    validateFirstName(firstname);
    validateLastName(lastname);
    validateEmail(email);
    validateGender(gender);

    console.log(usernameErrorMessage);
    console.log(passwordErrorMessage);
    console.log(firstnameErrorMessage);
    console.log(lastnameErrorMessage);
    console.log(emailErrorMessage);
    console.log(genderErrorMessage);

    if (passwordErrorMessage.length === 0) {
      if (password !== confirmPassword) {
        passwordErrorMessage = "Passwords do not match";
      }
    }
    console.log(usernameErrorMessage);
    if (
      usernameErrorMessage.length === 0 &&
      passwordErrorMessage.length === 0 &&
      firstnameErrorMessage.length === 0 &&
      lastnameErrorMessage.length === 0 &&
      emailErrorMessage.length === 0 &&
      genderErrorMessage.length === 0
    ) {
      //AJAX call to login API
      var requestConfig = {
        method: "POST",
        url: "/users/signup",
        contentType: "application/json",
        data: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          email: email.trim(),
          firstName: firstname.trim(),
          lastName: lastname.trim(),
          gender: gender.trim(),
        }),
      };
      $.ajax(requestConfig).then(function (responseMessage) {
        console.log(responseMessage);
        //newContent.html(responseMessage.message);
        if (responseMessage.error) {
          errorDiv.removeClass("hidden");
          errorLi.append($("<li>").text(responseMessage.error));
        } else {
          var comparelist = localStorage.getItem("comparelist");
          console.log("Initial list ", comparelist);
          if (!comparelist) {
            localStorage.setItem("comparelist", "[]");
          }
          window.location.href = "/api";
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
      if (emailErrorMessage.length !== 0) {
        errorDiv.removeClass("hidden");
        errorLi.append($("<li>").text(emailErrorMessage));
      }
      if (firstnameErrorMessage.length !== 0) {
        errorDiv.removeClass("hidden");
        errorLi.append($("<li>").text(firstnameErrorMessage));
      }
      if (lastnameErrorMessage.length !== 0) {
        errorDiv.removeClass("hidden");
        errorLi.append($("<li>").text(lastnameErrorMessage));
      }
      if (genderErrorMessage.length !== 0) {
        errorDiv.removeClass("hidden");
        errorLi.append($("<li>").text(genderErrorMessage));
      }
    }
  });

  

  userForm.submit(function (event) {
    event.preventDefault();
    var dataValues = {};
    signupForm.find("input").each(function (unusedIndex, child) {
      dataValues[child.name] = child.value;
    });
    signupForm.find("select").each(function (unusedIndex, child) {
      dataValues[child.name] = child.value;
    });
    //console.log(event);
    console.log(dataValues);
    errorDiv.addClass("hidden");
    errorLi.empty();

    var username = dataValues.username;
    var password = dataValues.password;
    var confirmPassword = dataValues.passwordConfirm;
    var email = dataValues.email;
    var firstname = dataValues.firstName;
    var lastname = dataValues.lastName;
    var gender = dataValues.gender;

    validateFirstName(firstname);
    validateLastName(lastname);
    validateEmail(email);
    validateGender(gender);

    console.log(usernameErrorMessage);
    if (
      firstnameErrorMessage.length === 0 &&
      lastnameErrorMessage.length === 0 &&
      emailErrorMessage.length === 0 &&
      genderErrorMessage.length === 0
    ) {
      // //AJAX call to login API
      // var requestConfig = {
      //   method: "POST",
      //   url: "/users/signup",
      //   contentType: "application/json",
      //   data: JSON.stringify({
      //     username: username.trim(),
      //     password: password.trim(),
      //   }),
      // };
      // $.ajax(requestConfig).then(function (responseMessage) {
      //   console.log(responseMessage);
      //   //newContent.html(responseMessage.message);
      //   if (responseMessage.error) {
      //     errorDiv.removeClass("hidden");
      //     errorLi.append($("<li>").text(responseMessage.error));
      //   } else {
      //     //Redirect to home page
      //     //alert("Logged in");
      //     var comparelist = localStorage.getItem("comparelist");
      //     console.log("Initial list ",comparelist);
      //     if(!comparelist){
      //       localStorage.setItem("comparelist", "[]");
      //     }
      //     window.location.href = "/api";
      //   }
      // });
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
      if (emailErrorMessage.length !== 0) {
        errorDiv.removeClass("hidden");
        errorLi.append($("<li>").text(emailErrorMessage));
      }
      if (firstnameErrorMessage.length !== 0) {
        errorDiv.removeClass("hidden");
        errorLi.append($("<li>").text(firstnameErrorMessage));
      }
      if (lastnameErrorMessage.length !== 0) {
        errorDiv.removeClass("hidden");
        errorLi.append($("<li>").text(lastnameErrorMessage));
      }
      if (genderErrorMessage.length !== 0) {
        errorDiv.removeClass("hidden");
        errorLi.append($("<li>").text(genderErrorMessage));
      }
    }
  });
})(window.jQuery);
