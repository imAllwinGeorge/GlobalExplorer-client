// validations/editProfileValidation.ts
import {
  isValidName,
  isValidEmail,
  isValidPhoneNumber,
  checkDigits,
  isValidIFSC,
  isValidAccontNumber,
} from "./validations";
import type { RegisterFormErrors, HostSignupFormErrors } from "../types/auth.type";
import type { AdminProfile, Host, User } from "../types/global";

export const validateUserProfile = (data: Partial<User>) => {
  const errors: RegisterFormErrors = {};

  if (!data.firstName?.trim()) {
    errors.firstName = "First name cannot be empty";
  } else if (!isValidName(data.firstName)) {
    errors.firstName = "Name can only contain letters";
  }

  if (!data.lastName?.trim()) {
    errors.lastName = "Last name cannot be empty";
  } else if (!isValidName(data.lastName)) {
    errors.lastName = "Name can only contain letters";
  }

  if (!isValidEmail(data.email ?? "")) {
    errors.email = "Please enter a valid email address";
  }

  if(data.phoneNumber) {
    if (!isValidPhoneNumber(data.phoneNumber ?? "")) {
    errors.phoneNumber = "Phone number must start from 6-9 and must be 10 digits";
  } else if (checkDigits(data.phoneNumber)) {
    errors.phoneNumber = "Phone number cannot have all digits the same";
  }
  }

  return errors;
};

export const validateHostProfile = (data: Partial<Host>) => {
  const errors: HostSignupFormErrors = {};

  if (!data.firstName?.trim()) {
    errors.firstName = "First name cannot be empty";
  } else if (!isValidName(data.firstName)) {
    errors.firstName = "Name can only contain letters";
  }

  if (!data.lastName?.trim()) {
    errors.lastName = "Last name cannot be empty";
  } else if (!isValidName(data.lastName)) {
    errors.lastName = "Name can only contain letters";
  }

  if (!isValidEmail(data.email ?? "")) {
    errors.email = "Please enter a valid email address";
  }

  if(data.phoneNumber){
    if (!isValidPhoneNumber(data.phoneNumber ?? "")) {
    errors.phoneNumber = "Phone number must start from 6-9 and must be 10 digits";
  } else if (checkDigits(data.phoneNumber)) {
    errors.phoneNumber = "Phone number cannot have all digits the same";
  }
  }

  if(!isValidIFSC(data.ifsc?? "")) {
    errors.ifsc = "IFSC's first 4 charecters should be alphabets, 5th charecter should be 0, rest 6 should be numbers."
  }

  if(!isValidAccontNumber(data.accountNumber ?? "")) {
    errors.accountNumber = "Account number should 11 to 17 numbers."
  }

  return errors;
};


export const validateAdminProfile = (data: Partial<AdminProfile>) =>{
    const errors: Partial<AdminProfile> = {};
    if(!isValidEmail(data.email ?? "")){
        errors.email = "Please enter a valid eamil address";
    }
    return errors
}