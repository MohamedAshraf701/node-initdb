#!/usr/bin/env node
const { program } = require("commander");
const mkdirp = require("mkdirp");
const fs = require("fs"); // File system module for file operations
const path = require("path"); // Module for handling file paths
const { loadEnvFile } = require("process");
const { default: inquirer } = require("inquirer");
const { default: chalk } = require("chalk");
const figlet = require("figlet")
const copyPaste = require('copy-paste');

function capitalizeFirstChar(str) {
  if (!str) return str; // Return the string if it's empty or null
  return str.charAt(0).toUpperCase() + str.slice(1);
}

printBanner();

function printBanner() {
  const msg = "Node - InitDB";

  figlet(msg, (err, data) => {
    if (err) {
      console.log("Figlet error:", err);
      return;
    }
    console.log();
    console.log(chalk.cyan.bold(data));
    console.log();
    console.log(chalk.yellow.bold("🚀 Initialize your Node.js project in seconds!"));
    console.log(chalk.green("✨ Choose a database, web framework, and language."));
    console.log();
    console.log(
      chalk.magentaBright("Usage: ") +
      chalk.yellow("node-initdb ") +
      chalk.white("-m <-m or --mongo | -s or --seque> -e <-e or --express | -f or --fastify | -el or --elysia> -j <-j or --javascript | -t or --typescript> -n <-n or --npm | -ya or --yarn | -b or --bun | -pn or --pnpm>")
    );
    console.log();
    console.log(chalk.blue("Examples:"));
    console.log(chalk.cyan("  node-initdb -m -e -t -n") + chalk.gray(" # MongoDB + Express + TypeScript + npm"));
    console.log(chalk.cyan("  node-initdb -s -f -j -b") + chalk.gray(" # Sequelize + Fastify + JavaScript + bun"));
    console.log();
    console.log();
    console.log();
    console.log(chalk.yellow.bold("🚀 Add Module In Your Project!"));
    console.log(chalk.green("📂 Generates controllers, models, routes, auth & file uploads."));
    console.log();
    console.log(
      chalk.magentaBright("Usage: ") +
      chalk.yellow("node-add ") +
      chalk.white(`"<module-name>"`) + chalk.gray(`  -m <-m or --mongo | -s or --seque> -e <-e or --express | -f or --fastify | -el or --elysia> -j <-j or --javascript | -t or --typescript>`)
    );
    console.log();
    console.log(chalk.blue("Examples:"));
    console.log(chalk.cyan(`  node-add "user" -m -e -t`) + chalk.gray(" user module # MongoDB + Express + TypeScript"));
    console.log(chalk.cyan(`  node-add "auth" -s -f -j`) + chalk.gray(" auth module # Sequelize + Fastify + JavaScript"));
    console.log();
  });
}

async function Language(options) {
  if (!options.javascript && !options.typescript) {
    const { language } = await inquirer.prompt([
      {
        name: "language",
        type: "list",
        message: "Choose a language:",
        choices: [
          { name: chalk.yellow("JavaScript"), value: "javascript" },
          { name: chalk.blue("TypeScript"), value: "typescript" }
        ]
      }
    ]);
    options[language] = true;
  }
}

async function DB(options) {
  if (!options.mongo && !options.seque) {
    const { database } = await inquirer.prompt([
      {
        name: "database",
        type: "list",
        message: "Choose a database:",
        choices: [
          { name: chalk.green("MongoDB"), value: "mongo" },
          { name: chalk.red("Sequelize"), value: "seque" }
        ]
      }
    ]);
    options[database] = true;
  }
}

async function FrameWork(options) {
  if (!options.express && !options.fastify && !options.elysia) {
    const { framework } = await inquirer.prompt([
      {
        name: "framework",
        type: "list",
        message: "Choose a framework:",
        choices: [
          { name: chalk.cyan("Express"), value: "express" },
          { name: chalk.magenta("Fastify"), value: "fastify" },
          { name: chalk.white("Elysia"), value: "elysia" }
        ]
      }
    ]);
    options[framework] = true;
  }
}

