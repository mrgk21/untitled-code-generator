#! /usr/bin/env node
import { checkbox, input, select } from "@inquirer/prompts";
import { program } from "commander";
import { ALL, BARE_METAL, CUSTOM, ESLINT, JAVASCRIPT, MINIMAL, PRETTIER, VS_CODE } from "./constants.js";
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
    await builder.build();
  } catch (error) {
    console.log({ error });
  }
});

program.parse(process.argv);
