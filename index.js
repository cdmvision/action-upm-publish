const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');

async function run() {
  try {
    const packageName = core.getInput('name');
    const upmBranch = core.getInput('upmBranch');
    
    const packageJsonBuffer = fs.readFileSync('Packages/' + packageName + '/package.json', {encoding:'utf8', flag:'r'});
    const packageJson = JSON.parse(packageJsonBuffer.toString());
    const packageVersion = packageJson.version;

    if (!(packageVersion && packageVersion.length !== 0))
      throw 'Package version is empty.';

    core.info('Check package version');
    const isVersionExist = await exec.exec('git', ['ls-remote', '--exit-code', '--tags', 'origin', packageVersion]);
    if (isVersionExist)
      throw 'Same version already exists: ' + packageVersion;

    core.info('Commit changes to upm branch');
    var returnValue = await exec.exec('git', ['subtree', 'split', '--prefix=Packages/' + packageName, '--branch', upmBranch]);
    if (returnValue != 0)
      throw 'Commit changes to upm [' + upmBranch + '] branch failed: ' + string(returnValue);

    core.info(util.format('Create version tag with: %s', packageVersion));
    returnValue = await exec.exec('git', ['tag', packageVersion, upmBranch]);
    if (returnValue != 0)
      throw 'Creating version tag [' + packageVersion + '] failed: ' + string(returnValue);

    core.info('Push version and upm branch');
    returnValue = await exec.exec('git', ['push', 'origin', upmBranch, '--tags', '--force']);
    if (returnValue != 0)
      throw 'Pushing version [' + packageVersion + '] and upm [' + upmBranch + '] branch failed: ' + string(returnValue);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
