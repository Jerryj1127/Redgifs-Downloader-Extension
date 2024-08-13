import os
import json
import shutil

current_version = 9.9

def process_manifest(manifest_path, output_path):
    with open(manifest_path, 'r') as file:
        manifest = json.load(file)
    
    # Modify manifest version and background scripts for Firefox compatibility
    manifest['manifest_version'] = 2
    manifest['description'] = manifest['description'].replace("Chrome", "Firefox")
    manifest['permissions'].append("*://*.redgifs.com/*")
    manifest['permissions'].append("https://redgifsdlr.onrender.com/*")
    
    if 'background' in manifest and 'service_worker' in manifest['background']:
        manifest['background'] = {
            'scripts': [manifest['background']['service_worker']]
        }
    
    manifest['web_accessible_resources'] = manifest['web_accessible_resources'][0]['resources']

    # del manifest['content_scripts'][0]['type']

    manifest['browser_action'] = manifest['action']
    del manifest['action']

    # save the manifest
    with open(output_path, 'w') as file:
        json.dump(manifest, file, indent=2)
    
    global current_version
    current_version = manifest['version']

def replace_chrome_with_browser(js_file_path):
    with open(js_file_path, 'r') as file:
        content = file.read()
    
    content = content.replace('chrome', 'browser')
    
    with open(js_file_path, 'w') as file:
        file.write(content)

def process_js_files(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.js'):
                replace_chrome_with_browser(os.path.join(root, file))

def convert_extension(input_dir, output_dir):
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)
    shutil.copytree(input_dir, output_dir)

    manifest_path = os.path.join(output_dir, 'manifest.json')
    process_manifest(manifest_path, manifest_path)
    process_js_files(output_dir)

def create_version_file(version):
    with open('latest.json', 'w') as file:
        json.dump({"latest_version": version}, file, indent=2)


if __name__ == '__main__':
    input_directory = 'chrome'
    output_directory = 'firefox'
    
    convert_extension(input_directory, output_directory)
    create_version_file(current_version)

    print(f"Extension converted successfully from {input_directory} to {output_directory}")
