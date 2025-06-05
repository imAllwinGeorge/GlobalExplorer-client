import type { LoginDTO } from "../../domain/entities/Auth";
import type { LoginFormError } from "../../domain/entities/Errors";
import { isValidEmail, isValidPassword } from "../../domain/validators/validation";

export const validateLoginForm = (data: LoginDTO)=> {
     const errors: LoginFormError = {};
    
        
        if (!isValidEmail(data.email)) {
          errors.email = "please enter valid email address";
        }
        
        if (!isValidPassword(data.password)) {
          errors.password =
            "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.";
        }
       
    
        return errors
}