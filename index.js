#!/usr/bin/env node

var commandLineArgs = require('command-line-args');

var generator = require("./bin/convert-snippet-to-vscode.js");

var cli = commandLineArgs([
    { name: 'snippetPath', alias: 's', type: String },
    { name: 'outputFile', alias: 'o', type: String }
]);

var options = cli.parse();
if (options.snippetPath && options.outputFile) {
    console.log("SnippetPath: ", options.snippetPath);
    console.log("OutputFile: ", options.outputFile);
}

generator.generateSnippets(options.snippetPath, options.outputFile);