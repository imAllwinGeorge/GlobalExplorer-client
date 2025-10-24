// export const isValidName = (name: string) => {
//     return /^[A-Za-z\s]+$/.test(name)
// }
export const isValidName = (name) => {
    // Only letters and spaces allowed
    const basicPattern = /^[A-Za-z\s]+$/;
    // Disallow more than 3 repeated characters
    const repetitionPattern = /(.)\1{3,}/;
    return basicPattern.test(name) && !repetitionPattern.test(name);
};
export const isValidEmail = (email) => {
    return /^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};
export const isValidPhoneNumber = (phoneNumber) => {
    return /^[6-9]\d{9}$/.test(phoneNumber);
};
export const checkDigits = (phoneNumber) => {
    return /^(\d)\1{9}$/.test(phoneNumber);
};
export const isValidPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
};
export const isValidIFSC = (ifsc) => {
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
};
export const isValidAccontNumber = (accountNumber) => {
    return /^\d{11,17}$/.test(accountNumber);
};
