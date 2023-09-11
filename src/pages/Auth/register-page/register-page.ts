import authService from "$lib/services/auth.service";
import { notifications } from "$lib/utils/notifications";
import { checkValidation, registrationSchema } from "$lib/utils/validation";
import { navigate } from "svelte-navigator";

const handleRegister = async (userData) => {
  try {
    await authService.registerUser({
      email: userData.email,
      name: userData.name,
      username: userData.username,
      password: userData.password,
    });
    notifications.success("Registration successful!");
    navigate("/");
  } catch (error) {
    console.log(error);
    notifications.error(error);
  }
};

export const handleRegisterValidation = async (userData) => {
  const { isError, errorObject } = await checkValidation(
    registrationSchema,
    userData,
  );
  if (isError) {
    return errorObject;
  }
  handleRegister(userData);
  return {};
};
