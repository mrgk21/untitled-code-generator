import { ESLINT, JAVASCRIPT, PRETTIER, VS_CODE } from "./keywords.js";

export const editorPresets = {
  [VS_CODE.key]: {
    extensions: {
      recommendations: [],
    },
    settings: {
      "editor.codeActionsOnSave": {
        "source.organizeImports": "always",
      },
      "editor.tabSize": 2,
      "editor.detectIndentation": false,
      "editor.insertSpaces": true,
      "editor.formatOnSave": true,
    },
  },
};

export const langPresets = {
  [JAVASCRIPT.key]: {
    [PRETTIER.key]: {
      settings: {
        tabWidth: 2,
        printWidth: 150,
        singleQuote: false,
        trailingComma: "always",
        semi: true,
      },
      ignore: [eol.auto("**/build"), eol.auto("**/dist"), eol.auto("**/node_modules")],
    },
    [ESLINT.key]: {
      settings: {},
      ignore: [eol.auto("**/build"), eol.auto("**/dist"), eol.auto("**/node_modules")],
    },
  },
};
