const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');

async function run() {
  try {
    const packageName = core.getInput('name');
    const upmBranch = core.getInput('upmBranch');
    const versionPostfix = core.getInput('versionPostfix');
    const execOptions = {ignoreReturnCode:true};

    const packageJsonBuffer = fs.readFileSync('Packages/' + packageName + '/package.json', {encoding:'utf8', flag:'r'});
    const packageJson = JSON.parse(packageJsonBuffer.toString());
    var packageVersion = packageJson.version;

    if (!(packageVersion && packageVersion.length !== 0))
      throw new Error('Package version is empty.');

    if (versionPostfix && versionPostfix.length !== 0)
      packageVersion = packageVersion + '-' + versionPostfix;

    core.info('Check package version');
    const isVersionExist = await exec.exec('git', ['ls-remote', '--exit-code', '--tags', 'origin', packageVersion], execOptions);
    if (isVersionExist == 0)
      throw new Error('Same version already exists: ' + packageVersion);

    core.info('Commit changes to upm branch');
    var returnValue = await exec.exec('git', ['subtree', 'split', '--prefix=Packages/' + packageName, '--branch', upmBranch], execOptions);
    if (returnValue != 0)
      throw new Error('Commit changes to upm [' + upmBranch + '] branch failed: ' + string(returnValue));

    core.info('Create version tag with: ' + packageVersion);
    returnValue = await exec.exec('git', ['tag', packageVersion, upmBranch], execOptions);
    if (returnValue != 0)
      throw new Error('Creating version tag [' + packageVersion + '] failed: ' + string(returnValue));

    core.info('Push version and upm branch');
    returnValue = await exec.exec('git', ['push', 'origin', upmBranch, '--tags', '--force'], execOptions);
    if (returnValue != 0)
      throw new Error('Pushing version [' + packageVersion + '] and upm [' + upmBranch + '] branch failed: ' + string(returnValue));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
