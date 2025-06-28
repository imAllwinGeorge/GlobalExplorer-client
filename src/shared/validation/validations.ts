export const isValidName = (name: string) => {
    return /^[A-Za-z\s]+$/.test(name)
}

export const isValidEmail = (email: string) => {
    return /^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

export const isValidPhoneNumber = (phoneNumber: string) => {
    return /^[6-9]\d{9}$/.test(phoneNumber)
}

export const checkDigits = (phoneNumber: string) => {
    return /^(\d)\1{9}$/.test(phoneNumber)
}

export const isValidPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
}

export const isValidIFSC = (ifsc: string) => {
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)
}

export const isValidAccontNumber = (accountNumber: string) => {
    return /^\d{11,17}$/.test(accountNumber)
}

