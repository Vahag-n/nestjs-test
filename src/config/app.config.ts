export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
});
