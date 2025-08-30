#!/usr/bin/env node

/**
 * Dependency Optimization Script
 * Analyzes and suggests optimizations for better performance and bundle size
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

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

class DependencyOptimizer {
  constructor() {
    this.packageJson = this.loadPackageJson();
    this.recommendations = [];
  }

  loadPackageJson() {
    try {
      return JSON.parse(readFileSync('package.json', 'utf8'));
    } catch (error) {
      log('❌ Could not read package.json', 'red');
      process.exit(1);
    }
  }

  analyzeAstroDependencies() {
    log('\n🚀 Analyzing Astro-specific optimizations...', 'blue');

    const deps = this.packageJson.dependencies || {};
    const devDeps = this.packageJson.devDependencies || {};

    // Check for missing useful Astro integrations
    const recommendedIntegrations = {
      '@astrojs/sitemap': 'Generate XML sitemaps automatically',
      '@astrojs/compress': 'Compress HTML, CSS, and JS',
      '@astrojs/prefetch': 'Prefetch pages for faster navigation'
    };

    Object.entries(recommendedIntegrations).forEach(([pkg, description]) => {
      if (!deps[pkg] && !devDeps[pkg]) {
        this.recommendations.push({
          type: 'add',
          package: pkg,
          reason: description,
          category: 'performance'
        });
      }
    });

    // Check for Astro-specific optimizations
    if (deps['astro']) {
      log('✅ Astro is properly configured as a dependency', 'green');
    }
  }

  analyzeTailwindOptimizations() {
    log('\n🎨 Analyzing Tailwind CSS optimizations...', 'blue');

    const deps = this.packageJson.dependencies || {};

    if (deps['tailwindcss']) {
      // Suggest Tailwind plugins for better development
      const tailwindPlugins = {
        '@tailwindcss/typography': 'Better typography styles',
        '@tailwindcss/forms': 'Better form styling',
        '@tailwindcss/aspect-ratio': 'Aspect ratio utilities'
      };

      Object.entries(tailwindPlugins).forEach(([pkg, description]) => {
        if (!deps[pkg]) {
          this.recommendations.push({
            type: 'consider',
            package: pkg,
            reason: description,
            category: 'development'
          });
        }
      });
    }
  }

  analyzePerformanceOptimizations() {
    log('\n⚡ Analyzing performance optimizations...', 'blue');

    const deps = this.packageJson.dependencies || {};

    // Check for image optimization
    if (!deps['@astrojs/image'] && !deps['sharp']) {
      this.recommendations.push({
        type: 'add',
        package: 'sharp',
        reason: 'Image optimization for better performance',
        category: 'performance'
      });
    }

    // Check for bundle analysis tools
    if (!deps['@astrojs/bundle-analyzer']) {
      this.recommendations.push({
        type: 'add-dev',
        package: '@astrojs/bundle-analyzer',
        reason: 'Analyze bundle size and optimize',
        category: 'development'
      });
    }
  }

  checkUnusedDependencies() {
    log('\n🧹 Checking for potentially unused dependencies...', 'blue');

    try {
      // This is a simplified check - in a real scenario, you'd use tools like depcheck
      const deps = Object.keys(this.packageJson.dependencies || {});
      const commonUnused = ['lodash', 'moment', 'jquery'];

      const potentiallyUnused = deps.filter(dep => commonUnused.includes(dep));

      if (potentiallyUnused.length > 0) {
        potentiallyUnused.forEach(pkg => {
          this.recommendations.push({
            type: 'review',
            package: pkg,
            reason: 'Potentially unused or has lighter alternatives',
            category: 'cleanup'
          });
        });
      } else {
        log('✅ No obviously unused dependencies found', 'green');
      }
    } catch (error) {
      log('⚠️  Could not check for unused dependencies', 'yellow');
    }
  }

  generateOptimizedPackageJson() {
    log('\n📝 Generating optimized package.json suggestions...', 'blue');

    const optimized = { ...this.packageJson };

    // Add recommended scripts if missing
    const recommendedScripts = {
      'build:analyze': 'astro build && astro preview',
      'clean': 'rm -rf dist .astro node_modules/.astro',
      'type-check': 'astro check',
      'preview:network': 'astro preview --host'
    };

    optimized.scripts = { ...optimized.scripts, ...recommendedScripts };

    // Add engines if missing
    if (!optimized.engines) {
      optimized.engines = {
        node: '>=18.0.0',
        npm: '>=9.0.0'
      };
    }

    // Add browserslist if missing
    if (!optimized.browserslist) {
      optimized.browserslist = [
        '> 1%',
        'last 2 versions',
        'not dead'
      ];
    }

    return optimized;
  }

  printRecommendations() {
    log('\n📋 Optimization Recommendations:', 'blue');
    log('================================', 'blue');

    if (this.recommendations.length === 0) {
      log('✅ Your dependencies are well optimized!', 'green');
      return;
    }

    const categories = {
      performance: '⚡ Performance',
      development: '🛠️  Development',
      cleanup: '🧹 Cleanup'
    };

    Object.entries(categories).forEach(([category, title]) => {
      const categoryRecs = this.recommendations.filter(r => r.category === category);

      if (categoryRecs.length > 0) {
        log(`\n${title}:`, 'yellow');
        categoryRecs.forEach(rec => {
          const action = rec.type === 'add' ? 'npm install' :
                       rec.type === 'add-dev' ? 'npm install -D' :
                       rec.type === 'consider' ? 'Consider adding' : 'Review';

          log(`  ${action} ${rec.package}`, 'reset');
          log(`    → ${rec.reason}`, 'reset');
        });
      }
    });
  }

  run() {
    log('🔧 Dependency Optimization Analysis', 'blue');
    log('==================================', 'blue');

    this.analyzeAstroDependencies();
    this.analyzeTailwindOptimizations();
    this.analyzePerformanceOptimizations();
    this.checkUnusedDependencies();

    this.printRecommendations();

    // Generate optimized package.json
    const optimized = this.generateOptimizedPackageJson();
    writeFileSync('package-optimized.json', JSON.stringify(optimized, null, 2));

    log('\n✨ Analysis complete!', 'green');
    log('📄 Generated package-optimized.json with suggestions', 'blue');
  }
}

// Run the optimizer
const optimizer = new DependencyOptimizer();
optimizer.run();