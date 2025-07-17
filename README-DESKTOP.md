# 🖥️ PARROT BREEDING MANAGEMENT - DESKTOP .EXE BUILD GUIDE

## 📋 PREREQUISITES

### Required Software:
1. **Node.js** (v16 or higher) - Download from https://nodejs.org/
2. **Python** (v3.8 or higher) - Download from https://python.org/
3. **MongoDB** - Download from https://www.mongodb.com/try/download/community
4. **Git** - Download from https://git-scm.com/

### System Requirements:
- **Windows 10/11** (64-bit)
- **4GB RAM minimum** (8GB recommended)
- **2GB free disk space**

---

## 🚀 STEP-BY-STEP BUILD PROCESS

### **STEP 1: Clone Your Project**
```bash
# Clone from GitHub (after it's pushed)
git clone [YOUR-GITHUB-URL]
cd parrot-breeding-management

# Or download ZIP and extract
```

### **STEP 2: Setup Backend**
```bash
# Navigate to backend folder
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start MongoDB (in separate terminal)
mongod

# Test backend (optional)
python server.py
```

### **STEP 3: Setup Frontend**
```bash
# Navigate to frontend folder
cd ../frontend

# Install Node.js dependencies
npm install

# Install Electron dependencies
npm install electron electron-builder concurrently wait-on --save-dev

# Copy Electron configuration
cp electron-package.json package.json
```

### **STEP 4: Build React App**
```bash
# Build production React app
npm run build
```

### **STEP 5: Build Windows .EXE**
```bash
# Build Windows executable
npm run electron:build-win

# This creates:
# dist/NEXUS PERROQUET Breeding Manager Setup 1.0.0.exe
```

---

## 📁 FILE STRUCTURE AFTER BUILD

```
parrot-breeding-management/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── build/                    # React production build
│   ├── electron/
│   │   ├── main.js              # Electron main process
│   │   └── backend-server.js    # Backend integration
│   ├── dist/                    # Generated .exe files
│   │   └── NEXUS PERROQUET Breeding Manager Setup 1.0.0.exe
│   └── package.json
└── README-DESKTOP.md
```

---

## 🎯 DISTRIBUTION

### **Single File Distribution:**
- **File**: `NEXUS PERROQUET Breeding Manager Setup 1.0.0.exe`
- **Size**: ~150-200MB
- **Installation**: Double-click to install

### **User Requirements:**
- **MongoDB**: Users need MongoDB installed locally
- **Python**: Required for backend (can be bundled)
- **Windows**: Windows 10/11 64-bit

---

## 🔧 TROUBLESHOOTING

### **Common Issues:**

**1. MongoDB Connection Error**
```bash
# Solution: Start MongoDB service
net start MongoDB
# OR
mongod --dbpath C:\data\db
```

**2. Python Not Found**
```bash
# Solution: Add Python to PATH
# OR bundle Python with the app
```

**3. Build Fails**
```bash
# Solution: Clear cache and rebuild
npm run clean
npm install
npm run build
npm run electron:build-win
```

---

## 🎉 SUCCESS!

After successful build, you'll have:
- ✅ **Windows .exe installer**
- ✅ **Standalone desktop application**
- ✅ **Professional installer with icon**
- ✅ **Desktop shortcuts**
- ✅ **Start menu integration**

---

## 📞 SUPPORT

If you encounter issues:
1. Check MongoDB is running
2. Verify Python dependencies
3. Ensure Node.js version compatibility
4. Check antivirus software isn't blocking

**Your desktop application is ready for distribution!** 🚀