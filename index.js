'use strict';

var path = require('path');
var fs = require('fs');
var snippetConverter = require('./snippetConverter');
var inquirer  = require('inquirer');
console.log("Folder location that contains Text Mate (.tmSnippet) and Sublime snippets (.sublime-snippet)");

var snippetPrompt = (function () {
inquirer.prompt([{
    type: 'input',
    name: 'snippetPath',
    message: 'Folder name:'
},{
    type: 'input',
    name: 'outputFileName',
    message: 'Output File Name:'
}], function (snippetAnswer) {
    var count = snippetConverter.processSnippetFolder(snippetAnswer.snippetPath, snippetAnswer.outputFileName);
    if (count < 0) {
    snippetPrompt();
    }
     
    console.log('');
    console.log('Snippet Converted!');
    console.log('');
    console.log('\r\n');
});
});
snippetPrompt();

