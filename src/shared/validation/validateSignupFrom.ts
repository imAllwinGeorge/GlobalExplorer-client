import type { HostSignupFormErrors, RegisterFormErrors } from "../types/auth.type";
import type { HostSignupDTO, SignupDTO } from "../types/DTO";
import {
  checkDigits,
  isValidAccontNumber,
  isValidEmail,
  isValidIFSC,
  isValidName,
  isValidPassword,
  isValidPhoneNumber,
} from "./validations";

export const validateSignupForm = (data: SignupDTO) => {
  const errors: RegisterFormErrors = {};

  if (!isValidName(data.firstName)) {
    errors.firstName = "Name can only contain letters";
  }

  if (!data.firstName.trim()) {
    errors.firstName = "Name cannot be empty"
  }

  if (!isValidName(data.lastName)) {
    errors.lastName = "Name can only contain letters";
  }

  if (!data.lastName.trim()) {
    errors.lastName = "Name cannot be empty"
  }
  if (!isValidEmail(data.email)) {
    errors.email = "please enter valid email address";
  }
  if (!isValidPhoneNumber(data.phoneNumber)) {
    errors.phoneNumber =
      "Phone number must start from 6-9 and must be 10 digits ";
  }
  if (checkDigits(data.phoneNumber)) {
    errors.phoneNumber = "Phone number cannot have all digits the same";
  }
  if (!isValidPassword(data.password)) {
    errors.password =
      "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.";
  }

  return errors;
};

export const validateHostSignupForm = (data: HostSignupDTO) => {
  const errors: HostSignupFormErrors = {};

  if(!isValidName(data.firstName)) {
    errors.firstName = "Name can only contain letters";
  }

  if (!data.firstName.trim()) {
    errors.firstName = "Name cannot be empty"
  }

  if(!isValidName(data.lastName)){
    errors.lastName = "Name can only contain letters"
  }

  if (!data.lastName.trim()) {
    errors.lastName = "Name cannot be empty"
  }

  if(!isValidEmail(data.email)) {
    errors.email = "Please enter valid email address";
  }

  if(!isValidPhoneNumber(data.phoneNumber)) {
    errors.phoneNumber = "Phone number must start from 6-9 and must be 10 digits";
  }

  if(checkDigits(data.phoneNumber)) {
    errors.phoneNumber = "Phone number cannot have all digits the same";
  }

  if(!isValidPassword(data.password)) {
    errors.password = "Passoword must contain at least 8 characters, including uppercase, lowercase, number, and special character."
  }

  return errors

}

export const stepTwoHostSignupValidation = (data: HostSignupDTO) => {
  const errors: Partial<HostSignupFormErrors> = {};
  if (!isValidName(data.accountHolderName)) {
        errors.accountHolderName = "name should only contain alphabets";
      }
      if (!isValidIFSC(data.ifsc)) {
        errors.ifsc =
          "IFSC's first 4 charecters should be alphabets, 5th charecter should be 0, rest 6 should be numbers.";
      }
      if (!isValidAccontNumber(data.accountNumber)) {
        errors.accountNumber = "Account number should 11 to 17 numbers.";
      }
      if (!isValidName(data.branch)) {
        errors.branch = "Branch can only contain alphabets.";
      }
      if (data.kyc_panCard === null) {
        errors.kyc_panCard = "PAN card must be uploaded.";
      }
      if (data.kyc_idProof === null) {
        errors.kyc_idProof = "ID proof shold not be empty";
      }
      if (data.kyc_addressProof === null) {
        errors.kyc_addressProof = "Address proof must be uploaded.";
      }

      return errors
}

export const stepThreeHostSignupValidation = (data:Partial<HostSignupDTO>) => {
  const errors: Partial<HostSignupFormErrors> = {}
  if (data.registrationCertificate === null) {
        errors.registrationCertificate =
          "Please upload registration certificate.";
      }
      if (data.safetyCertificate === null) {
        errors.safetyCertificate = "Please upload safety certificate.";
      }
      if (data.license === null) {
        errors.license = "Please upload License.";
      }
      if (data.insurance === null) {
        errors.insurance = "Please upload insurance.";
      }

      return errors
}
