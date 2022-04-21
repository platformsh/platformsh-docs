---
title: "Data in services"
weight: 3
description: |
  Update your application code to interact with and use managed service containers.
---


## Back to variables

Run the following command from the `add-db` branch locally:

```bash
touch .environment
```

Then copy the following into that file:

```txt
export DB_HOST=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r '.database[0].host')
export DB_PORT=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r '.database[0].port')
export DB_USER=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r '.database[0].username')
export DB_PATH=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r '.database[0].path')
```

This is the same variable-setting you did in the previous step.
The `.environment` file is something you can commit and use to dynamically set environment variables accessible to your apps.
It's sourced into the application container when the application is deployed, when it's started, and when you SSH into the container.

## Update the application

Now, update the application to use these variables. 
Open the main "Hello world" script, which for each language will be the following:

- PHP: `web/index.php`
- Python: `server.py`

Delete its contents and replace with the following:

{{< codetabs >}}
---
title=PHP
file=none
highlight=php
markdownify=false
---
<?php

declare(strict_types=1);
require __DIR__.'/../vendor/autoload.php';

try {

    // Connect to the database.
    $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s', getenv("DB_HOST"), getenv("DB_PORT"), getenv("DB_PATH"));
    
    $conn = new \PDO($dsn, getenv("DB_USER"), "", [
        \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
        \PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => TRUE,
        \PDO::MYSQL_ATTR_FOUND_ROWS => TRUE,
    ]);

    // Creating a table.
    $sql = "CREATE TABLE People (
      id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(30) NOT NULL,
      city VARCHAR(30) NOT NULL
      )";
    $conn->query($sql);

    // Insert data.
    $sql = "INSERT INTO People (name, city) VALUES
        ('Neil Armstrong', 'Moon'),
        ('Buzz Aldrin', 'Glen Ridge'),
        ('Sally Ride', 'La Jolla');";
    $conn->query($sql);

    // Show table.
    $sql = "SELECT * FROM People";
    $result = $conn->query($sql);
    $result->setFetchMode(\PDO::FETCH_OBJ);

    if ($result) {
        print <<<TABLE
<table>
<thead>
<tr><th>Name</th><th>City</th></tr>
</thead>
<tbody>
TABLE;
        foreach ($result as $record) {
            printf("<tr><td>%s</td><td>%s</td></tr>\n", $record->name, $record->city);
        }
        print "</tbody>\n</table>\n";
    }

    // Drop table
    $sql = "DROP TABLE People";
    $conn->query($sql);

} catch (\Exception $e) {
    print $e->getMessage();
}
<--->
---
title=Python
file=none
highlight=py
markdownify=false
---
import os
import pymysql
from http.server import BaseHTTPRequestHandler, HTTPServer

class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

        try:
            # Connect to the database.
            conn = pymysql.connect(host=os.getenv("DB_HOST"),
                                port=int(os.getenv("DB_PORT")),
                                database=os.getenv("DB_PATH"),
                                user=os.getenv("DB_USER"),
                                password="")
            print("set query")
            sql = '''
                    CREATE TABLE People (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(30) NOT NULL,
                    city VARCHAR(30) NOT NULL
                    )
                    '''

            cur = conn.cursor()
            cur.execute(sql)
            sql = '''
                    INSERT INTO People (name, city) VALUES
                    ('Neil Armstrong', 'Moon'),
                    ('Buzz Aldrin', 'Glen Ridge'),
                    ('Sally Ride', 'La Jolla');
                    '''

            cur.execute(sql)

            # Show table.
            sql = '''SELECT * FROM People'''
            cur.execute(sql)
            result = cur.fetchall()

            table = '''<table>
    <thead>
    <tr><th>Name</th><th>City</th></tr>
    </thead>
    <tbody>'''

            if result:
                for record in result:
                    table += '''<tr><td>{0}</td><td>{1}</td><tr>\n'''.format(record[1], record[2])
                table += '''</tbody>\n</table>\n'''

            # Drop table
            sql = '''DROP TABLE People'''
            cur.execute(sql)

            # Close communication with the database
            cur.close()
            conn.close()

            # return table

            self.wfile.write(bytes(table, "utf-8"))

        except Exception as e:
            print(e)


