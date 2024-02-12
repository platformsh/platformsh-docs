#!/usr/bin/env bash

cp shared/pages/commands.md $1

VERSION=$($2 version)
printf "\n# $VERSION\n" >> $1

printf "\n- [Installation](/administration/cli#1-install)" >> $1
printf "\n- [Open an issue](https://github.com/platformsh/cli/issues)\n" >> $1

printf "\n## All commands\n" >> $1
printf "\n<!-- vale off -->\n" >> $1

$2 list --format=md | tail -n +2 >> $1

printf "\n<!-- vale on -->\n" >> $1
# amendments
#sed -i 's/e\.g\./for example/g' $1
#sed -i 's/ csv,/ `csv`,/gI' $1
#sed -i 's/ table,/ `table`,/gI' $1
#sed -i 's/ tsv,/ `tsv`,/gI' $1
#sed -i 's/or plain/or `plain`/gI' $1
#sed -i 's/Platform\.sh/{{ vendor\/name }}/g' $1
#sed -i 's/Upsun/{{ vendor\/name }}/g' $1
#sed -i "s/Do not/Don't/gI" $1
#sed -i "s/do not/don't/g" $1
#sed -i "s/\'bitbucket\'/`bitbucket`/gI" $1
#sed -i "s/\'bitbucket_server\'/`bitbucket_server`/gI" $1
#sed -i "s/'github'/`github`/gI" $1
#sed -i "s/'gitlab'/`gitlab`/gI" $1
#sed -i "s/'webhook'/`webhook`/gI" $1
#sed -i "s/'health.email'/`health.email`/gI" $1
#sed -i "s/'health.pagerduty'/`health.pagerduty`/gI" $1
#sed -i "s/'health.slack'/`health.slack`/gI" $1
#sed -i "s/'health.webhook'/`health.webhook`/gI" $1
#sed -i "s/'httplog'/`httplog`/gI" $1
#sed -i "s/'script'/`script`/gI" $1
#sed -i "s/'newrelic'/`newrelic`/gI" $1
#sed -i "s/'splunk'/`splunk`/gI" $1
#sed -i "s/'sumologic'/`sumologic`/gI" $1
#sed -i "s/'syslog'/`syslog`/gI" $1
#sed -i "s/pending, in_progress, complete/`pending`, `in_progress`, `complete`/gI" $1
#sed -i "s/in_progress, pending, complete, or cancelled/`in_progress`, `pending`, `complete` or `cancelled`/gI" $1
#sed -i "s/--state=in_progress,pending/`--state=in_progress,pending`/gI" $1
#sed -i "s/(txt, json, or md)/(`txt`, `json`, or `md`)/gI" $1
#sed -i "s/Available columns: id\*, title\*, status\*, type\*, created, machine_name, updated (* = default columns)/Available columns: `id*`, `title*`, `status*`, `type*`, `created`, `machine_name`, `updated` (`*` = default columns)/gI" $1
#sed -i "s/Available columns: id\*, created\*, description\*, type\*, state\*, result\*, completed, progress, time_build, time_deploy, time_execute, time_wait (\* = default columns)/Available columns: `id*`, `created*`, `description*`, `type*`, `state*`, `result*`, `completed`, `progress`, `time_build`, `time_deploy`, `time_execute`, `time_wait` (`*` = default columns)/gI" $1

git add $1
