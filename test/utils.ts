export default {
  authorize: () => "token",
  isAuthorized: (secret) => secret === "wizard",
};
