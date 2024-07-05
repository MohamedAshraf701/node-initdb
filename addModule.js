#!/usr/bin/env node

const { folders, sfiles, mfiles } = require('./structures/module');
const { program } = require('commander');
const mkdirp = require('mkdirp');
const fs = require('fs'); // File system module for file operations
const path = require('path'); // Module for handling file paths

function capitalizeFirstChar(str) {
    if (!str) return str; // Return the string if it's empty or null
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
// Setting up the CLI tool with commander
program
    .version('1.0.0')
    .description('A CLI tool to create a folder structure for Node.js projects')
    .arguments('<name>')
    .option('-m, --mongo', 'SetUp Initializing For MongoDB')
    .option('-s, --seque', 'SetUp Initializing For Sequelize')
    .action((name, options) => {
        // 'name' will be the first argument after the command
         const capitalizeAndValidateFilename=(str)=> {
            // Validate input
            if (typeof str !== 'string' || !str) {
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
          }
        if (!name) {
            console.log('Please provide a project name as an argument.');
            process.exit(1); // Exit if project name is not provided
        } else if (!options.seque && !options.mongo) {
            console.log('Please choose one of the following options: --mongo or --seque');
            process.exit(1); // Exit if no valid option is provided
        } else {
            let moduleName =capitalizeAndValidateFilename(name);
            const rootPath = path.join(process.cwd()); // Root path of the project
            // Create directories as specified in folders array
            folders.forEach(folder => {
                mkdirp.sync(path.join(rootPath, folder)); // Create directory synchronously
                console.log(`Folder "${folder}" created successfully.`);
            });
            let files;
            if (options.seque) {
                files = sfiles(moduleName);
            } else {
                files = mfiles(moduleName);
            }
            // Create files as specified in files array
            files.forEach(file => {
                const filePath = file.folder ? path.join(rootPath, file.folder, file.name) : path.join(rootPath, file.name);
                fs.writeFileSync(filePath, file.content); // Write file synchronously
                console.log(`File "${file.name}" created successfully.`);
            });

            // Execute command to install required packages
            console.log(`
Add This Code Into Your Project Main file 

// Importing route 
const Routes${moduleName} = require("./Routes/${moduleName}.Route");

// Registering route with API v1 router
apiV1Router.use("/${moduleName}", Routes${moduleName});
`);
        }
    });

// Parse command line arguments
program.parse(process.argv);