import { spawnSync } from "node:child_process";
import { access, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ALL, BARE_METAL, ESLINT, JAVASCRIPT, JS_CONFIG, MINIMAL, PRETTIER, VS_CODE } from "./constants.js";
import { editorPresets, langPresets } from "./presets.js";
import { deepEqual } from "./util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

class PackageBuilder {
  packageJson = false;
  git = false;
  packageManager = {};

  addGit(val) {
    this.git = val;
    return this;
  }

  addPackageManager(manager) {
    this.packageManager = manager;
    return this;
  }

  addPackageJson(init) {
    this.packageJson = init;
    return this;
  }
}

export class RequirementBuilder extends PackageBuilder {
  editor = {};
  language = {};
  category = {};
  flavour = {};

  addOns = [];
  addOnLock = false;

  path = "";

  constructor(path) {
    super();
    this.path = path;
  }

  addEditor(editor) {
    this.editor = editor;
    return this;
  }

  addFlavour(flavour) {
    if (this.addOnLock) throw new Error("Builder is locked");
    this.flavour = flavour;
    return this;
  }

  addLanguage(language) {
    this.language = language;
    return this;
  }

  addInstallationCategory(category) {
    this.category = category;
    if (deepEqual(category, ALL)) {
      this.addOns.push(PRETTIER);
      this.addOns.push(ESLINT);
      this.addOnLock = true;
    }
    if (deepEqual(category, MINIMAL)) {
      this.addOns.push(PRETTIER);
      this.addOnLock = true;
    }
    return this;
  }

  addAddOns(addOn) {
    if (this.addOnLock) throw new Error("Builder is locked");
    if (this.addOns.find((item) => item.key === addOn.key)) throw new Error(`Cannot add ${addOn.name} again`);
    this.addOns.push(addOn);
    return this;
  }

  async build() {
    const buildPath = join(__dirname, this.path);
    try {
      await access(join(buildPath, "src"));
    } catch (error) {
      // if buildpath does not exist
      await mkdir(join(buildPath, "src"), { recursive: true });
    }

    // flavour
    switch (this.flavour.key) {
      case BARE_METAL.key:
        await writeFile(join(buildPath, JS_CONFIG.files.main), JSON.stringify(langPresets[JAVASCRIPT.key][JS_CONFIG.key]));
        break;

      default:
        break;
    }

    // add-ons
    for (const item of this.addOns) {
      switch (item.key) {
        case PRETTIER.key:
          await writeFile(join(buildPath, PRETTIER.files.settings), JSON.stringify(langPresets[JAVASCRIPT.key][PRETTIER.key].settings));
          await writeFile(join(buildPath, PRETTIER.files.ignore), langPresets[JAVASCRIPT.key][PRETTIER.key].ignore);
          break;

        case ESLINT.key:
          await writeFile(join(buildPath, ESLINT.files.settings), JSON.stringify(langPresets[JAVASCRIPT.key][ESLINT.key].settings));
          await writeFile(join(buildPath, ESLINT.files.settings), langPresets[JAVASCRIPT.key][ESLINT.key].ignore);
          break;

        default:
          break;
      }
    }

    // editor
    const settings = structuredClone(editorPresets[VS_CODE.key].settings);
    const extensions = structuredClone(editorPresets[VS_CODE.key].extensions);

    switch (this.editor.key) {
      case VS_CODE.key:
        const editorPath = join(buildPath, "./.vscode");
        await mkdir(editorPath);

        if (this.addOns.find((item) => item.key === PRETTIER.key)) {
          settings["editor.defaultFormatter"] = VS_CODE.extensions[PRETTIER.key];
          extensions.recommendations.push(VS_CODE.extensions[PRETTIER.key]);
        }

        if (this.addOns.find((item) => item.key === ESLINT.key)) {
          extensions.recommendations.push(VS_CODE.extensions[ESLINT.key]);
        }

        await writeFile(join(editorPath, "./settings.json"), JSON.stringify(settings));
        await writeFile(join(editorPath, "./extensions.json"), JSON.stringify(extensions));
        break;

      default:
        break;
    }

    // npm init
    if (this.packageJson) {
      spawnSync("bash", ["./scripts/npm_init.sh", this.path], { stdio: "inherit" });
    }

    // git init
    if (this.git) {
      spawnSync("bash", ["./scripts/git_init.sh", this.path], { stdio: "inherit" });
    }
  }
}
