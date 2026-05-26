import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'src', 'pages');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // If the file contains `alert(`, we need to replace it and ensure Swal is imported
      if (content.match(/\balert\s*\(/)) {
        console.log(`Processing ${fullPath}`);
        
        // Replace alert(...) with Swal.fire(...)
        content = content.replace(/\balert\s*\(/g, 'Swal.fire(');
        
        // Add import if not present
        if (!content.includes("import Swal from 'sweetalert2'")) {
            // Find the last import statement
            const importRegex = /^import\s+.*?;?\s*$/gm;
            let match;
            let lastImportIndex = 0;
            while ((match = importRegex.exec(content)) !== null) {
                lastImportIndex = match.index + match[0].length;
            }
            
            if (lastImportIndex > 0) {
                content = content.slice(0, lastImportIndex) + "\nimport Swal from 'sweetalert2';" + content.slice(lastImportIndex);
            } else {
                content = "import Swal from 'sweetalert2';\n" + content;
            }
        }
        
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processDir(pagesDir);
console.log('Done replacing alerts.');
