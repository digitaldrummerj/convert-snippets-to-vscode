# Convert Textmate or Sublime Code Snippets to VSCode

Based off the [VSCode Yeoman generator](https://github.com/Microsoft/vscode-generator-code), I have created a script to convert Textmate or Sublime snippets to a VSCode snippet json file. The intent is to be able to have multiple snippet language types in a single VSCode extension but the Yeoman template generator only does 1 snippet language.

One other difference from the [VSCode Yeoman generator](https://github.com/Microsoft/vscode-generator-code), is that if will recursively look through the given directory for the snippets.
 
## Install the Generator

1. Git this repo
1. run   

```bash
npm install
```

## Run Converter

To launch the converter simply type:

```bash
node index.js
```
## Generator Output

A json file with the converted templates.

Take the generated file and add it to your VSCode Extension that you generated with [VSCode Yeoman generator](https://github.com/Microsoft/vscode-generator-code) and add the file to the snippets directory.

Then update the package.json file in your VSCode Extension project with the new snippets file name and language. 

## License

[MIT](LICENSE)
