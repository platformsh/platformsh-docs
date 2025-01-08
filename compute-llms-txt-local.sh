
  # remove HTML attributes *=*
  sed -r -i -e 's/ ?([a-zA-Z0-9\@:-]){2,}="([][a-zA-Z0-9\.\_\!\+:='\''\;,\/\{\}\(\)\&><↗\ -]{0,})"//g' llms-result-backup.html
  # replace html comments
  sed -r -i -e 's/(<!--[][a-zA-Z0-9_\ \/:@()\*\?#,.-]+-->)//g' llms-result-backup.html
  # replace <style> tags
  sed -r -i -e 's/(<style>[][a-zA-Z0-9\.\_\!\+:='\''\;,\/\{\}\(\)#\&\n\ -]+<\/style>)//g' llms-result-backup.html

  # replace "<span> \ </span>" in the snippets as all is on the same line now
  sed -r -i -e 's/(<span>\\ <\/span>)//g' llms-result-backup.html

  # replace <pre|var> and </pre|var> tags
  sed -r -i -e 's/<(pre|var|span)>//g' llms-result-backup.html
  sed -r -i -e 's/<\/(pre|var|span)>//g' llms-result-backup.html
  # replace useless <div> and </div> tags
  sed -r -i -e 's/<(\/){0,}div([][a-zA-Z0-9\.\_\!\+:='\''\;,\/\{\}\(\)\&↗\ -]{0,})+>//g' llms-result-backup.html
  # replace " Terminal <code>" by "<code>"
  sed -r -i -e 's/ Terminal <code>/<code>/g' llms-result-backup.html
