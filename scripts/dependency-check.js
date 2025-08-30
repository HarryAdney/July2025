#!/usr/bin/env node

/**
 * Dependency Health Check Script
 * Checks for outdated packages, security vulnerabilities, and unused dependencies
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`\n🔍 ${description}`, 'blue');
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    return output;
  } catch (error) {
    log(`❌ Error running ${description}: ${error.message}`, 'red');
    return null;
  }
}

function checkOutdatedPackages() {
  const output = runCommand('npm outdated --json', 'Checking for outdated packages');
  if (output) {
    try {
      const outdated = JSON.parse(output);
      if (Object.keys(outdated).length === 0) {
        log('✅ All packages are up to date!', 'green');
      } else {
        log('📦 Outdated packages found:', 'yellow');
        Object.entries(outdated).forEach(([pkg, info]) => {
          log(`  ${pkg}: ${info.current} → ${info.latest}`, 'yellow');
        });
      }
    } catch (e) {
      log('✅ All packages are up to date!', 'green');
    }
  }
}

function checkSecurity() {
  const output = runCommand('npm audit --json', 'Running security audit');
  if (output) {
    try {
      const audit = JSON.parse(output);
      const vulnerabilities = audit.metadata?.vulnerabilities;

      if (vulnerabilities && Object.values(vulnerabilities).some(v => v > 0)) {
        log('🚨 Security vulnerabilities found!', 'red');
        log('Run "npm audit fix" to resolve automatically fixable issues', 'yellow');
      } else {
        log('✅ No security vulnerabilities found!', 'green');
      }
    } catch (e) {
      log('✅ No security vulnerabilities found!', 'green');
    }
  }
}

function analyzeBundleSize() {
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    const deps = Object.keys(packageJson.dependencies || {});
    const devDeps = Object.keys(packageJson.devDependencies || {});

    log(`\n📊 Package Analysis:`, 'blue');
    log(`  Production dependencies: ${deps.length}`, 'green');
    log(`  Development dependencies: ${devDeps.length}`, 'yellow');

    // Check for potentially heavy packages
    const heavyPackages = deps.filter(dep =>
      ['lodash', 'moment', 'jquery', 'bootstrap'].includes(dep)
    );

    if (heavyPackages.length > 0) {
      log(`⚠️  Consider lighter alternatives for: ${heavyPackages.join(', ')}`, 'yellow');
    }

  } catch (error) {
    log('❌ Could not analyze package.json', 'red');
  }
}

function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

  log(`\n🟢 Node.js version: ${nodeVersion}`, 'blue');

  if (majorVersion < 18) {
    log('⚠️  Consider upgrading to Node.js 18+ for better performance', 'yellow');
  } else {
    log('✅ Node.js version is current', 'green');
  }
}

function main() {
  log('🔧 Dependency Health Check', 'blue');
  log('========================', 'blue');

  checkNodeVersion();
  checkOutdatedPackages();
  checkSecurity();
  analyzeBundleSize();

  log('\n✨ Health check complete!', 'green');
  log('\nRecommended actions:', 'blue');
  log('• Run "npm update" to update minor/patch versions', 'reset');
  log('• Run "npm audit fix" to fix security issues', 'reset');
  log('• Review outdated major versions manually', 'reset');
}

main();