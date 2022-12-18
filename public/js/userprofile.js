$(document).ready(function () {
    // Handlebars.registerHelper('eq', function(a, b, options) {
    //     return a == b ? options.fn(this) : options.inverse(this);
    //   });
    $('#edit-form').submit(function (e) {
        console.log("triggered");
        e.preventDefault();

        const usernameRegex = /^[A-Za-z0-9\s]*$/;
        const charRegex = /^[A-Za-z\s]*$/;
        const digitRegex = /(?=.*[0-9])/;
        const capitalRegex = /(?=.*[A-Z])/;
        const specialRegex = /(?=.*[!@#$%^&*.])/;
        const emailRegex =
            /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

        const data = [];

        const validateUsername = (username) => {
            if (!username) throw "Username should not be empty";
            username = username.trim().toLowerCase();
            if (username.length < 1) throw "Username should not be empty";
            if (username.length < 4) throw "Username should have atleast 4 characters";
            if (!usernameRegex.test(username))
                throw "Username should only have alphanumeric characters";
            return username;
        };

        const validatePassword = (password) => {
            if (!password) throw "Error: Password should not be empty";
            password = password.trim();
            if (password.length < 6) throw "Password should have atleast 6 characters";
            if (!digitRegex.test(password)) throw "Password should have atleast 1 digit";
            if (!capitalRegex.test(password))
                throw "Password should have atleast 1 capital letter";
            if (!specialRegex.test(password))
                throw "Password should have atleast 1 special character among ! @ # $ % ^ & * . ";
            return password;
        };

        const validateEmail = (email) => {
            if (!email) throw "Email should not be empty";
            email = email.trim();
            if (email.length === 0) throw "Email should not be empty";
            if (!email.match(emailRegex)) throw "Email is invalid";
            return email;
        };

        const validateGender = (gender) => {
            if (!gender) throw "Gender should not be empty";
            gender = gender.trim();
            if (gender.length === 0) throw "Gender should not be empty";
            if (
                !(
                    gender.toLowerCase() === "man" ||
                    gender.toLowerCase() === "woman" ||
                    gender.toLowerCase() === "transgender" ||
                    gender.toLowerCase() === "non-binary/non-conforming" ||
                    gender.toLowerCase() === "prefer not to respond"
                )
            ) {
                throw "Gender is invalid";
            }
            return gender;
        };

        const validateName = (name, variableName) => {
            if (!name) throw `${variableName} should not be empty`;
            name = name.trim();
            if (name.length === 0) throw `${variableName} should not be empty`;
            if (name.length < 3) throw `${variableName} should have atleast 3 letters`;
            if (!name.match(charRegex))
                throw `${variableName} should only have alphabets`;
            return name;
        };

        // Validate passwords
        var currentPassword = $('#current-password').val();
        var newPassword = $('#new-password').val();
        var confirmNewPassword = $('#confirm-new-password').val();
        if (!currentPassword && !newPassword && !confirmNewPassword) {
            currentPassword = "";
            newPassword = "";
            confirmNewPassword = "";
        } else if (newPassword !== confirmNewPassword) {
            alert("New password and confirm password do not match.");
            return;
        }
        else {
            try {
                validatePassword(currentPassword);
                validatePassword(newPassword);
                validatePassword(confirmNewPassword);
            } catch (e) {
                alert(e);
                return;
            }
        }

        let username = $("#username").val()
        let email = $("#email").val()
        let firstname = $("#firstname").val()
        let lastname = $("#lastname").val()
        let gender = $("#gender").val()
        try {
            username = validateUsername(username);
            email = validateEmail(email);
            firstname = validateName(firstname, "First Name");
            lastname = validateName(lastname, "Last Name");
            gender = validateGender(gender);
        } catch (e) {
            alert(e);
            return;
        }
        const user = {
            username: username,
            email: email,
            firstname: firstname,
            lastname: lastname,
            gender: gender,
            currentPassword: currentPassword,
            newPassword: newPassword
        };
        // Make AJAX request
        $.ajax({
            type: 'POST',
            url: '/users/userProfile',
            data: {
                user: user
            },
            success: function () {
                alert("Successfully updated.");
            },
            error: function (e) {
                alert("Update failed because- " + e.responseJSON.message);
            }
        });
    });
});

