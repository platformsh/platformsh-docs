symfony_cli=$1
: ${symfony_cli:=platform} #default to platform

#cleanup output directory

: > SUMMARY.md #truncate Summary
mkdir -p commands
platform list --format=json > commands.json

#FIXME get rid of ANSI
#VERSION=`platform --version --raw` 
VERSION="Platform.sh CLI version 2.4.1"
sed -e "s/{VERSION}/$VERSION/" README.tmpl.md > README.md

#Iterate over commands and create output markdown
for command in `jq -r '.commands[].name' commands.json`
do 
  if [ ! -z "$command" ] ; then
    file_name="commands/`echo "$command" | tr ":" "_"`.md"
    echo "Creating $file_name"
    #FIXME should use the real structure (with namespaces and such for
    # the structure of summary). This would be probably better done
    # in php.. or a normal programming language.
    $symfony_cli help $command --format=md > $file_name
    echo "* [$command]($file_name)" >> SUMMARY.md
  fi
done

gitbook build