#!/usr/bin/env node

// Importing necessary modules
const { program } = require('commander');
const askQuestion = require('./init'); // Function to initialize questions

// Setting up the CLI tool with commander
program
    .version('1.0.0')
    .description('A CLI tool to create a folder structure for Node.js projects')
    .option('-m, --mongo', 'SetUp Initializing For MongoDB')
    .option('-s, --seque', 'SetUp Initializing For Sequelize')
    .option('-y, --yes', 'Create default structure')
    .action((options) => {
        if (options.yes) {
            if (!options.mongo && !options.seque) {
                console.log('Please choose one of the following options with -y --mongo or --seque');
                process.exit(1); // Exit if no valid option is provided
            } else {
                console.log('Creating default structure...');
                askQuestion(9, options); // Start asking initial question
            }
        } else if (!options.seque && !options.mongo) {
            console.log('Please choose one of the following options: --mongo or --seque');
            process.exit(1); // Exit if no valid option is provided
        } else {
            askQuestion(0, options); // Start asking initial question
        }
    });

// Parse command line arguments
program.parse(process.argv);
