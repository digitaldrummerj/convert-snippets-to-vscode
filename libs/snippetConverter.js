'use strict';

var path = require('path');
var fs = require('fs');
var plistParser = require('./plistParser');
var sax = require('sax');

function processSnippetFolder(folderPath, outputFileName) {
	var errors = [], snippets = {};
	var snippetCount = 0;
	var languageId = null;

	var count = convert(folderPath, snippets, errors);
	if (count <= 0) {
		console.log("No valid snippets found in " + folderPath + (errors.length > 0 ? '.\n' + errors.join('\n'): ''));
		return count;
	}
    
    var jsonOutput = JSON.stringify(snippets, null, '\t');
    
    // Bug Fix: change \\$ to just $.  Json Stringify changes the \$ in the sublime template to \\$ so VSCode inserts \$ instead of $ when using the snippets.
    fs.writeFile(outputFileName, jsonOutput.replace(/\\\\\$/g, '\$'), function (err) {
        if (err) throw err;
        console.log('File wrote to ' + outputFileName);
    });
	console.log(count + " snippet(s) found and converted." + (errors.length > 0 ? '\n\nProblems while converting: \n' + errors.join('\n'): ''));
	return count;

    function convert(folderPath) {
	
		var files = [];
        getFolderContent(folderPath, files,errors);
		if (errors.length > 0) {
			return -1;
		}
		
        files.forEach(function (fileName) {
			var extension = path.extname(fileName).toLowerCase();
			var snippet;
			if (extension === '.tmsnippet') {
				snippet = convertTextMate(fileName);
			} else if (extension === '.sublime-snippet') {
				snippet = convertSublime(fileName);
            }
            // console.log(snippet);
			if (snippet) {
				if (snippet.prefix && snippet.body) {
					snippets[getId(snippet.prefix)] = snippet;
					snippetCount++;
					guessLanguage(snippet.scope);
				} else {
					var filePath = fileName;
					if (!snippet.prefix) {
						errors.push(filePath + ": Missing property 'tabTrigger'. Snippet skipped.");
					} else {
						errors.push(filePath + ": Missing property 'content'. Snippet skipped.");
					}
				}
			}
		
		});
		return snippetCount;
	}

	
	function getId(prefix) {
		if (snippets.hasOwnProperty(prefix)) {
			var counter = 1;
			while (snippets.hasOwnProperty(prefix + counter)) {
				counter++;
			}
			return prefix + counter;
		}
		return prefix;
	}
	
	function guessLanguage(scopeName) {
		if (!languageId && scopeName) {
			var match;
			if (match = /(source|text)\.(\w+)/.exec(scopeName)) {
				languageId = match[2];
			}
		}		
	}
	
	function convertTextMate(filePath) {
		var body = getFileContent(filePath, errors);
		if (!body) {
			return;
		}
		
		var result = plistParser.parse(body);
		if (result.errors) {
			Array.prototype.push.apply(errors, result.errors)
		}
		var value = result.value;
		
		return {
			prefix: value.tabTrigger,
			body: value.content,
			description: value.name,
			scope: value.scope
		}
	}
	
	function convertSublime(filePath) {
		var body = getFileContent(filePath, errors);
		if (!body) {
			return;
		}		
		
		var parser = sax.parser(false, { lowercase: true });
		var text = null;
		var snippet = {
			prefix: '',
			body: '',
			description: '',
			scope: ''
		};
		
		parser.onerror = function (e) {
			errors.push(filePath + ": Problems parsing content content: " + e.message);
		};
		parser.ontext = function (s) {
			text += s;
		};
		parser.oncdata = function (s) {
			text += s;
		};		
		parser.onopentag = function (tag) {
			text = '';
		};
		parser.onclosetag = function (tagName) {
			switch (tagName) {
				case 'tabtrigger':
					snippet.prefix = text;
					break;
                case 'content':
                    // console.log('text', text);
					snippet.body = text;
					break;
				case 'description':
					snippet.description = text;
					break;
				case 'scope':
					snippet.scope = text;
					break;		
			}										
		
		}
		
        parser.write(body);
        // console.log(snippet);
		return snippet;
	}	
	

}

function getFolderContent(folderPath, filelist, errors) {
	try {
        if( folderPath[folderPath.length-1] != '/') folderPath=folderPath.concat('/');
        var files = fs.readdirSync(folderPath);
        filelist = filelist || [];
        files.forEach(function(file){
            if (fs.statSync(path.join(folderPath,file)).isDirectory()){
                filelist = getFolderContent(path.join(folderPath,file), filelist, errors);
            } else {
                filelist.push (path.join(folderPath, file));
            }
        });
        
        return filelist;
	} catch (e) {
		errors.push("Unable to access " + folderPath + ": " + e.message);
		return [];
	}
}

function getFileContent(filePath, errors) {
	try {
		var content = fs.readFileSync(filePath).toString();
		if (content === '') {
			errors.push(filePath + ": Empty file content");
        }
        // console.log(content);
		return content;
	} catch (e) {
		errors.push(filePath + ": Problems loading file content: " + e.message);
		return null;
	}
}

function isFile(filePath) {
	try {
		return fs.statSync(filePath).isFile()
	} catch (e) {
		return false;
	}
}

exports.processSnippetFolder = processSnippetFolder;