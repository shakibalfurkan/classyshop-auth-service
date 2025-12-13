import AppError from "../errors/AppError.js";
import { USER_ROLES } from "../modules/user/user.constant.js";
import User from "../modules/user/user.model.js";
import checkOtpRestrictions from "./checkOtpRestrictions.js";
import sendOtp from "./sendOtp.js";
import trackOtpRequests from "./trackOtpRequests.js";

const handleForgotPassword = async (
  email: string,
  userType: (typeof USER_ROLES)[keyof typeof USER_ROLES]
) => {
  const user = userType === USER_ROLES.USER && (await User.findOne({ email }));

  if (!user) {
    throw new AppError(400, "User does not exist!");
  }

  await checkOtpRestrictions(email);
  await trackOtpRequests(email);

  await sendOtp(user.name as string, user.email, "forgot_password");

  return null;
};

export default handleForgotPassword;
