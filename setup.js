const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const dependencies = require('./dependencies');

function runCommand(command) {
  return new Promise((resolve, reject) => {
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing command: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
        return;
      }
      resolve(stdout);
    });

    process.stdout.on('data', data => {
      console.log(data.toString());
    });

    process.stderr.on('data', data => {
      console.error(data.toString());
    });
  });
}

function addScriptsToPackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = require(packageJsonPath);

    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    packageJson.scripts.start = 'node index.js';
    packageJson.scripts.dev = 'nodemon index.js';
    packageJson.scripts.test = 'jest';

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Scripts added to package.json');
  } else {
    console.error('package.json not found.');
  }
}

async function setup() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');

    if (fs.existsSync(packageJsonPath)) {
      console.log('package.json already exists. Skipping npm init -y...');
    } else {
      console.log('Running npm init -y...');
      await runCommand('npm init -y');
      console.log('package.json created successfully.');
    }

    const packages = dependencies.package;
    if (packages.length > 0) {
      console.log('Installing dependencies...');
      await runCommand(`npm install ${packages.join(' ')}`);
      console.log('Dependencies installed successfully.');
    } else {
      console.log('No dependencies found in dependencies.js');
    }

    const devPackages = dependencies.dev_package;
    if (devPackages.length > 0) {
      console.log('Installing development dependencies...');
      await runCommand(`npm install --save-dev ${devPackages.join(' ')}`);
      console.log('Development dependencies installed successfully.');
    } else {
      console.log('No development dependencies found in dependencies.js');
    }

    addScriptsToPackageJson();
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setup();
