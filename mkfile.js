let execMap = (command) => exec(command);
let runMap = function(command) {
  return this.run(command);
};


export const setup = () => [
  "npm install",
  "npm install -g webpack uglifyjs json webpack-dev-server"
].map(execMap);

export const minify = () => [
  "uglifyjs dist/e2d.js > dist/e2d.min.js"
].map(execMap);

export function clean() {
  this.fs.delete('./dist');
}

export const build = () => ['webpack'].map(execMap);

export const commit = () => [
  `git add .`,
  `git commit -am "${args.message}"`
].map(execMap);

export const version = () => [
    `echo Version set to ${args.version}`,
    `json -I -f package.json -e "this.version='${args.version}'"`,
    `json -I -f bower.json -e "this.version='${args.version}'"`
].map(execMap);

export const tag = () => [
    `echo Tagging v${args.version}`,
    `mk clean`,
    `mk build`,
    `mk commit ${args.message}`,
    `git tag -a v${args.version} -m ${args.message}`,
    `git push origin master --tags`
].map(execMap);

export const push = () => [
  `mk commit -am ${args.message}`,
  `git push origin master`
].map(execMap);

export const devServer = () => ['webpack-dev-server'].map(execMap);

export default function () {
  return ['setup', 'clean', 'build','devServer'].map(runMap);
}

let parseArgs = () => {
  let versionRegex = /\d+\.\d+\.\d+/;
  let versionVal = "";

  let messageRegex = /\".*\"/;
  let message = "";


  for (let arg of cli.input) {

      if (versionRegex.test(arg)) {
        versionVal = arg;
      }
      if (!versionRegex.test(arg) && !exports.hasOwnProperty(arg)) {
        message = arg;
      }
  }
  return {
    message,
    version: versionVal
  };
};

var args = parseArgs();
console.log(args);
