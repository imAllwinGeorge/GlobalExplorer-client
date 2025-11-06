import type { AddCategoryError } from "../types/auth.type";
import { isValidName } from "./validations";

export const validateCategory = (data: {
    categoryName: string;
    description: string;
  }) => {
    const errors: AddCategoryError = {};
    if (!isValidName(data.categoryName)) {
      errors.categoryName = "category Name can only contain alphabets";
    }

    if (!data.categoryName.trim()) {
      errors.categoryName = "category Name cannot be empty"
    }

    const description = data.description.trim();

    // Check if empty
    if (!description) {
      errors.description = "This field cannot be empty";
    }
    // Check if it has fewer than 5 words
    else if (description.split(/\s+/).length < 5) {
      errors.description = "Description must contain at least 5 words";
    }
    // Check if it's just repeated characters (e.g., "hhhhhh...")
    else if (/^(.)\1{10,}$/.test(description.replace(/\s+/g, ""))) {
      errors.description = "Description cannot be repetitive characters";
    }

    return errors;
  };