async function getModuleName(name) {
  if (!name) {
    const { moduleName } = await inquirer.prompt([
      {
        name: "moduleName",
        type: "input",
        message: "Please enter your module name:",
        validate: (input) => input.trim() !== "" || "Module name cannot be empty."
      }
    ]);
    return moduleName;
  }
  return name;
}

program
  .version("1.0.0")
  .description("A CLI tool to create a folder structure for Node.js projects")
  .arguments("[name]")
  .option("-m, --mongo", "SetUp Initializing For MongoDB")
  .option("-s, --seque", "SetUp Initializing For Sequelize")
  .option("-e, --express", "SetUp Initializing For express js")
  .option("-f, --fastify", "SetUp Initializing For fastify js")
  .option("-el, --elysia", "SetUp Initializing For elysia js")
  .option("-j, --javascript", "SetUp Initializing For javascript")
  .option("-t, --typescript", "SetUp Initializing For typescript")

  .action(async (name, options) => {

    setTimeout(async () => {
      // 'name' will be the first argument after the command
      name = await getModuleName(name);

      const capitalizeAndValidateFilename = (str) => {
        // Validate input
        if (typeof str !== "string" || !str) {
          console.log("Input must be a non-empty string");
          process.exit(1);
        }

        // Define invalid characters for filenames
        const invalidChars = /[<>:"\/\\|?*\x00-\x1F]/;

        // Check for invalid characters
        if (invalidChars.test(str)) {
          console.log("String contains invalid characters for a filename");
          process.exit(1);
        }

        // Capitalize the first character
        const capitalizedStr = str.charAt(0).toUpperCase() + str.slice(1);

        return capitalizedStr;
      };

      // Ask for missing selections
      await Language(options);
      await DB(options);
      await FrameWork(options);

      if (options.express && options.fastify && options.elysia) {
        console.error(
          "Please choose only one option: either --express or --fastify or --elysia, not all."
        );
        process.exit(1);
      }
      if (options.javascript && options.typescript) {
        console.error(
          "Please choose only one option: either --javascript or --typescript, not both."
        );
        process.exit(1);
      }

      if (!name) {
        console.log("Please provide a project name as an argument.");
        process.exit(1); // Exit if project name is not provided
      }

      let moduleName = capitalizeAndValidateFilename(name);
      const rootPath = path.join(process.cwd()); // Root path of the project
      let folder;
      let sfile;
      let mfile;
      if (options.fastify) {
        if (options.javascript) {
          const {
            folders,
            sfiles,
            mfiles,
          } = require("./structures/JS/fastify/module-fastify");
          folder = folders;
          sfile = sfiles;
          mfile = mfiles;
        } else {
          const {
            folders,
            sfiles,
            mfiles,
          } = require("./structures/TS/fastify/module-fastify");
          folder = folders;
          sfile = sfiles;
          mfile = mfiles;
        }
      } else if (options.elysia) {
        if (options.javascript) {
          const {
            folders,
            sfiles,
            mfiles,
          } = require("./structures/JS/elysia/module-elysia");
          folder = folders;
          sfile = sfiles;
          mfile = mfiles;
        } else {
          const {
            folders,
            sfiles,
            mfiles,
          } = require("./structures/TS/elysia/module-elysia");
          folder = folders;
          sfile = sfiles;
          mfile = mfiles;
        }
      } else {
        if (options.javascript) {
          const {
            folders,
            sfiles,
            mfiles,
          } = require("./structures/JS/express/module-express");
          folder = folders;
          sfile = sfiles;
          mfile = mfiles;
        } else {
          const {
            folders,
            sfiles,
            mfiles,
          } = require("./structures/TS/express/module-express");
          folder = folders;
          sfile = sfiles;
          mfile = mfiles;
        }
      }
      // Create directories as specified in folders array
      folder.forEach((folder) => {
        mkdirp.sync(path.join(rootPath, folder)); // Create directory synchronously
        console.log(`Folder "${folder}" created successfully.`);
      });
      let files;
      if (options.seque) {
        files = sfile(moduleName);
      } else {
        files = mfile(moduleName);
      }
      // Create files as specified in files array
      files.forEach((file) => {
        const filePath = file.folder
          ? path.join(rootPath, file.folder, file.name)
          : path.join(rootPath, file.name);
        fs.writeFileSync(filePath, file.content); // Write file synchronously
        console.log(`File "${file.name}" created successfully.`);
      });

      if (options.fastify) {
        if (options.javascript) {
          let value = `
// Add This Code Into index.Route file into Route folder

// Importing route 
const Routes${moduleName} = require("./${moduleName}.Route");

// Registering route with API v1 router
fastify.register(Routes${moduleName}, { prefix: "/api/v1/${moduleName}" });

          `;
          console.log(value);

          async function copyValuesToClipboard() {
            copyPaste.copy(value);
          }
          copyValuesToClipboard()
            .then(() => {
              console.log('copied to clipboard.');
            })
            .catch(err => {
              console.error('Error copying to clipboard:',err);
            });

        } else {
          let value = `
// Add This Code Into index.Route file into Route folder

// Importing route 
import RoutesH${moduleName} from './${moduleName}.Route';

// Registering route with API v1 router
server.register(Routes${moduleName}, { prefix: '/api/v1/${moduleName}' });

                    `;
          console.log(value);

          async function copyValuesToClipboard() {
            copyPaste.copy(value);
          }
          copyValuesToClipboard()
            .then(() => {
              console.log('copied to clipboard.');
            })
            .catch(err => {
              console.error('Error copying to clipboard:',err);
            });
        }
      }
      else if (options.elysia) {
        if (options.javascript) {
          let value = `
// Add This Code Into index.Route file into Route folder

// Importing route 
import { ${moduleName}Routes } from './${moduleName}.Route.js';

// Registering route with API v1 router
.group("/api/v1/${moduleName}", (app) => ${moduleName}Routes(app))

                    `;
          console.log(value);

          async function copyValuesToClipboard() {
            copyPaste.copy(value);
          }
          copyValuesToClipboard()
            .then(() => {
              console.log('copied to clipboard.');
            })
            .catch(err => {
              console.error('Error copying to clipboard:',err);
            });

        } else {       
           let value = `
// Add This Code Into index.Route file into Route folder

// Importing route 
import { h${moduleName}Routes } from "./${moduleName}.Route";

// Registering route with API v1 router
.group("/api/v1/${moduleName}", (group) => group.use(${moduleName}Routes))

                    `;
          console.log(value);

          async function copyValuesToClipboard() {
            copyPaste.copy(value);
          }
          copyValuesToClipboard()
            .then(() => {
              console.log('copied to clipboard.');
            })
            .catch(err => {
              console.error('Error copying to clipboard:',err);
            });
        }
      }
      else {
        // Execute command to install required packages
        if (options.javascript) {
          let value = `
// Add This Code Into index.Route file into Route folder

// Importing route 
const Routes${moduleName} = require("./${moduleName}.Route");

// Registering route with API v1 router
apiV1Router.use("/${moduleName}", Routes${moduleName});
              
                    `;
          console.log(value);

          async function copyValuesToClipboard() {
            copyPaste.copy(value);
          }
          copyValuesToClipboard()
            .then(() => {
              console.log('copied to clipboard.');
            })
            .catch(err => {
              console.error('Error copying to clipboard:',err);
            });
        } else {
          let value = `
// Add This Code Into index.Route file into Route folder

// Importing route 
import Router${moduleName} from "./${moduleName}.Route";

// Registering route with API v1 router
apiV1Router.use("/${moduleName}", Router${moduleName}); // Mounting Health router at '/Health'
              
                    `;
          console.log(value);

          async function copyValuesToClipboard() {
            copyPaste.copy(value);
          }
          copyValuesToClipboard()
            .then(() => {
              console.log('copied to clipboard.');
            })
            .catch(err => {
              console.error('Error copying to clipboard:',err);
            });
        }
      }
    }, 200);
  });

// Parse command line arguments
program.parse(process.argv);
