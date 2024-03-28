#!/usr/bin/env bash

# Adds an entry into the access log file so we determine when the app is up and when requests for the search index occur

event="deployed"
if [ -n "${1}" ]; then
  event="${1}"
fi

site="unknown"
if [ -n "${2}" ]; then
  site="${2}"
fi

theTime=$(date +"%d/%b/%Y:%T %z")
ipAddres="0.0.0.0"
request="GET /event: ${event}"

printf '%s - - [%s] "%s" 000 0 "-" "%s"\n' "${ipAddres}" "${theTime}" "${request}" "${site}" >> /var/log/access.log
