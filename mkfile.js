let execMap = (command) => exec(command);

import rs from 'readline-sync';

let args = { message: '', version: '' };

export const setup = () => [
  `npm install`,
  `npm install -g webpack uglifyjs json webpack-dev-server`
].map(execMap);

export const minify = () => [
  `uglifyjs dist/e2d.js > dist/e2d.min.js`
].map(execMap);

export function clean() {
  this.fs.delete('./dist');
}
export const build = () => [
  `mk clean`,
  `webpack`
].map(execMap);
console.log(cli.input);
if (cli.input[0] === 'commit') {
  args.message = rs.question('Commit Message? ');
}
export const commit = () => [
  `git add .`,
  `git commit -am "${args.message}"`
].map(execMap);

if (cli.input[0] === 'tag') {
  args.version = rs.question('Commit Version? ');
  args.message = rs.question('Commit Message? ');
}
export const tag = () => [
    `mk clean`,
    `mk build`,
    `echo Version set to ${args.version}`,
    `json -I -f package.json -e "this.version='${args.version}'"`,
    `json -I -f bower.json -e "this.version='${args.version}'"`,
    `echo Tagging v${args.version}`,
    `git add .`,
    `git commit -am "${args.message}"`,
    `git tag -a v${args.version} -m ${args.message}`,
    `git push origin master --tags`
].map(execMap);

export const push = () => [
  `echo Pushing`,
  `git push origin master`
].map(execMap);

export const watch = () => [
  `webpack-dev-server --config webpack-dev-server.config.js --progress --colors --content-base public/ --inline --open`
].map(execMap);

export default function () {
  return ['mk setup', 'mk clean', 'mk build', 'mk watch'].map(execMap);
}
