const config = {
  TOKEN_KEY: process.env.JWT_SECRET || "my-secret-key",
  PORT: process.env.PORT || "3000",
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/auth',
};

if (!config.TOKEN_KEY) {
  throw new Error('JWT is not defined!');
}

export { config };