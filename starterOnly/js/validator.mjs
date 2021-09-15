const nameMinLength = 2;
const emailRegex = /^[a-z0-9]+([+._-][a-z0-9]+)*@[a-z0-9]+(-[a-z]+)*(\.[a-z]{2,})+$/;

const Validator = {
    name(name) {
        return name.length >= nameMinLength;
    },
    email(email) {
        return emailRegex.test(email);
    },
    birthdate(date) {
        const today = new Date();
        const testDate = new Date(date);
        return testDate < today;
    },
    positiveInteger(value) {
        const intValue = parseInt(value);
        return value !== '' &&
            value === String(intValue) &&
            intValue >= 0;
    },
}

export default Validator;
