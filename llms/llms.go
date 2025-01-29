package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"strings"

	"github.com/google/go-github/v53/github"
	"golang.org/x/oauth2"
)

const dataDir = "../sites/upsun/public"

// Llms struct
type Llms struct{}

// GetTemplateBuilderConfigs retrieves and processes configuration examples from GitHub
func (l *Llms) GetTemplateBuilderConfigs() {
	configFilePath := dataDir + "/llms-full.txt"
	fmt.Println(configFilePath)

	githubToken := os.Getenv("GH_API_KEY")
	if githubToken == "" {
		fmt.Println("GitHub token not found in environment variables")
		return
	}

	ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: githubToken})
	ctx := context.Background()
	client := github.NewClient(oauth2.NewClient(ctx, ts))

	repoOwner := "Theosakamg-PSH"
	repoName := "template-builder"
	dirPath := "templates"
	contents, _, _, err := client.Repositories.GetContents(ctx, repoOwner, repoName, dirPath, nil)
	if err != nil {
		fmt.Println("Error fetching repository contents:", err)
		return
	}

	for _, fileContent := range contents {
		if fileContent.GetType() == "dir" {
			templateName := fileContent.GetName()
			fmt.Println(templateName)

			upsunConfigPath := fileContent.GetPath() + "/files/.upsun"
			upsunContents, _, _, err := client.Repositories.GetContents(ctx, repoOwner, repoName, upsunConfigPath, nil)
			if err != nil {
				fmt.Println("Error for stack", templateName, ":", err)
				continue
			}

			for _, configFile := range upsunContents {
				if configFile.GetType() == "file" {
					content, err := configFile.GetContent()
					if err != nil {
						fmt.Println("Error reading file content:", err)
						continue
					}

					decodedContent, err := base64.StdEncoding.DecodeString(content)
					if err != nil {
						fmt.Println("Error decoding file content:", err)
						continue
					}

					fileData := string(decodedContent)
					output := fmt.Sprintf("\n## Example of a %s config \n", strings.Title(templateName)) +
						"This is an example of a config.yaml file to host a `" + templateName + "` stack on Upsun.\n" +
						"```yaml {location=\"config.yaml\"}\n" + fileData + "\n``\n"

					if err := appendToFile(configFilePath, output); err != nil {
						fmt.Println("Error writing to file:", err)
					}
				}
			}
		}
	}
}

func appendToFile(filename, text string) error {
	file, err := os.OpenFile(filename, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = file.WriteString(text)
	return err
}

func main() {
	llms := Llms{}
	llms.GetTemplateBuilderConfigs()
}
