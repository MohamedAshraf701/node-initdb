#!/usr/bin/env node
// Importing necessary modules
const { program } = require('commander');
const askQuestion = require('./init'); // Function to initialize questions
const { default: chalk } = require('chalk');
const { default: inquirer } = require('inquirer');
const readline = require('readline'); // Moved here so we can reinitialize it later
const figlet = require("figlet")

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

async function selectPackageManager(options) {
  if (!options.npm && !options.bun && !options.yarn && !options.pnpm) {
    const { pm } = await inquirer.prompt([
      {
        name: "pm",
        type: "list",
        message: "Choose your package manager:",
        choices: [
          { name: "npm", value: "npm" },
          { name: "bun", value: "bun" },
          { name: "yarn", value: "yarn" },
          { name: "pnpm", value: "pnpm" }
        ]
      }
    ]);
    options[pm] = true;
  }
}

async function askDefaultStructure(options) {
  // Only ask if the yes flag wasn't provided
  if (!options.yes) {
    const { useDefault } = await inquirer.prompt([
      {
        name: "useDefault",
        type: "confirm",
        message: "Do you want to use the default structure (skip interactive project setup)?",
        default: false
      }
    ]);
    // If the user confirms, mark options.yes true
    if (useDefault) {
      options.yes = true;
    }
  }
}

async function Compression(options) {
  if (options.compression === undefined) {
    const { compress } = await inquirer.prompt([
      {
        name: "compress",
        type: "confirm",
        message: "Do you want to include file compression middleware?",
        default: false
      }
    ]);
    options.compression = compress;
  }
}

// Setting up the CLI tool with commander
program
  .version('1.0.0')
  .description('A CLI tool to create a folder structure for Node.js projects')
  .option('-m, --mongo', 'SetUp Initializing For MongoDB')
  .option('-s, --seque', 'SetUp Initializing For Sequelize')
  .option('-y, --yes', 'Create default structure')
  .option('-c, --compression', 'Include file compression middleware')
  .option('-e, --express', 'SetUp Initializing For express js')
  .option('-f, --fastify', 'SetUp Initializing For fastify js')
  .option('-el, --elysia', 'SetUp Initializing For elysia js')
  .option('-j, --javascript', 'SetUp Initializing For javascript')
  .option('-t, --typescript', 'SetUp Initializing For typescript')
  .option('-n, --npm', "Use npm as the package manager")
  .option('-b, --bun', "Use bun as the package manager")
  .option('-ya,--yarn', "Use yarn as the package manager")
  .option('-pn, --pnpm', "Use pnpm as the package manager")
  .option('-h', 'Show All Details')
  .action((options) => {
    if (options.h) {
      return;
    }

    setTimeout(async () => {
      console.log(chalk.cyan("\n🔧 Initializing project setup...\n"));

      // Ask for missing selections
      await Language(options);
      await DB(options);
      await FrameWork(options);
      await selectPackageManager(options);
      await Compression(options);

      if (options.express && options.fastify && options.elysia) {
        console.error('Please choose only one option: either --express or --fastify or --elysia, not all.');
        process.exit(1);
      }
      if (options.javascript && options.typescript) {
        console.error('Please choose only one option: either --javascript or --typescript, not both.');
        process.exit(1);
      }

      const selectedOptions = [options.npm, options.yarn, options.pnpm, options.bun].filter(Boolean);
      if (selectedOptions.length > 1) {
        console.error('Please choose only one option: either --npm or --bun or --yarn or --pnpm, not more than one.');
        process.exit(1);
      }

      // Ask about default structure if -y wasn't provided already
      await askDefaultStructure(options);

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      // Existing conditions for mongo/seque options and default structure (--yes)
      if (options.yes) {
        askQuestion(9, options, rl); // Start asking initial questions with default structure
      } else {
        askQuestion(0, options, rl); // Start asking initial questions
      }
    }, 200);
  });

// Parse command line arguments
program.parse(process.argv);
