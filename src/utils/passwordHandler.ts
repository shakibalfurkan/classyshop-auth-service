import bcrypt from "bcrypt";

export const isPasswordMatched = async (
  plainPassword: string,
  hashedPassword: string,
) => {
  const isMatched = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatched;
};

export const hashPassword = async (
  password: string,
  saltRound: string | number,
) => {
  const hashedPassword = await bcrypt.hash(password, Number(saltRound));
  return hashedPassword;
};
