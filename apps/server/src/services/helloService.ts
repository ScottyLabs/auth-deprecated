export const helloService = {
  hello: (user: Express.User) => {
    return { message: `Hello, ${user.given_name}!` };
  },

  helloAuthenticated: (user: Express.User) => {
    return { message: `Hello, admin ${user.given_name}!` };
  },
};
