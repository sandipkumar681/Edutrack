module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        envName: "APP_ENV",
        moduleName: "@env",
        path: `.env.${process.env.APP_ENV || "development"}`,
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
  ],
};
