module.exports = {
  client: {
    service: {
      name: "dashcode",
      // URL to the GraphQL API
      url: "https://justcause-graphql-staging.azurewebsites.net/graphql/",
    },
    // Files processed by the extension
    includes: ["src/**/*.vue", "src/**/*.js"],
  },
};
