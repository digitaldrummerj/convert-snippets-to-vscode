# Convert Textmate or Sublime Code Snippets to VSCode

Based off the [VSCode Yeoman generator](https://github.com/Microsoft/vscode-generator-code), I have created a script to convert Textmate or Sublime snippets to a VSCode snippet json file. The intent is to be able to have multiple snippet language types in a single VSCode extension but the Yeoman template generator only does 1 snippet language.

One other difference from the [VSCode Yeoman generator](https://github.com/Microsoft/vscode-generator-code), is that if will recursively look through the given directory for the snippets.
 
## Install the Converter

```bash
npm install convert-snippets-to-vscode
```

```bash
npm install -g convert-snippets-to-vscode
```

## Run Converter

To launch the converter and be prompted for info simply type:

```bash
$ snippetToVsCode

Folder location that contains Text Mate (.tmSnippet) and Sublime snippets (.sublime-snippet)
? Folder name: c:\temp\Snippets\Css
? Output File Name: c:\temp\css.json 
```

To launch to convert and pass in command line arguments:

```bash
snippetToVsCode -s c:\temp\Snippets\Css -o c:\temp\css.json
```
## Converter Output

A json file with the converted templates in the vscode format.

Take the generated file, add it to your VSCode Extension that you generated with [VSCode Yeoman generator](https://github.com/Microsoft/vscode-generator-code) in the snippets directory.

Then update the package.json file in your VSCode Extension project with the new snippets file name and language that it supports. 

## License

[MIT](LICENSE)
