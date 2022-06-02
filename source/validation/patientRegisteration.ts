import Validator from 'validator';
import isEmpty from 'is-empty';

export function validatePatientRegisteration(data: any) {
  let errors = {};
// Convert empty fields to an empty string so we can use validator functions
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.birthday = !isEmpty(data.birthday) ? data.birthday : "";
  data.gender = !isEmpty(data.gender) ? data.gender : "";
  data.location = !isEmpty(data.location) ? data.location : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.emiratesId = !isEmpty(data.emiratesId) ? data.emiratesId : "";

  if (Validator.isEmpty(data.firstName)) {
    // @ts-ignore
    errors.firstName = "First Name field is required";
  }

  if (Validator.isEmpty(data.lastName)) {
    // @ts-ignore
    errors.lastName = "Last Name field is required";
  }

  if (Validator.isEmpty(data.emiratesId)) {
    // @ts-ignore
    errors.emiratesId = "Emirates Id field is required";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    // @ts-ignore
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    // @ts-ignore
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.birthday)) {
    // @ts-ignore
    errors.birthday = "Birthday field is required";
  }

  if (Validator.isEmpty(data.gender)) {
    // @ts-ignore
    errors.gender = "Gender field is required";
  }

  if (Validator.isEmpty(data.location)) {
    // @ts-ignore
    errors.location = "Location field is required";
  }

  if (Validator.isEmpty(data.phone)) {
    // @ts-ignore
    errors.phone = "Phone field is required";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    // @ts-ignore
    errors.password = "Password field is required";
  }
return {
    errors,
    isValid: isEmpty(errors)
  };
};