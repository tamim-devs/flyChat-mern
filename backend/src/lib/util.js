import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
  const token = jwt.sign(
    { userId }, // Payload
    process.env.JWT_SECRET, // Secret key
    { expiresIn: "7d" } // Correct key name for expiration
  );

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true, // Prevent XSS attacks
    sameSite: "strict", // Prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development" // Use secure cookies in production
  });

  return token;
};

//  https --> secure http --> not secure