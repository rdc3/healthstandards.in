/**
 * Script to copy images from content directories to public directory
 * This ensures images are available when using Next.js static export
 */

const fs = require('fs');
const path = require('path');

function copyContentImages() {
  const contentDir = path.join(process.cwd(), 'content');
  const publicDir = path.join(process.cwd(), 'public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  function copyImagesRecursively(sourceDir, targetDir = publicDir) {
    if (!fs.existsSync(sourceDir)) {
      return;
    }

    const items = fs.readdirSync(sourceDir);
    
    for (const item of items) {
      const sourcePath = path.join(sourceDir, item);
      const stat = fs.statSync(sourcePath);
      
      if (stat.isDirectory()) {
        copyImagesRecursively(sourcePath, targetDir);
      } else if (isImageFile(item)) {
        const targetPath = path.join(targetDir, item);
        
        // Only copy if file doesn't exist or source is newer
        if (!fs.existsSync(targetPath) || 
            fs.statSync(sourcePath).mtime > fs.statSync(targetPath).mtime) {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`Copied: ${item} -> public/${item}`);
        }
      }
    }
  }

  function isImageFile(filename) {
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }

  console.log('Copying content images to public directory...');
  copyImagesRecursively(contentDir);
  console.log('Content images copied successfully!');
}

// Run if called directly
if (require.main === module) {
  copyContentImages();
}

module.exports = { copyContentImages };