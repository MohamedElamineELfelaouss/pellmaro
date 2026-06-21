#!/usr/bin/env python3
"""Build a minified, deploy-ready dist/ from site/.
Conservative minify: strips comments + indentation + blank lines (keeps newlines = ASI-safe).
Usage:  python build.py
"""
import re, shutil, os

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(ROOT, 'site')
DIST = os.path.join(ROOT, 'dist')

def minify_js(src):
    src = re.sub(r'/\*.*?\*/', '', src, flags=re.S)      # block comments
    out = []
    for line in src.split('\n'):
        s = line.strip()
        if s == '' or s.startswith('//'):                # blank + full-line // comments
            continue                                     # (// inside URLs is mid-line -> untouched)
        out.append(s)
    return '\n'.join(out)

def minify_css(src):
    src = re.sub(r'/\*.*?\*/', '', src, flags=re.S)
    return '\n'.join(l.strip() for l in src.split('\n') if l.strip())

def main():
    # Copy site -> dist. dirs_exist_ok avoids failures when dist/ is locked
    # (e.g. open in an editor or being served). Overwrites same-named files.
    shutil.copytree(SRC, DIST, dirs_exist_ok=True)
    for f in ['js/data.js', 'js/app.js', 'js/admin.js']:
        p = os.path.join(DIST, f)
        t = open(p, encoding='utf-8').read(); m = minify_js(t)
        open(p, 'w', encoding='utf-8').write(m)
        print(f"{f}: {len(t)} -> {len(m)} bytes")
    for f in ['css/styles.css']:
        p = os.path.join(DIST, f)
        t = open(p, encoding='utf-8').read(); m = minify_css(t)
        open(p, 'w', encoding='utf-8').write(m)
        print(f"{f}: {len(t)} -> {len(m)} bytes")
    print("dist/ built — ready to deploy")

if __name__ == '__main__':
    main()
