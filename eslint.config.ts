import antfu from "@antfu/eslint-config";

export default antfu(
  {
    stylistic: false,
  },
  {
    // A `@param` that would only repeat the name and type is left out.
    rules: {
      "jsdoc/check-param-names": ["warn", { disableMissingParamChecks: true }],
    },
  },
);
