import eol from "eol";
import { ESLINT, JAVASCRIPT, JS_CONFIG, PRETTIER, VS_CODE } from "./constants.js";

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
      ignore: [eol.after("**/build"), eol.after("**/dist"), eol.after("**/node_modules")].join(""),
    },
    [ESLINT.key]: {
      settings: {},
      ignore: [eol.after("**/build"), eol.after("**/dist"), eol.after("**/node_modules")].join(""),
    },
    [JS_CONFIG.key]: {
      compilerOptions: {
        moduleResolution: "NodeNext",
        module: "NodeNext",
      },
    },
  },
};
