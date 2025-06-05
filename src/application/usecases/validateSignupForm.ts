
import type { SignupDTO } from "../../domain/entities/Auth";
import type { RegisterFormErrors } from "../../domain/entities/Errors";
import { checkDigits, isValidEmail, isValidName, isValidPassword, isValidPhoneNumber } from "../../domain/validators/validation";

export const validateSignupForm = (data: SignupDTO)=> {
     const errors: RegisterFormErrors = {};
    
        if (!isValidName(data.firstName)) {
          errors.firstName = "Name can only contain letters";
        }
    
        if (!isValidName(data.lastName)) {
          errors.lastName = "Name can only contain letters";
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
       
    
        return errors
}