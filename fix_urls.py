import os
import re

root = 'frontend/src/pages'
for f in os.listdir(root):
    if f.endswith('.jsx'):
        path = os.path.join(root, f)
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Replace string literal wrapped in single quotes that starts with ${import.meta.env
        # e.g. '${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/register'
        # With backticks instead of outer single quotes
        
        # Actually, let's just do a simple string replace for the exact bad string:
        bad_str1 = "'${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}"
        good_str1 = "`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}"
        
        content = content.replace(bad_str1, good_str1)
        
        # Now we need to replace the trailing single quote with a backtick for these lines.
        # It's easier to use regex: replace `<good_str1>/some/path'` with `<good_str1>/some/path` `
        
        pattern = r"(\`\$\{import\.meta\.env\.VITE_API_BASE_URL \|\| 'http://localhost:8000'\}.*?)'"
        content = re.sub(pattern, r'\1`', content)
        
        with open(path, 'w', encoding='utf-8') as file:
            file.write(content)
