import fs from "fs";
import path from "path";

console.log("🚀 Starting FTP Upload Process...");

// Parse command line arguments
const args = process.argv.slice(2);
const helpFlag = args.includes("--help") || args.includes("-h");
const dryRunFlag = args.includes("--dry-run") || args.includes("-d");
const verboseFlag = args.includes("--verbose") || args.includes("-v");

if (helpFlag) {
  console.log(`
📤 TherapyTips FTP Upload Tool

Usage: bun run upload [environment] [options]

Arguments:
  environment    Target environment (dev, stage, prod) - defaults to prod

Options:
  --dry-run, -d     Show what would be uploaded without actually uploading
  --verbose, -v     Show detailed logging
  --help, -h        Show this help message

Environment Variables (in .env.development, .env.staging, .env.production):
  FTP_HOST         FTP server hostname
  FTP_PORT         FTP server port (default: 21)
  FTP_USER         FTP username
  FTP_PASSWORD     FTP password
  FTP_REMOTE_PATH  Remote directory path (default: /)
  FTP_SECURE       Use FTPS (default: false)

Examples:
  bun run upload                         Upload production build
  bun run upload dev                     Upload development build
  bun run upload stage --dry-run         Preview staging upload
  bun run upload prod --verbose          Upload production with detailed logs
`);
  process.exit(0);
}

// Determine target environment
const targetEnv = args.find(arg => !arg.startsWith("-")) || "prod";
const validEnvs = ["dev", "stage", "prod"];

if (!validEnvs.includes(targetEnv)) {
  console.error(`❌ Invalid environment: ${targetEnv}`);
  console.error(`Valid environments: ${validEnvs.join(", ")}`);
  process.exit(1);
}

console.log(`🎯 Target environment: ${targetEnv.toUpperCase()}`);

// Check if build directory exists
const buildPath = `./builds/${targetEnv}`;
if (!fs.existsSync(buildPath)) {
  console.error(`❌ Build directory not found: ${buildPath}`);
  console.error(`Please run build:${targetEnv} first`);
  process.exit(1);
}

// Load environment-specific configuration
const envFile = targetEnv === "dev" ? ".env.development" : 
                targetEnv === "stage" ? ".env.staging" : 
                ".env.production";

console.log(`📋 Loading FTP config from ${envFile}...`);

// FTP Configuration from environment variables
const ftpConfig = {
  host: process.env.FTP_HOST,
  port: parseInt(process.env.FTP_PORT || "21"),
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  remotePath: process.env.FTP_REMOTE_PATH || "/",
  secure: process.env.FTP_SECURE === "true"
};

// Validate required FTP configuration
const missingConfig = [];
if (!ftpConfig.host) missingConfig.push("FTP_HOST");
if (!ftpConfig.user) missingConfig.push("FTP_USER");
if (!ftpConfig.password) missingConfig.push("FTP_PASSWORD");

if (missingConfig.length > 0) {
  console.error(`❌ Missing required FTP configuration in ${envFile}:`);
  missingConfig.forEach(config => console.error(`   - ${config}`));
  process.exit(1);
}

if (verboseFlag) {
  console.log("⚙️ FTP Configuration:");
  console.log(`   Host: ${ftpConfig.host}`);
  console.log(`   Port: ${ftpConfig.port}`);
  console.log(`   User: ${ftpConfig.user}`);
  console.log(`   Password: ${"*".repeat(ftpConfig.password!.length)}`);
  console.log(`   Remote Path: ${ftpConfig.remotePath}`);
  console.log(`   Secure: ${ftpConfig.secure}`);
}

// Function to get all files in build directory recursively
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// Get all files to upload
const filesToUpload = getAllFiles(buildPath);
const relativeFiles = filesToUpload.map(file => ({
  local: file,
  remote: path.posix.join(ftpConfig.remotePath!, file.replace(buildPath, "").replace(/\\/g, "/"))
}));

console.log(`📁 Found ${filesToUpload.length} files to upload`);

if (dryRunFlag) {
  console.log("\n🔍 DRY RUN - Files that would be uploaded:");
  relativeFiles.forEach(file => {
    const size = fs.statSync(file.local).size;
    const sizeStr = size > 1024 * 1024 ? 
      `${(size / 1024 / 1024).toFixed(2)} MB` :
      size > 1024 ? 
      `${(size / 1024).toFixed(2)} KB` :
      `${size} B`;
    console.log(`   ${file.local} → ${file.remote} (${sizeStr})`);
  });
  console.log(`\n📊 Total files: ${filesToUpload.length}`);
  const totalSize = filesToUpload.reduce((sum, file) => sum + fs.statSync(file).size, 0);
  const totalSizeStr = totalSize > 1024 * 1024 ? 
    `${(totalSize / 1024 / 1024).toFixed(2)} MB` :
    totalSize > 1024 ? 
    `${(totalSize / 1024).toFixed(2)} KB` :
    `${totalSize} B`;
  console.log(`📊 Total size: ${totalSizeStr}`);
  console.log("\n✅ Dry run completed (no files were actually uploaded)");
  process.exit(0);
}

