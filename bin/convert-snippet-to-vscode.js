#!/usr/bin/env node
'use strict';

var path = require('path');
var fs = require('fs');
var snippetConverter = require('../libs/snippetConverter');
var inquirer = require('inquirer');

var commandLineArgs = require('command-line-args');

function generateSnippet(snippetPath, outputFileName) {
    
    var convert = (function (snippetPath, outputFileName) {
        console.log("converting snippets");
        var count =  snippetConverter.processSnippetFolder(snippetPath, outputFileName);

        return count;
    });

    if (snippetPath && outputFileName) {
        console.log("cmd args found.  processing without prompt");
        convert(snippetPath, outputFileName);
        return;
    }


    var snippetPrompt = (function () {
        inquirer.prompt([{
            type: 'input',
            name: 'snippetPath',
            message: 'Folder name:'
        }, {
                type: 'input',
                name: 'outputFileName',
                message: 'Output File Name:'
            }], function (snippetAnswer) {
                var count = convert(snippetAnswer.snippetPath, snippetAnswer.outputFileName);
                if (count < 0) {
                    snippetPrompt();
                } 
            });
    });

    console.log("Folder location that contains Text Mate (.tmSnippet) and Sublime snippets (.sublime-snippet)");

    snippetPrompt();


}

exports.generateSnippets = generateSnippet;