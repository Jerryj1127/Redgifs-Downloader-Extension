import os
import zipfile
import json

def get_version(folder):
    manifest_path = os.path.join(folder, 'manifest.json')
    with open(manifest_path, 'r') as f:
        manifest = json.load(f)
    return manifest.get('version')

def zip_folder(folder_name, version, output_dir):
    output_filename = os.path.join(output_dir, f'Redgifs-Downloader-Extension-{folder_name.capitalize()}-v{version}.zip')
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(folder_name):

            # Skip '__MACOSX' directories
            if '__MACOSX' in dirs:
                dirs.remove('__MACOSX')
                
            # Skip hidden files and .DS_Store files
            files = [f for f in files if not (f.startswith('.') or f == '.DS_Store')]
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, folder_name)
                zipf.write(file_path, arcname)

def main():
    output_dir = 'releases'
    os.makedirs(output_dir, exist_ok=True)
    
    folders = ['chrome', 'firefox']
    for folder in folders:
        version = get_version(folder)
        zip_folder(folder, version, output_dir)

if __name__ == "__main__":
    main()