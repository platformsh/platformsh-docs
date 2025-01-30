#!/bin/bash

GH_API_KEY="${GITHUB_API_TOKEN}"  # Assurez-vous que la variable est exportée dans l'environnement

data_dir="./public"
config_file_path="$data_dir/llms-full.txt"
repo_owner="Theosakamg-PSH"
repo_name="template-builder"
templates_path="templates"

echo "Fetching templates from repository..."
mkdir -p "$data_dir"

# Récupérer la liste des templates
response=$(curl -s -H "Authorization: token $GH_API_KEY" \
  "https://api.github.com/repos/$repo_owner/$repo_name/contents/$templates_path")

template_dirs=$(echo "$response" | jq -r '.[] | select(.type == "dir") | .name')

for template_name in $template_dirs; do
  echo "Processing template: $template_name"

  upsun_config_path="$templates_path/$template_name/files/.upsun"

  upsun_response=$(curl -s -H "Authorization: token $GH_API_KEY" -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$repo_owner/$repo_name/contents/$upsun_config_path")

  if echo "$upsun_response" | jq -e 'if type=="array" then . else empty end' > /dev/null; then
    config_files=$(echo "$upsun_response" | jq -r '.[] | select(.type == "file") | .download_url')

    for config_url in $config_files; do
      echo "Downloading config from: $config_url"
      # Fetch the file content from GitHub API
      config_data=$(curl -s -H "Authorization: token $GH_API_KEY" -H 'Accept: application/vnd.github.v3.raw' "$config_url")

      echo -e "\n## Example of a ${template_name} config\n" >> "$config_file_path"
      echo -e "This is an example of a config.yaml file to host a \`$template_name\` stack on Upsun.\n" >> "$config_file_path"
      echo -e "\`\`\`yaml {location=\"config.yaml\"}" >> "$config_file_path"
      echo -e "$config_data" >> "$config_file_path"
      echo -e "\`\`\`\n" >> "$config_file_path"
    done
  else
    echo "No .upsun folder for $template_name"
    #echo "$upsun_response"  # Affiche la réponse brute pour le diagnostic
    continue
  fi

done

echo "Processing complete. Output saved to $config_file_path"
