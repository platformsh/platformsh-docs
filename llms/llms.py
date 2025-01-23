import os
from github import Github
from github import Auth
import base64

github_token = os.environ.get("GH_API_KEY")
data_dir = "../sites/upsun/public"

class Llms:
    # function to concat config example from the template builder repo (for now: Theosakamg-PSH/template-builder)
    def get_template_builder_configs(self):
        # Create config-examples dir that will contains all downloaded config examples
        config_file_path = data_dir + "/llms-full.txt"

        print(config_file_path)
        auth = Auth.Token(github_token)
        g = Github(auth=auth)
        repo = g.get_repo("Theosakamg-PSH/template-builder")
        try:
            contents = repo.get_contents("templates")
            while contents:
                file_content = contents.pop(0)
                if file_content.type == "dir":
                    # print(file_content.name)
                    template_name = file_content.name
                    print(template_name)
                    # if .upsun folder exists in the remote template directory, add remote config.yaml content into /config-examples/config-examples.md file
                    try:
                        upsun_config_dir = repo.get_contents(file_content.path + '/files/.upsun')
                        while upsun_config_dir:
                            config_file = upsun_config_dir.pop(0)
                            file_data = base64.b64decode(config_file.content).decode('utf-8')
                            config_file_out = open(config_file_path, "a")
                            config_file_out.write('\n## Example of a ' + template_name.capitalize() + ' config \n')
                            config_file_out.write('This is an example of a config.yaml file to host a ``' + template_name + '`` stack on Upsun.\n')
                            config_file_out.write('```yaml {location="config.yaml"}\n')
                            config_file_out.write(file_data)
                            config_file_out.write('\n```\n')
                            config_file_out.close()
                    except Exception as e:
                        print("Error for stack " + template_name + ":", e)
                        pass
        except Exception as e:
            # print("Error:", e)
            pass

if __name__ == "__main__":
    llms = Llms()
    llms.get_template_builder_configs()