if __name__ == "__main__":        
    webServer = HTTPServer(("localhost", int(os.getenv("PORT"))), MyServer)
    print("Server started http://%s:%s" % ("localhost", os.getenv("PORT")))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")
{{< /codetabs >}}

This new file uses the variables set in `.environment` to

1. Connect to the database.
1. Create a new table and insert some data.
1. Display the table on the deployed site.

Commit and push those changes to the environment:

```bash
$ git add .
$ git commit -m "Use service in app."
$ git push platform add-db
```

When the activity has completed, the deployed environment will now display a table showing data now in the MariaDB service:

| Name           | City        |
|----------------|-------------|
| Neil Armstrong |  Moon       |
| Buzz Aldrin    |  Glen Ridge |
| Sally Ride     |  La Jolla   |

You can also view this data directly using the CLI command `platform sql`:

```bash
$ platform sql 'SELECT * FROM People;' -q
+----+----------------+------------+
| id | name           | city       |
+----+----------------+------------+
|  1 | Neil Armstrong | Moon       |
|  2 | Buzz Aldrin    | Glen Ridge |
|  3 | Sally Ride     | La Jolla   |
+----+----------------+------------+
```

## Branches and merges

Same as before, take a moment to see how this data inherits during branches and merges.

Create a new environment off of the `add-db` environment:

```bash
platform environment:branch add-db-child
```

When the deployment has finished, verify that all of the data from the parent environment `add-db` is now in the `add-db-child` service container.

```bash
platform sql -e add-db-child 'SELECT * FROM People;' -q
```

You will see the same data on the new environment.
That is, the database container on `add-db-child` is an exact copy of the database container on its parent, `add-db`. 
Like before, this will be the case for any parent - most importantly, any child environment branched from production (`main`) will be have access automatically to production data through this inheritance.

Combined with inherited files and application code, every development environment is an exact copy of it parent.

When merged, the production environment will take on our new infrastructure configuration (it will now contain a database), but it will not contain the data from this environment. 

## Clean up project

Merge the changes into production:

```bash
platform environment:merge -y
```

After you verify that the same behavior is now present on the production environment **Main**, cleanup your project by deactivating these development environments:

```bash
$ git checkout main
$ git pull main
$ platform environment:deactivate add-db-child --delete-branch -y
$ platform environment:deactivate add-db --delete-branch -y
```

At this point you have a single active environment, **Main**, your production environment.
That environment is a cluster of containers: one Router container, one Application container, and one Service container.
Every child environment you branch from production from this point forward will be an exact copy of this cluster, including all of its data. 

These are true staging environments.
You can now create new environments to experiment with new features in isolation, test their behavior, and merge into production in the exact same way. 

## Accessing services locally

You're not, however, going to want to wait to see if something you've pushed to Platform.sh succeeds in order to do that. 
The Platform.sh CLI provides one method for connecting to live services quickly, so that you can test a new feature before pushing to the environment.

Create a new environment:

```bash
platform environment:branch new-feature
```

Locally from the newly created `new-feature` branch, run the command

```bash
platform tunnel:open
```

After which you will see the message `SSH tunnel opened to database at: mysql://user:@127.0.0.1:30000/main`. 
An SSH tunnel has been opened locally to the newly created database service container on the **new-feature** environment. 
What's still missing is the credentials used on Platform.sh to connect to this service. 

Run the command:

```bash
export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
```

This command uses the tunnel to mock the `PLATFORM_RELATIONSHIPS` environment variable locally containing the credentials the application will need to connect to the service. 

Then, source your environment variables and run the application locally to view it at `localhost:8000`:

{{< codetabs >}}
---
title=PHP
file=none
highlight=bash
markdownify=false
---
. .environment && php -d variables_order=EGPCS -S localhost:8000 -t web
<--->
---
title=Python
file=none
highlight=bash
markdownify=false
---
. .environment && export PORT=8888 && pipenv run python server.py
{{< /codetabs >}}

## Wrapping up

You now have all of the pieces you need to deploy new features on Platform.sh via iterative development.
Create an environment, make revisions, verify the expected behavior, merge into production. 

The later guides in this Getting Started section will cover more advanced topics using codebases more complex than this simple "Hello world" example, but these principles will never change.

Before you do that, there a few very short caveats worth knowing about around the topic of data. 

{{< guide-buttons next="Caveats with data" >}}
