#! /usr/bin/env node
import { checkbox, confirm, input, select } from "@inquirer/prompts";
import { program } from "commander";
import { ALL, BARE_METAL, CUSTOM, ESLINT, JAVASCRIPT, MINIMAL, NPM, PNPM, PRETTIER, VS_CODE, YARN } from "./constants.js";
import { RequirementBuilder } from "./prog-languages.js";

program.version("0.0.1").description("Generate boilerplates without hassle");

program.action(async () => {
  try {
    const path = await input({
      message: "Whats your directory path",
      default: ".",
    });

    let builder = new RequirementBuilder(path);
    builder = builder.addEditor(VS_CODE).addLanguage(JAVASCRIPT);

    const flavour = await select({
      message: "Select a flavour",
      choices: [
        {
          name: BARE_METAL.name,
          value: BARE_METAL,
          description: "The vanilla js experience",
        },
      ],
    });
    builder = builder.addFlavour(flavour);

    const installationCategory = await select({
      message: "Select an installation category",
      choices: [
        {
          name: ALL.name,
          value: ALL,
          description: "Everything possible",
        },
        {
          name: MINIMAL.name,
          value: MINIMAL,
          description: "The bare minimum youll need",
        },
        {
          name: CUSTOM.name,
          value: CUSTOM,
          description: "Choose your own poison",
        },
      ],
    });
    builder = builder.addInstallationCategory(installationCategory);

    if (installationCategory.key === CUSTOM.key) {
      const custom = await checkbox({
        message: "Select add-ons",
        choices: [
          {
            name: ESLINT.name,
            value: ESLINT,
          },
          {
            name: PRETTIER.name,
            value: PRETTIER,
          },
        ],
      });

      for (const item of custom) {
        builder = builder.addAddOns(item);
      }
    }

    const npmInitConfirm = await confirm({
      message: "Do you want npm init?",
      default: true,
    });
    builder = builder.addPackageJson(npmInitConfirm);

    const gitInitConfirm = await confirm({
      message: "Do you want git init?",
      default: true,
    });
    builder = builder.addGit(gitInitConfirm);

    const packageManager = await select({
      message: "Select a package manager",
      choices: [
        {
          name: NPM.name,
          value: NPM,
          description: "The default npm package manager",
        },
        {
          name: YARN.name,
          value: YARN,
          description: "Yarn, a bit better",
        },
        {
          name: PNPM.name,
          value: PNPM,
          description: "Shiny new kid in town",
        },
      ],
      default: PNPM,
    });
    builder = builder.addPackageManager(packageManager);

    await builder.build();
  } catch (error) {
    console.log({ error });
  }
});

program.parse(process.argv);
