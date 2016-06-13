let execMap = (command) => exec(command);

let args = { message: '', version: '' };

export const setup = () => [
  `npm install`,
  `npm install -g webpack uglifyjs json webpack-dev-server`
].map(execMap);

export const minify = () => [
  `uglifyjs dist/e2d.js > dist/e2d.min.js`
].map(execMap);

export const clean = () => (process.platform.indexOf('win') === 0 ?
  //windows
  [
    `rm dist -r`,
    `rm node_modules -r`
  ] :
  //*nix
  [
    `rm -rf dist`,
    `rm -rf node_modules`
  ]
).map(execMap);

export const build = () => [
  `webpack --progress --colors --config webpack.config.js`
].map(execMap);

if (cli.input[0] === 'commit') {
  let rs = require('readline-sync');
  args.message = rs.question('Commit Message? ');
}
export const commit = () => [
  `git add --all .`,
  `git commit -am "${args.message}"`
].map(execMap);

if (cli.input[0] === 'tag') {
  let rs = require('readline-sync');
  args.version = rs.question('Commit Version? ');
  args.message = rs.question('Commit Message? ');
}
export const tag = () => [
    `mk setup`,
    `mk build`,
    `echo Version set to ${args.version}`,
    `json -I -f package.json -e "this.version='${args.version}'"`,
    `json -I -f bower.json -e "this.version='${args.version}'"`,
    `echo Tagging v${args.version}`,
    `git add .`,
    `git commit -am "${args.message}"`,
    `git tag -a v${args.version} -m ${args.message}`,
    `git push origin master --tags`,
    `npm publish`
].map(execMap);

export const push = () => [
  `echo Pushing`,
  `git push origin master`
].map(execMap);

export const watch = () => [
  `webpack-dev-server --config webpack-dev-server.config.js --progress --colors --content-base public/ --inline --open`
].map(execMap);

export default function () {
  return ['mk clean', 'mk setup', 'mk build', 'mk watch'].map(execMap);
}
