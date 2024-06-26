// langugages
export const JAVASCRIPT = {
  name: "javascript",
  key: "JAVASCRIPT",
};
export const TYPESCRIPT = {
  name: "typescript",
  key: "TYPESCRIPT",
};

// flavour
export const BARE_METAL = {
  name: "bare metal",
  key: "BARE_METAL",
};
export const JS_CONFIG = {
  name: "jsconfig",
  key: "JS_CONFIG",
  files: {
    main: "jsconfig.json",
  },
};

// installation category
export const MINIMAL = {
  name: "minimal",
  key: "MINIMAL",
};
export const ALL = {
  name: "all",
  key: "ALL",
};
export const CUSTOM = {
  name: "custom",
  key: "CUSTOM",
};

// add-ons
export const PRETTIER = {
  name: "prettier",
  key: "PRETTIER",
  files: {
    settings: ".prettierrc",
    ignore: ".prettierignore",
  },
};
export const ESLINT = {
  name: "eslint",
  key: "ESLINT",
  files: {
    settings: ".eslintrc",
    ignore: ".eslintignore",
  },
};

// package managers
export const PNPM = {
  name: "pnpm",
  key: "PNPM",
  cmdKey: "pnpm",
};
export const YARN = {
  name: "yarn",
  key: "YARN",
  cmdKey: "yarn",
};
export const NPM = {
  name: "npm",
  key: "NPM",
  cmdKey: "npm",
};

//editor
export const VS_CODE = {
  name: "vs code",
  key: "VS_CODE",
  extensions: {
    [PRETTIER.key]: "esbenp.prettier-vscode",
    [ESLINT.key]: "dbaeumer.vscode-eslint",
  },
};
