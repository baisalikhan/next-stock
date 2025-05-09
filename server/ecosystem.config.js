module.exports = {
  app: [
    {
      name: "inventory-management",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "developement",
        ENV_VAR1: "environment-variable",
      },
    },
  ],
};
