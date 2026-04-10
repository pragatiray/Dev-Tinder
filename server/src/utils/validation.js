const validator = require("validator");
const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("enter your firstName and lastName");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }
};

const validateProfileEditData = (req) => {
    const allowedEditsFields = [
        "firstName",
        "lastName",
        "age",
        "about",
        "skills",
        "gender",
        "photoUrl",
    ];
    const isEditAllowed = Object.keys(req.body).every((field) => {
        return allowedEditsFields.includes(field);
    });
    if (!isEditAllowed) {
        throw new Error("Invalid edit field");
    }
    return true;
};

module.exports = {
    validateSignUpData,
    validateProfileEditData,
};