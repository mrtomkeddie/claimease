#!/usr/bin/env node

/**
 * ClaimEase Migration Verification Script
 * This script verifies that all required files and dependencies are present
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'App.tsx',
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'index.html',
  'src/main.tsx',
  'styles/globals.css',
  'components/TopMenu.tsx',
  'components/ClaimEaseLogo.tsx',
  'components/PipQuestionModal.tsx',
  'contexts/UserContext.tsx',
  'lib/utils.ts',
  'components/ui/button.tsx',
  'components/ui/card.tsx',
  'components/ui/dialog.tsx',
  'components/ui/progress.tsx',
  'components/ui/badge.tsx',
  'components/ui/tooltip.tsx',
  'components/ui/radio-group.tsx',
  'components/ui/label.tsx',
  'components/ui/textarea.tsx',
  'components/ui/sonner.tsx',
];

const requiredDependencies = [
  'react',
  'react-dom',
  'lucide-react',
  'sonner',
  'react-hook-form',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  '@radix-ui/react-dialog',
  '@radix-ui/react-progress',
  '@radix-ui/react-tooltip',
  '@radix-ui/react-radio-group',
  '@radix-ui/react-label',
];

console.log('🔍 Verifying ClaimEase migration...\n');

// Check required files
console.log('📁 Checking required files:');
let missingFiles = [];
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    missingFiles.push(file);
  }
});

// Check package.json dependencies
console.log('\n📦 Checking dependencies:');
let missingDeps = [];
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  requiredDependencies.forEach(dep => {
    if (allDeps[dep]) {
      console.log(`  ✅ ${dep} (${allDeps[dep]})`);
    } else {
      console.log(`  ❌ ${dep} - MISSING`);
      missingDeps.push(dep);
    }
  });
} else {
  console.log('  ❌ package.json not found');
}

// Check for specific version requirements
console.log('\n🔢 Checking version requirements:');
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = packageJson.dependencies || {};
  
  // Check specific versions
  const versionChecks = [
    { name: 'sonner', required: '2.0.3', actual: deps['sonner'] },
    { name: 'react-hook-form', required: '7.55.0', actual: deps['react-hook-form'] },
  ];
  
  versionChecks.forEach(({ name, required, actual }) => {
    if (actual === required) {
      console.log(`  ✅ ${name} has correct version (${required})`);
    } else {
      console.log(`  ⚠️  ${name}: expected ${required}, found ${actual || 'not installed'}`);
    }
  });
}

// Summary
console.log('\n📋 Migration Summary:');
if (missingFiles.length === 0 && missingDeps.length === 0) {
  console.log('  🎉 All required files and dependencies are present!');
  console.log('  🚀 Your ClaimEase app should work exactly the same.');
  console.log('\n💡 Next steps:');
  console.log('  1. Run: npm install');
  console.log('  2. Run: npm run dev');
  console.log('  3. Test all functionality');
} else {
  console.log(`  ❌ Missing ${missingFiles.length} files and ${missingDeps.length} dependencies`);
  
  if (missingFiles.length > 0) {
    console.log('\n📁 Missing files:');
    missingFiles.forEach(file => console.log(`    - ${file}`));
  }
  
  if (missingDeps.length > 0) {
    console.log('\n📦 Missing dependencies:');
    missingDeps.forEach(dep => console.log(`    - ${dep}`));
  }
}

console.log('\n🔧 To run this verification: node verify-migration.js');