const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class BackendServer {
  constructor() {
    this.serverProcess = null;
    this.isRunning = false;
  }

  async start() {
    if (this.isRunning) {
      console.log('Backend server already running');
      return;
    }

    console.log('Starting backend server...');
    
    try {
      // Path to the backend server
      const serverPath = path.join(__dirname, '../../backend/server.py');
      
      // Check if backend exists
      if (!fs.existsSync(serverPath)) {
        throw new Error('Backend server not found');
      }

      // Start Python server
      this.serverProcess = spawn('python', [serverPath], {
        cwd: path.join(__dirname, '../../backend'),
        env: {
          ...process.env,
          MONGO_URL: 'mongodb://localhost:27017/parrot_breeding',
          PORT: '8001'
        }
      });

      this.serverProcess.stdout.on('data', (data) => {
        console.log(`Backend stdout: ${data}`);
      });

      this.serverProcess.stderr.on('data', (data) => {
        console.error(`Backend stderr: ${data}`);
      });

      this.serverProcess.on('close', (code) => {
        console.log(`Backend process exited with code ${code}`);
        this.isRunning = false;
      });

      this.isRunning = true;
      console.log('Backend server started successfully');
      
    } catch (error) {
      console.error('Failed to start backend server:', error);
      throw error;
    }
  }

  stop() {
    if (this.serverProcess && this.isRunning) {
      console.log('Stopping backend server...');
      this.serverProcess.kill();
      this.isRunning = false;
    }
  }
}

module.exports = BackendServer;