import os
import re

files_to_fix = [
    "app/tenant/layout.tsx",
    "app/superadmin/layout.tsx",
    "app/owner/layout.tsx"
]

pattern = re.compile(
    r'<SidebarMenuButton\s+asChild\s+className="(.*?)">\s*<Link\s+href="(.*?)">\s*(.*?)\s*</Link>\s*</SidebarMenuButton>',
    re.DOTALL
)

for filepath in files_to_fix:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        def replacer(match):
            class_name = match.group(1)
            href = match.group(2)
            inner_content = match.group(3)
            return f'<SidebarMenuButton render={{<Link href="{href}" />}} className="{class_name}">\n{inner_content}\n</SidebarMenuButton>'
            
        new_content = pattern.sub(replacer, content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")