// Actual FTP upload implementation
// Uncomment the following section and install basic-ftp for real uploads:
/*
import { Client } from "basic-ftp";

async function uploadToFTP() {
  const client = new Client();
  client.ftp.verbose = verboseFlag;
  
  try {
    console.log(`\n📤 Connecting to ${ftpConfig.host}:${ftpConfig.port}...`);
    await client.access({
      host: ftpConfig.host!,
      port: ftpConfig.port,
      user: ftpConfig.user!,
      password: ftpConfig.password!,
      secure: ftpConfig.secure
    });
    console.log("✅ Connected to FTP server");
    
    // Ensure remote directory exists
    if (ftpConfig.remotePath !== "/") {
      console.log(`📁 Ensuring remote directory exists: ${ftpConfig.remotePath}`);
      await client.ensureDir(ftpConfig.remotePath!);
    }
    
    let uploadedCount = 0;
    const totalFiles = relativeFiles.length;
    
    for (const file of relativeFiles) {
      uploadedCount++;
      const progress = Math.round((uploadedCount / totalFiles) * 100);
      
      // Ensure remote directory exists for this file
      const remoteDir = path.posix.dirname(file.remote);
      if (remoteDir && remoteDir !== ".") {
        await client.ensureDir(remoteDir);
      }
      
      if (verboseFlag) {
        console.log(`📤 [${progress}%] Uploading: ${file.local} → ${file.remote}`);
      } else {
        process.stdout.write(`\r📤 Uploading files... ${progress}% (${uploadedCount}/${totalFiles})`);
      }
      
      await client.uploadFrom(file.local, file.remote);
    }
    
    if (!verboseFlag) {
      console.log(); // New line after progress
    }
    
    console.log("✅ All files uploaded successfully");
    
  } catch (error) {
    console.error("❌ FTP upload failed:", error);
    throw error;
  } finally {
    client.close();
  }
}

// Run the actual upload
await uploadToFTP();
*/

// For now, we'll simulate the upload process
console.log("\n📤 Starting upload process...");
console.log("⚠️  Note: This is a simulation. Actual FTP implementation is available above.");
console.log("💡 To enable real FTP upload:");
console.log("   1. Run: bun add basic-ftp");
console.log("   2. Uncomment the FTP implementation section in upload.ts");

// Simulated upload with progress
let uploadedCount = 0;
const totalFiles = relativeFiles.length;

for (const file of relativeFiles) {
  uploadedCount++;
  const progress = Math.round((uploadedCount / totalFiles) * 100);
  
  if (verboseFlag) {
    console.log(`📤 [${progress}%] Uploading: ${file.local} → ${file.remote}`);
  } else {
    // Simple progress indicator
    process.stdout.write(`\r📤 Uploading files... ${progress}% (${uploadedCount}/${totalFiles})`);
  }
  
  // Simulate upload time
  await new Promise(resolve => setTimeout(resolve, 10));
}

if (!verboseFlag) {
  console.log(); // New line after progress
}

console.log(`\n🎉 Upload simulation completed!`);
console.log(`📊 ${uploadedCount} files would be uploaded to ${ftpConfig.host}`);
console.log(`🎯 Environment: ${targetEnv.toUpperCase()}`);
console.log(`📁 Remote path: ${ftpConfig.remotePath}`);

// Implementation note
console.log(`
💡 Setup Instructions:

Environment Variables (add to your .env files):
  FTP_HOST=ftp.yourserver.com
  FTP_PORT=21
  FTP_USER=your-username
  FTP_PASSWORD=your-password
  FTP_REMOTE_PATH=/public_html
  FTP_SECURE=false

To enable real FTP uploads:
1. Install FTP package: bun add basic-ftp
2. Uncomment the FTP implementation in upload.ts
3. Test connection with --dry-run first

Example .env.production:
  NODE_ENV=production
  API_BASE_URL=https://api.therapytips.org
  FTP_HOST=ftp.yourserver.com
  FTP_USER=username
  FTP_PASSWORD=password
  FTP_REMOTE_PATH=/public_html
`); 