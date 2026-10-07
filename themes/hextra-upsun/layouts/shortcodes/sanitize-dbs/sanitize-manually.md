<!-- shortcode start {{ .Name }} -->
{{ $query := "MariaDB [main]> SELECT * FROM users;" }}
{{ $result := `+----+------------+---------------+---------------------------+---------------+
    | ID | first_name | last_name     | user_email                | display_name  |
    +----+------------+---------------+---------------------------+---------------+
    |  1 | admin      | admin         | admin@yourcompany.com     | admin         |
    |  2 | john       | doe           | john.doe@gmail.com        | john          |
    |  3 | jane       | doe           | janedoe@ymail.com         | jane          |
    +----+------------+---------------+---------------------------+---------------+` }}
{{ if eq (.Get "database") "PostgreSQL" }}
  {{ $query = "main=> SELECT * FROM users;" }}
  {{ $result = `id   |                user_email               |     display_name
    -----+-----------------------------------------+-----------------------
    3501 | daniel02@yourcompany.com                | Jason Brown
    3502 | ismith@kim.com                          | Sandra Griffin
    3503 | olee@coleman-rodriguez.com              | Miss Christine Morgan`}}
{{ end }}
Assumptions:

- `users` is the table where all of your PII is stored in the `staging` development database.
- `staging` is an exact copy of your production database.

1.  Connect to the `staging` database by running `{{ if eq ( .Get "framework") "Symfony" }}symfony{{ else }}{{ `{{< vendor/cli >}}` | .Page.RenderString }}{{ end }} sql -e staging`.

2.  Display all fields from your `users` table, to select which ones need to be redacted.
    Run the following query:

    ```sql
    {{ $query }}
    ```

    You see output like the following:

    ```sql
    {{ $result }}
    ```

3.  Change the fields where PII is contained with the [`UPDATE` statement](https://mariadb.com/kb/en/update/).
    For example, to change the display name of users with an email address not in your company's domain
    to a random value, run the following query:

    ```sql
    UPDATE users
    SET display_name==substring(md5(display_name||'$PLATFORM_PROJECT_ENTROPY') for 8);
    WHERE email NOT LIKE '%@yourcompany%'
    ```

    Adapt and run that query for all fields that you need to sanitize.
    If you modify fields that you shouldn't alter,
    [you can restore them](../../environments/restore.md) from the dump you took in step 1.

    You can create a script to automate the sanitization process to be run automatically on each new deployment.
    Once you have a working script, add your script to sanitize the database to [a `deploy` hook](../../create-apps/hooks/hooks-comparison.md#deploy-hook):

{{ if eq .Page.Site.Params.vendor.config.version 1 }}

    ```yaml {configFile="app"}
    hooks:
        deploy: |

            # ...
            
            cd /app/public
            if [ "$PLATFORM_ENVIRONMENT_TYPE" = production ]; then
                # Do whatever you want on the production site.
            else
                # The sanitization of the database should happen here (since it's non-production)
                sanitize_the_database.sh
            fi
    ```

{{ else }}

    ```yaml {configFile="app"}
    applications:
        myapp:
            
            # ...
            
            hooks:
                deploy: |

                    # ...

                    cd /app/public
                    if [ "$PLATFORM_ENVIRONMENT_TYPE" = production ]; then
                        # Do whatever you want on the production site.
                    else
                        # The sanitization of the database should happen here (since it's non-production)
                        sanitize_the_database.sh
                    fi
    ```

{{ end }}
<!-- shortcode end {{ .Name }} -->
