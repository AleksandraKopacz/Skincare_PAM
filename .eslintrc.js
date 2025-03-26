module.exports = {
  extends: ["handlebarlabs"],
  rules: {
    "react/jsx-props-no-spreading": 0,
    "react/jsx-curly-newline": 0,
    "react/style-prop-object": 0,
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never",
        "json": "never",
      }
   ]
  },
};
