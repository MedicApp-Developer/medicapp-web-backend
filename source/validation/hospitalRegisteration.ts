import Validator from 'validator';
import isEmpty from 'is-empty';

export function validateHospitalRegisteration(data: any) {
  let errors = {};

// Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.phoneNo = !isEmpty(data.phoneNo) ? data.phoneNo : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.tradeLicenseNo = !isEmpty(data.tradeLicenseNo) ? data.tradeLicenseNo : "";
  data.issueDate = !isEmpty(data.issueDate) ? data.issueDate : "";
  data.expiryDate = !isEmpty(data.expiryDate) ? data.expiryDate : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.name)) {
    // @ts-ignore
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.phoneNo)) {
    // @ts-ignore
    errors.phoneNo = "Phone No field is required";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    // @ts-ignore
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    // @ts-ignore
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.tradeLicenseNo)) {
    // @ts-ignore
    errors.tradeLicenseNo = "Trade License No field is required";
  }

  if (Validator.isEmpty(data.issueDate)) {
    // @ts-ignore
    errors.issueDate = "Issue Date field is required";
  }

  if (Validator.isEmpty(data.expiryDate)) {
    // @ts-ignore
    errors.expiryDate = "Expiry Date field is required";
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