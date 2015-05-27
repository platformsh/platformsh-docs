#!/usr/bin/env python

'''
Recursively creates an md file for all rst
files in the source t directory and below.
'''

import sys, os, re, subprocess
target = 'gitbook/'
source = './'

if len(sys.argv) >= 2: target = sys.argv[1]

rst_files = []
for root, dirnames, filenames in os.walk(source):
    for name in filenames:
        if name.endswith("rst"):
            rst_files.append(os.path.join(root, name))

for rst in rst_files:
    md_file = target + re.sub('.(rst)$','',rst) + ".md"
    cmd=('pandoc --from=rst --to=markdown "{0}"').format(rst)
    markdown= subprocess.check_output(cmd, shell=True)
    if not os.path.exists(os.path.dirname(md_file)):
      os.makedirs(os.path.dirname(md_file))
    file = open(md_file, "w")
    file.write(markdown)
    print(cmd + " Wrote to :" + md_file)
    file.close()