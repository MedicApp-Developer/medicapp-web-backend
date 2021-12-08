import Validator from 'validator';
import isEmpty from 'is-empty';

const validateSpecialityInput = (data: any) => {
  let errors: any = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.tags = !isEmpty(data.tags) ? data.tags : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
  if (Validator.isEmpty(data.tags)) {
    errors.tags = "Tags field is required";
  }
return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateSpecialityInput;