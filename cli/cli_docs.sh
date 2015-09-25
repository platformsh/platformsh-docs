platform list --format=json > commands.json

#FIXME get rid of ANSI
VERSION=`platform --version --raw` 
  
sed -e "s/{VERSION}/$VERSION/" README.tmpl.md > README.md

php summary.php
cp README.md ../README_cli.md
cp SUMMARY.md ../SUMMARY_cli.md
mkdir -p ../reference/cli/
rm -rf ../reference/cli/commands
mv -f commands/ ../reference/cli/commands