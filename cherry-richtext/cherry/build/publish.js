const shell = require('shelljs');
const semver = require('semver')
const verisonChangeType = process.argv[2] || 'patch';


const VERSION_CHANGE_MAP = [
  'major',
  'minor',
  'patch'
];

(async () => {
  if(!VERSION_CHANGE_MAP.includes(verisonChangeType)) {
    console.error('illegal version type!')
    process.exit(1);
  }
  const latestVersion = getGanttChartVersion();
  const newVersion = semver.inc(latestVersion, 'patch')
  const tag = await setVersion(newVersion);
  console.log('new tag:', tag)
  // shell.exec('git add ./package.json');
  // shell.exec(`git commit -m "release: ${tag}"`);
  // shell.exec(`git tag ${tag}`);
  console.log('开始发布到 tnpm')
  shell.exec('tnpm publish')
  process.exit(0);
})();

function getGanttChartVersion() {
  return shell
    .exec('tnpm view @tencent/cherry-editor version')
    .replace(/(\r)?\n/, '');
}

function setVersion(version) {
  return new Promise((res, rej) => {
    const child = shell.exec(`npm version ${version}`, { async: true }).stdout;
    child.on('data', function(version) {
      res(version.toUpperCase());
    });
  });
}
