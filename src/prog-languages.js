import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ALL, BARE_METAL, ESLINT, JAVASCRIPT, MINIMAL, PRETTIER, VS_CODE } from "./keywords.js";
import { editorPresets, langPresets } from "./presets.js";
import { deepEqual } from "./util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

export class Common {
  editor;

  constructor({ editor = VS_CODE }) {
    this.editor = editor;
  }
}

export class Javascript extends Common {
  Options;
  InstallCategory;
  AddOns;

  constructor(params) {
    super(params);
    this.Options = [BARE_METAL];
    this.InstallCategory = [MINIMAL, ALL];
    this.AddOns = [PRETTIER, ESLINT];
  }
}

export class RequirementBuilder {
  editor = {};
  language = {};
  category = {};
  flavour = {};
  addOns = [];
  path = "";

  constructor(path) {
    this.path = path;
  }

  lock = false;

  addEditor(editor) {
    if (lock) throw new Error("Builder is locked");
    this.editor = editor;
    return this;
  }

  addFlavour(flavour) {
    if (lock) throw new Error("Builder is locked");
    this.flavour = flavour;
    return this;
  }

  addLanguage(language) {
    if (lock) throw new Error("Builder is locked");
    this.language = language;
    return this;
  }

  addInstallationCategory(category) {
    if (lock) throw new Error("Builder is locked");
    this.category = category;
    if (deepEqual(category, ALL)) {
      this.addOns.push(PRETTIER);
      this.addOns.push(ESLINT);
      this.lock = true;
    }
    if (deepEqual(category, MINIMAL)) {
      this.addOns.push(PRETTIER);
      this.lock = true;
    }
    return this;
  }

  addAddOns(addOn) {
    if (lock) throw new Error("Builder is locked");
    if (this.addOns.find((item) => item.key === addOn.key)) throw new Error(`Cannot add ${addOn.name} again`);
    this.addOns.push(addOn);
    return this;
  }

  async build() {
    const buildPath = join(__dirname, "/exp-dir"); // replace with path after testing
    await mkdir(buildPath, { recursive: true });

    // add-ons
    for (const item of this.addOns) {
      switch (item.key) {
        case PRETTIER.key:
          await writeFile(join(buildPath, "/.prettierrc"), langPresets[JAVASCRIPT.key][PRETTIER.key].settings);
          await writeFile(join(buildPath, "/.prettierignore"), langPresets[JAVASCRIPT.key][PRETTIER.key].ignore);
          break;

        case ESLINT.key:
          await writeFile(join(buildPath, "/.eslintrc"), langPresets[JAVASCRIPT.key][ESLINT.key].settings);
          await writeFile(join(buildPath, "/.eslintignore"), langPresets[JAVASCRIPT.key][ESLINT.key].ignore);
          break;

        default:
          break;
      }
    }

    // editor
    const settings = structuredClone(editorPresets[VS_CODE.key].settings);
    const extensions = structuredClone(editorPresets[VS_CODE.key].extensions);

    switch (editor.key) {
      case VS_CODE.key:
        const editorPath = join(__dirname, "/exp-dir/.vscode");
        await mkdir(editorPath, { recursive: true });

        if (this.addOns.find((item) => item.key === PRETTIER.key)) {
          settings["editor.defaultFormatter"] = "esbenp.prettier-vscode";
          extensions.push("esbenp.prettier-vscode");
        }

        if (this.addOns.find((item) => item.key === ESLINT.key)) {
          extensions.push("dbaeumer.vscode-eslint");
        }

        await writeFile(join(editorPath, "./settings.json"), settings);
        await writeFile(join(editorPath, "./extensions.json"), extensions);
        break;

      default:
        break;
    }

    // flavour
  }
}
