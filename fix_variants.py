import os
import glob
import re

files = glob.glob('**/*.tsx', recursive=True)

for filepath in files:
    if 'node_modules' in filepath or '.next' in filepath:
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'framer-motion' in content:
        # Add : any to const container = { and const item = {
        new_content = re.sub(r'const container = \{', r'const container: any = {', content)
        new_content = re.sub(r'const item = \{', r'const item: any = {', new_content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed {filepath}")
