#!/usr/bin/env node

/**
 * AltroHR Project Setup Script
 * 
 * This script automatically sets up the entire AltroHR project
 * including installing dependencies, creating environment files,
 * and initializing the database.
 * 
 * Usage: node setup.js
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const os = require('os');

// Color codes for beautiful terminal output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bright: '\x1b[1m',
    dim: '\x1b[2m'
};

// Unicode symbols for better visual appeal
const symbols = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    rocket: '🚀',
    gear: '⚙️',
    folder: '📁',
    file: '📄',
    database: '🗄️',
    package: '📦',
    check: '✓',
    cross: '✗',
    arrow: '➤',
    star: '⭐'
};

class AltroHRSetup {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.projectRoot = process.cwd();
        this.backendPath = path.join(this.projectRoot, 'backend');
        this.frontendPath = path.join(this.projectRoot, 'frontend');

        this.requirements = {
            node: { min: '18.0.0', command: 'node --version' },
            npm: { min: '8.0.0', command: 'npm --version' },
            git: { min: '2.0.0', command: 'git --version' }
        };

        this.setupComplete = false;
    }

    // Utility methods for beautiful output
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const typeColors = {
            success: colors.green,
            error: colors.red,
            warning: colors.yellow,
            info: colors.cyan,
            header: colors.magenta + colors.bright,
            step: colors.blue + colors.bright
        };

        const typeSymbols = {
            success: symbols.success,
            error: symbols.error,
            warning: symbols.warning,
            info: symbols.info,
            header: symbols.star,
            step: symbols.arrow
        };

        console.log(
            `${colors.dim}[${timestamp}]${colors.reset} ` +
            `${typeColors[type]}${typeSymbols[type]} ${message}${colors.reset}`
        );
    }

    async question(prompt) {
        return new Promise((resolve) => {
            this.rl.question(`${colors.cyan}${symbols.info} ${prompt}${colors.reset}`, resolve);
        });
    }

    drawHeader() {
        const header = `
${colors.magenta}${colors.bright}
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║            ${symbols.rocket} AltroHR Project Setup Wizard ${symbols.rocket}             ║
║                                                              ║
║     Welcome to the automated setup for AltroHR System       ║
║         Your HR Management Solution Setup Assistant         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}
        `;
        console.clear();
        console.log(header);
        this.log('Starting AltroHR Project Setup...', 'header');
        console.log();
    }

    drawProgressBar(current, total, operation) {
        const percentage = Math.round((current / total) * 100);
        const filled = Math.round((current / total) * 30);
        const bar = '█'.repeat(filled) + '░'.repeat(30 - filled);

        process.stdout.write(`\r${colors.cyan}${symbols.gear} ${operation}: ${colors.reset}[${colors.green}${bar}${colors.reset}] ${percentage}%`);

        if (current === total) {
            console.log();
        }
    }

    async checkSystemRequirements() {
        this.log('Checking system requirements...', 'step');

        const platform = os.platform();
        this.log(`Detected platform: ${platform}`, 'info');

        let allRequirementsMet = true;

        for (const [tool, requirement] of Object.entries(this.requirements)) {
            try {
                const version = execSync(requirement.command, { encoding: 'utf8' }).trim();
                const versionNumber = version.match(/(\d+\.\d+\.\d+)/)?.[1];

                if (versionNumber && this.compareVersions(versionNumber, requirement.min) >= 0) {
                    this.log(`${tool}: ${versionNumber} ${symbols.check}`, 'success');
                } else {
                    this.log(`${tool}: Version ${requirement.min}+ required, found ${versionNumber || 'unknown'}`, 'error');
                    allRequirementsMet = false;
                }
            } catch (error) {
                this.log(`${tool}: Not installed ${symbols.cross}`, 'error');
                allRequirementsMet = false;
            }
        }

        if (!allRequirementsMet) {
            this.log('Some requirements are missing. Please install them first:', 'error');
            this.log('- Node.js (v18+): https://nodejs.org/', 'info');
            this.log('- npm (v8+): Comes with Node.js', 'info');
            this.log('- Git (v2+): https://git-scm.com/', 'info');

            const continue_ = await this.question('Do you want to continue anyway? (y/N): ');
            if (continue_.toLowerCase() !== 'y' && continue_.toLowerCase() !== 'yes') {
                process.exit(1);
            }
        }

        console.log();
        return true;
    }

    compareVersions(version1, version2) {
        const v1parts = version1.split('.').map(Number);
        const v2parts = version2.split('.').map(Number);

        for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
            const v1part = v1parts[i] || 0;
            const v2part = v2parts[i] || 0;

            if (v1part > v2part) return 1;
            if (v1part < v2part) return -1;
        }
        return 0;
    }

    async checkMongoDBConnection() {
        this.log('Checking MongoDB connection...', 'step');

        try {
            // Try to check if MongoDB is running
            execSync('mongosh --eval "db.runCommand({ping: 1})" --quiet', { encoding: 'utf8' });
            this.log('MongoDB is running and accessible', 'success');
            return true;
        } catch (error) {
            this.log('MongoDB is not running or not accessible', 'warning');
            this.log('You can still continue, but you\'ll need to start MongoDB later', 'info');

            const installMongo = await this.question('Would you like guidance on installing MongoDB? (y/N): ');
            if (installMongo.toLowerCase() === 'y' || installMongo.toLowerCase() === 'yes') {
                this.showMongoDBInstallGuide();
            }

            return false;
        }
    }

    showMongoDBInstallGuide() {
        this.log('MongoDB Installation Guide:', 'header');
        const platform = os.platform();

        switch (platform) {
            case 'win32':
                this.log('Windows: Download from https://www.mongodb.com/try/download/community', 'info');
                this.log('Or use: winget install MongoDB.Server', 'info');
                break;
            case 'darwin':
                this.log('macOS: brew install mongodb-community', 'info');
                break;
            case 'linux':
                this.log('Ubuntu: sudo apt install mongodb', 'info');
                this.log('CentOS: sudo yum install mongodb-server', 'info');
                break;
            default:
                this.log('Please check MongoDB documentation for your platform', 'info');
        }
        console.log();
    }

    async createEnvironmentFiles() {
        this.log('Creating environment files...', 'step');

        // Get user preferences
        const mongoUri = await this.question('MongoDB URI (default: mongodb://localhost:27017/altrohrs): ') || 'mongodb://localhost:27017/altrohrs';
        const jwtSecret = await this.question('JWT Secret (leave empty for auto-generated): ') || this.generateJWTSecret();
        const port = await this.question('Backend port (default: 5000): ') || '5000';
        const frontendPort = await this.question('Frontend port (default: 5173): ') || '5173';

        // Backend .env file
        const backendEnvContent = `# AltroHR Backend Environment Configuration
# Generated automatically by setup script

# Server Configuration
PORT=${port}
NODE_ENV=development

# Database Configuration
MONGO_URI=${mongoUri}

# Authentication
JWT_SECRET=${jwtSecret}

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Email Configuration (Optional - Configure later)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

# Security Settings
BCRYPT_ROUNDS=12
SESSION_TIMEOUT=480

# Development Settings
DEBUG=true
LOG_LEVEL=info
`;

        // Frontend .env file
        const frontendEnvContent = `# AltroHR Frontend Environment Configuration
# Generated automatically by setup script

# API Configuration
VITE_API_URL=http://localhost:${port}

# App Configuration
VITE_APP_NAME=AltroHR
VITE_APP_VERSION=1.0.0

# Development Settings
VITE_DEV_PORT=${frontendPort}
VITE_DEBUG=true
`;

        try {
            // Create backend .env file
            const backendEnvPath = path.join(this.backendPath, '.env');
            fs.writeFileSync(backendEnvPath, backendEnvContent);
            this.log(`Backend .env file created: ${backendEnvPath}`, 'success');

            // Create frontend .env file
            const frontendEnvPath = path.join(this.frontendPath, '.env');
            fs.writeFileSync(frontendEnvPath, frontendEnvContent);
            this.log(`Frontend .env file created: ${frontendEnvPath}`, 'success');

            // Create .env.example files for reference
            fs.writeFileSync(path.join(this.backendPath, '.env.example'), backendEnvContent);
            fs.writeFileSync(path.join(this.frontendPath, '.env.example'), frontendEnvContent);
            this.log('Example environment files created for reference', 'info');

        } catch (error) {
            this.log(`Error creating environment files: ${error.message}`, 'error');
            throw error;
        }

        console.log();
    }

    generateJWTSecret() {
        const crypto = require('crypto');
        return crypto.randomBytes(64).toString('hex');
    }

    async installDependencies() {
        this.log('Installing project dependencies...', 'step');

        try {
            // Install backend dependencies
            this.log('Installing backend dependencies...', 'info');
            this.drawProgressBar(1, 4, 'Backend dependencies');

            process.chdir(this.backendPath);
            execSync('npm install', { stdio: 'pipe' });
            this.drawProgressBar(2, 4, 'Backend dependencies');
            this.log('Backend dependencies installed successfully', 'success');

            // Install frontend dependencies
            this.log('Installing frontend dependencies...', 'info');
            this.drawProgressBar(3, 4, 'Frontend dependencies');

            process.chdir(this.frontendPath);
            execSync('npm install', { stdio: 'pipe' });
            this.drawProgressBar(4, 4, 'Frontend dependencies');
            this.log('Frontend dependencies installed successfully', 'success');

            // Return to project root
            process.chdir(this.projectRoot);

        } catch (error) {
            this.log(`Error installing dependencies: ${error.message}`, 'error');
            throw error;
        }

        console.log();
    }

    async initializeDatabase() {
        this.log('Initializing database...', 'step');

        const initializeData = await this.question('Would you like to initialize the database with sample data? (y/N): ');

        if (initializeData.toLowerCase() === 'y' || initializeData.toLowerCase() === 'yes') {
            try {
                process.chdir(this.backendPath);

                // Run database initialization script
                this.log('Running database initialization...', 'info');
                execSync('node scripts/initializeSettings.js', { stdio: 'inherit' });

                this.log('Creating admin user...', 'info');
                execSync('node scripts/createAdmin.js', { stdio: 'inherit' });

                // Ask if user wants sample data
                const sampleData = await this.question('Would you like to add sample employee data? (y/N): ');
                if (sampleData.toLowerCase() === 'y' || sampleData.toLowerCase() === 'yes') {
                    this.log('Adding sample data...', 'info');
                    execSync('node scripts/seedData.js', { stdio: 'inherit' });
                }

                this.log('Database initialized successfully', 'success');

            } catch (error) {
                this.log(`Error initializing database: ${error.message}`, 'warning');
                this.log('You can initialize the database manually later', 'info');
            }

            process.chdir(this.projectRoot);
        }

        console.log();
    }

    async createStartupScripts() {
        this.log('Creating startup scripts...', 'step');

        // Create start script for development
        const startScript = `#!/bin/bash

# AltroHR Development Startup Script
# This script starts both backend and frontend in development mode

echo "🚀 Starting AltroHR Development Environment..."

# Function to handle cleanup
cleanup() {
    echo "\\n🛑 Stopping AltroHR services..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Trap cleanup function on script exit
trap cleanup SIGINT SIGTERM

# Start backend
echo "📦 Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

# Wait for both processes
echo "✅ AltroHR is running!"
echo "   Backend:  http://localhost:5000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

wait
`;

        const startScriptWindows = `@echo off
title AltroHR Development Environment

echo 🚀 Starting AltroHR Development Environment...

REM Start backend
echo 📦 Starting backend server...
start "AltroHR Backend" cmd /k "cd backend && npm run dev"

REM Wait for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend  
echo 🎨 Starting frontend server...
start "AltroHR Frontend" cmd /k "cd frontend && npm run dev"

echo ✅ AltroHR is running!
echo    Backend:  http://localhost:5000
echo    Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul
`;

        try {
            // Create bash script for Unix systems
            fs.writeFileSync(path.join(this.projectRoot, 'start-dev.sh'), startScript);

            // Make it executable on Unix systems
            if (os.platform() !== 'win32') {
                execSync('chmod +x start-dev.sh');
            }

            // Create batch script for Windows
            fs.writeFileSync(path.join(this.projectRoot, 'start-dev.bat'), startScriptWindows);

            this.log('Startup scripts created:', 'success');
            this.log('  - start-dev.sh (Unix/Linux/macOS)', 'info');
            this.log('  - start-dev.bat (Windows)', 'info');

        } catch (error) {
            this.log(`Error creating startup scripts: ${error.message}`, 'warning');
        }

        console.log();
    }

    async showCompletionSummary() {
        const summary = `
${colors.green}${colors.bright}
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║               ${symbols.success} Setup Completed Successfully! ${symbols.success}             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}

${colors.cyan}${symbols.info} What's been set up:${colors.reset}
  ${symbols.check} System requirements verified
  ${symbols.check} Environment files created
  ${symbols.check} Dependencies installed
  ${symbols.check} Database initialized
  ${symbols.check} Startup scripts created

${colors.yellow}${symbols.rocket} How to start AltroHR:${colors.reset}

  ${colors.bright}Option 1 - Use startup scripts:${colors.reset}
    ${os.platform() === 'win32' ? 'start-dev.bat' : './start-dev.sh'}

  ${colors.bright}Option 2 - Manual start:${colors.reset}
    Terminal 1: cd backend && npm run dev
    Terminal 2: cd frontend && npm run dev

${colors.magenta}${symbols.star} Access URLs:${colors.reset}
  Frontend: ${colors.cyan}http://localhost:5173${colors.reset}
  Backend:  ${colors.cyan}http://localhost:5000${colors.reset}

${colors.green}${symbols.info} Default Admin Credentials:${colors.reset}
  Email:    admin@altrohrs.com
  Password: admin123

${colors.yellow}${symbols.warning} Important Notes:${colors.reset}
  - Make sure MongoDB is running before starting the backend
  - Change default admin password after first login
  - Configure email settings in backend/.env for notifications

${colors.bright}${symbols.star} Happy coding with AltroHR! ${symbols.star}${colors.reset}
        `;

        console.log(summary);
    }

    async promptToStart() {
        const startNow = await this.question('Would you like to start AltroHR now? (y/N): ');

        if (startNow.toLowerCase() === 'y' || startNow.toLowerCase() === 'yes') {
            this.log('Starting AltroHR...', 'step');

            try {
                // Start both backend and frontend
                const platform = os.platform();
                const startCommand = platform === 'win32' ? 'start-dev.bat' : './start-dev.sh';

                spawn(startCommand, [], {
                    shell: true,
                    detached: true,
                    stdio: 'inherit'
                });

                this.log('AltroHR is starting up...', 'success');

            } catch (error) {
                this.log('Could not start automatically. Please use the startup scripts manually.', 'warning');
            }
        }
    }

    async run() {
        try {
            this.drawHeader();

            // Step 1: Check system requirements
            await this.checkSystemRequirements();

            // Step 2: Check MongoDB
            await this.checkMongoDBConnection();

            // Step 3: Create environment files
            await this.createEnvironmentFiles();

            // Step 4: Install dependencies
            await this.installDependencies();

            // Step 5: Initialize database
            await this.initializeDatabase();

            // Step 6: Create startup scripts
            await this.createStartupScripts();

            // Step 7: Show completion summary
            await this.showCompletionSummary();

            // Step 8: Prompt to start
            await this.promptToStart();

            this.setupComplete = true;

        } catch (error) {
            this.log(`Setup failed: ${error.message}`, 'error');
            this.log('You can run this setup script again to retry', 'info');
            process.exit(1);
        } finally {
            this.rl.close();
        }
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n' + colors.yellow + symbols.warning + ' Setup interrupted by user' + colors.reset);
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.log('\n' + colors.red + symbols.error + ' Unexpected error: ' + error.message + colors.reset);
    process.exit(1);
});

// Main execution
if (require.main === module) {
    const setup = new AltroHRSetup();
    setup.run();
}

module.exports = AltroHRSetup; 