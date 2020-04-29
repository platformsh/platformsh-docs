---
title: "Tabs"
description: |
  Create tabs within a single row, supporting different types of content.
---

## Handling tabs with different types of content

Mauris orci nisl, finibus quis libero in, aliquam iaculis lacus. Vestibulum sit amet mi fermentum, posuere mauris sit amet, blandit leo. In ante urna, congue eu justo vel, egestas luctus ante. Fusce luctus massa varius ligula varius, sed rutrum nisi interdum. Vestibulum vehicula nisi consequat nulla molestie, in rutrum orci ornare. Sed commodo erat ac dignissim pretium. Fusce sagittis efficitur arcu, ac elementum metus varius eu. Vestibulum id mattis nunc.

Donec at lacus venenatis, fringilla libero in, venenatis enim. Donec lacus elit, posuere id libero in, semper dictum libero. Proin in felis at nunc cursus luctus. Duis eu vestibulum odio. Pellentesque malesuada ultricies dui et fringilla.

Vivamus lobortis vitae ligula nec condimentum. Aliquam vitae nibh orci. Etiam quis pellentesque lorem. Vestibulum suscipit lorem in leo rutrum hendrerit.

{{< newtabs >}}

Markdown
<->

You can use *plain markdown* just **fine**.

# Headers work fine

## And anchors are generated too

### However, clicking an anchor link in a non-first tab

#### will not automatically open that tab for you

##### unfortunately

You can use [links](https://community.platform.sh/).

Code:

```python
import platformshconfig
config = platformsconfig.Config()
config.credentials('database')
```

and notes, even those that include code

> **note**
>
> Mauris orci nisl, finibus quis libero in, aliquam iaculis lacus. Vestibulum sit amet mi fermentum, posuere mauris sit amet, blandit leo. In ante urna, congue eu justo vel, egestas luctus ante. Fusce luctus massa varius ligula varius, sed rutrum nisi interdum.
>
> ```python
> import platformshconfig
> config = platformsconfig.Config()
> config.credentials('database')
> ```
>
> Vestibulum vehicula nisi consequat nulla molestie, in rutrum orci ornare. Sed commodo erat ac dignissim pretium. Fusce sagittis efficitur arcu, ac elementum metus varius eu. Vestibulum id mattis nunc.

RawHTML and shortcodes placed in body content will not work however.

<--->

HTML
<->

```html
<section id="main">
  <div>
   <h1 id="title">{{ .Title }}</h1>
    {{ range .Pages }}
        {{ .Render "summary"}}
    {{ end }}
  </div>
</section>
```

<--->

Go
<->

```go
package examples

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	psh "github.com/platformsh/config-reader-go/v2"
	sqldsn "github.com/platformsh/config-reader-go/v2/sqldsn"
)

func UsageExampleMySQL() string {

	// Create a NewRuntimeConfig object to ease reading the Platform.sh environment variables.
	// You can alternatively use os.Getenv() yourself.
	config, err := psh.NewRuntimeConfig()
	checkErr(err)

	// The 'database' relationship is generally the name of the primary SQL database of an application.
	// That's not required, but much of our default automation code assumes it.
	credentials, err := config.Credentials("database")
	checkErr(err)

	// Using the sqldsn formatted credentials package.
	formatted, err := sqldsn.FormattedCredentials(credentials)
	checkErr(err)

	db, err := sql.Open("mysql", formatted)
	checkErr(err)

	defer db.Close()

	// Force MySQL into modern mode.
	db.Exec("SET NAMES=utf8")
	db.Exec(\x60SET sql_mode = 'ANSI,STRICT_TRANS_TABLES,STRICT_ALL_TABLES,
    NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,
    NO_AUTO_CREATE_USER,ONLY_FULL_GROUP_BY'\x60)

	// Creating a table.
	sqlCreate := \x60
CREATE TABLE IF NOT EXISTS PeopleGo (
id SERIAL PRIMARY KEY,
name VARCHAR(30) NOT NULL,
city VARCHAR(30) NOT NULL)\x60

	_, err = db.Exec(sqlCreate)
	checkErr(err)

	// Insert data.
	sqlInsert := \x60
INSERT INTO PeopleGo (name, city) VALUES
('Neil Armstrong', 'Moon'),
('Buzz Aldrin', 'Glen Ridge'),
('Sally Ride', 'La Jolla');\x60

	_, err = db.Exec(sqlInsert)
	checkErr(err)

	table := \x60<table>
<thead>
<tr><th>Name</th><th>City</th></tr>
</thead>
<tbody>\x60

	var id int
	var name string
	var city string

	rows, err := db.Query("SELECT * FROM PeopleGo")
	if err != nil {
		panic(err)
	} else {
		for rows.Next() {
			err = rows.Scan(&id, &name, &city)
			checkErr(err)
			table += fmt.Sprintf("<tr><td>%s</td><td>%s</td><tr>\n", name, city)
		}
		table += "</tbody>\n</table>\n"
	}

	_, err = db.Exec("DROP TABLE PeopleGo;")
	checkErr(err)

	return table
}
```

<--->

Java
<->

```java
package sh.platform.languages.sample;

import sh.platform.config.Config;
import sh.platform.config.MySQL;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.function.Supplier;

public class MySQLSample implements Supplier<String> {

    @Override
    public String get() {
        StringBuilder logger = new StringBuilder();

        // Create a new config object to ease reading the Platform.sh environment variables.
        // You can alternatively use getenv() yourself.
        Config config = new Config();

        // The 'database' relationship is generally the name of primary SQL database of an application.
        // That's not required, but much of our default automation code assumes it.
        MySQL database = config.getCredential("database", MySQL::new);
        DataSource dataSource = database.get();

        // Connect to the database
        try (Connection connection = dataSource.getConnection()) {

            // Creating a table.
            String sql = "CREATE TABLE JAVA_PEOPLE (" +
                    " id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                    "name VARCHAR(30) NOT NULL," +
                    "city VARCHAR(30) NOT NULL)";

            final Statement statement = connection.createStatement();
            statement.execute(sql);

            // Insert data.
            sql = "INSERT INTO JAVA_PEOPLE (name, city) VALUES" +
                    "('Neil Armstrong', 'Moon')," +
                    "('Buzz Aldrin', 'Glen Ridge')," +
                    "('Sally Ride', 'La Jolla')";

            statement.execute(sql);

            // Show table.
            sql = "SELECT * FROM JAVA_PEOPLE";
            final ResultSet resultSet = statement.executeQuery(sql);
            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String name = resultSet.getString("name");
                String city = resultSet.getString("city");
                logger.append(String.format("the JAVA_PEOPLE id %d the name %s and city %s", id, name, city));
                logger.append('\n');
            }
            statement.execute("DROP TABLE JAVA_PEOPLE");
            return logger.toString();
        } catch (SQLException exp) {
            throw new RuntimeException("An error when execute MySQL", exp);
        }
    }
}
```

<--->

Node.js
<->
```js
const mysql = require('mysql2/promise');
const config = require("platformsh-config").config();

exports.usageExample = async function() {

    const credentials = config.credentials('database');

    const connection = await mysql.createConnection({
        host: credentials.host,
        port: credentials.port,
        user: credentials.username,
        password: credentials.password,
        database: credentials.path,
    });

    let sql = '';

    // Creating a table.
    sql = `CREATE TABLE IF NOT EXISTS People (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(30) NOT NULL,
            city VARCHAR(30) NOT NULL
        )`;
    await connection.query(sql);

    // Insert data.
    sql = `INSERT INTO People (name, city) VALUES
    ('Neil Armstrong', 'Moon'),
        ('Buzz Aldrin', 'Glen Ridge'),
        ('Sally Ride', 'La Jolla');`;
    await connection.query(sql);

    // Show table.
    sql = `SELECT * FROM People`;
    let [rows] = await connection.query(sql);

    let output = '';

    if (rows.length > 0) {
        output +=`<table>
            <thead>
            <tr><th>Name</th><th>City</th></tr>
            </thead>
            <tbody>`;

        rows.forEach((row) => {
            output += `<tr><td>${row.name}</td><td>${row.city}</td></tr>\n`;
        });

        output += `</tbody>\n</table>\n`;
    }

    // Drop table.
    sql = `DROP TABLE People`;
    await connection.query(sql);

    return output;
};
```

<--->

PHP
<->
```php
<?php

declare(strict_types=1);

use Platformsh\ConfigReader\Config;

// Create a new config object to ease reading the Platform.sh environment variables.
// You can alternatively use getenv() yourself.
$config = new Config();

// The 'database' relationship is generally the name of primary SQL database of an application.
// That's not required, but much of our default automation code assumes it.
$credentials = $config->credentials('database');

try {
    // Connect to the database using PDO.  If using some other abstraction layer you would
    // inject the values from $database into whatever your abstraction layer asks for.
    $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s', $credentials['host'], $credentials['port'], $credentials['path']);
    $conn = new \PDO($dsn, $credentials['username'], $credentials['password'], [
        // Always use Exception error mode with PDO, as it's more reliable.
        \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
        // So we don't have to mess around with cursors and unbuffered queries by default.
        \PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => TRUE,
        // Make sure MySQL returns all matched rows on update queries including
        // rows that actually didn't have to be updated because the values didn't
        // change. This matches common behavior among other database systems.
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
```

<--->

Python
<->
```python
import pymysql
from platformshconfig import Config


def usage_example():

    # Create a new Config object to ease reading the Platform.sh environment variables.
    # You can alternatively use os.environ yourself.
    config = Config()

    # The 'database' relationship is generally the name of primary SQL database of an application.
    # That's not required, but much of our default automation code assumes it.'
    credentials = config.credentials('database')

    try:
        # Connect to the database using PDO. If using some other abstraction layer you would inject the values
        # from `database` into whatever your abstraction layer asks for.

        conn = pymysql.connect(host=credentials['host'],
                               port=credentials['port'],
                               database=credentials['path'],
                               user=credentials['username'],
                               password=credentials['password'])

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

        return table

    except Exception as e:
        return e
```

{{< /newtabs >}}

> **note**
>
> Lorem ipsum

## Reading files

Mauris orci nisl, finibus quis libero in, aliquam iaculis lacus. Vestibulum sit amet mi fermentum, posuere mauris sit amet, blandit leo. In ante urna, congue eu justo vel, egestas luctus ante. Fusce luctus massa varius ligula varius, sed rutrum nisi interdum. Vestibulum vehicula nisi consequat nulla molestie, in rutrum orci ornare. Sed commodo erat ac dignissim pretium. Fusce sagittis efficitur arcu, ac elementum metus varius eu. Vestibulum id mattis nunc.

Donec at lacus venenatis, fringilla libero in, venenatis enim. Donec lacus elit, posuere id libero in, semper dictum libero. Proin in felis at nunc cursus luctus. Duis eu vestibulum odio. Pellentesque malesuada ultricies dui et fringilla.

Vivamus lobortis vitae ligula nec condimentum. Aliquam vitae nibh orci. Etiam quis pellentesque lorem. Vestibulum suscipit lorem in leo rutrum hendrerit.



{{< newtabs2 >}}

File MD
<->

@file=static/files/misc/lorem.md
@markdownify=true

<--->

MD
<->

Mauris orci nisl, finibus quis libero in, aliquam iaculis lacus. Vestibulum sit amet mi fermentum, posuere mauris sit amet, blandit leo. In ante urna, congue eu justo vel, egestas luctus ante. Fusce luctus massa varius ligula varius, sed rutrum nisi interdum.

> **note**
>
> Mauris orci nisl, finibus quis libero in, aliquam iaculis lacus. Vestibulum sit amet mi fermentum, posuere mauris sit amet, blandit leo. In ante urna, congue eu justo vel, egestas luctus ante. Fusce luctus massa varius ligula varius, sed rutrum nisi interdum.
>
> ```python
> import platformshconfig
> config = platformsconfig.Config()
> config.credentials('database')
> ```
>
> Vestibulum vehicula nisi consequat nulla molestie, in rutrum orci ornare. Sed commodo erat ac dignissim pretium. Fusce sagittis efficitur arcu, ac elementum metus varius eu. Vestibulum id mattis nunc.

Mauris orci nisl, finibus quis libero in, aliquam iaculis lacus. Vestibulum sit amet mi fermentum, posuere mauris sit amet, blandit leo. In ante urna, congue eu justo vel, egestas luctus ante. Fusce luctus massa varius ligula varius, sed rutrum nisi interdum.

<--->

File JS
<->

@file=static/files/misc/basic.js
@highlight=js

<--->

JS
<->

@highlight=js

const config = require("platformsh-config").config();

const credentials = config.credentials('postgresdatabase');

let settings = {
client: "postgres",
host: credentials.ip,
port: credentials.port,
database: credentials.path,
username: credentials.username,
password: credentials.password
};

module.exports = {
defaultConnection: 'default',
connections: {
  default: {
    connector: 'bookshelf',
    settings,
    options: {
      ssl: false,
      debug: false,
      acquireConnectionTimeout: 100000,
      pool: {
        min: 0,
        max: 10,
        createTimeoutMillis: 30000,
        acquireTimeoutMillis: 600000,
        idleTimeoutMillis: 20000,
        reapIntervalMillis: 20000,
        createRetryIntervalMillis: 200
      }
    }
  }
}
};

<--->

File JSON
<->

@file=static/files/misc/basic.json
@highlight=json

<--->

JSON
<->

```json
{
   "database" : [
      {
         "path" : "main",
         "query" : {
            "is_master" : true
         },
         "port" : 3306,
         "username" : "user",
         "password" : "",
         "host" : "database.internal",
         "ip" : "246.0.241.50",
         "scheme" : "mysql"
      }
   ]
}
```

<--->

File YAML
<->

@file=static/files/misc/mysql.yaml
@highlight=yaml

<--->

YAML
<->

```yaml
database:
  type: mysql:10.2
  disk: 2048
```

{{< /newtabs2 >}}

### Reading local files that need formatting once rendered

#### Markdown

{{< readFile file="static/files/misc/lorem.md" markdownify="true" >}}

#### Syntax highlighting

##### YAML

{{< readFile file="static/files/misc/mysql.yaml" highlight="yaml" >}}

##### HTML

{{< readFile file="static/files/misc/basic.html" highlight="html" >}}

##### JSON

{{< readFile file="static/files/misc/basic.json" highlight="json" >}}

## Tabs checking

### Raw text

{{< tabtest >}}

---
title=MD
file=none
highlight=false
markdownify=true
---
Mauris orci nisl, finibus quis libero in, aliquam iaculis lacus. Vestibulum sit amet mi fermentum, posuere mauris sit amet, blandit leo. In ante urna, congue eu justo vel, egestas luctus ante. Fusce luctus massa varius ligula varius, sed rutrum nisi interdum.

> **note**
>
> Mauris orci nisl, finibus quis libero in, aliquam iaculis lacus. Vestibulum sit amet mi fermentum, posuere mauris sit amet, blandit leo. In ante urna, congue eu justo vel, egestas luctus ante. Fusce luctus massa varius ligula varius, sed rutrum nisi interdum.
>
> ```python
> import platformshconfig
> config = platformsconfig.Config()
> config.credentials('database')
> ```
>
> Vestibulum vehicula nisi consequat nulla molestie, in rutrum orci ornare. Sed commodo erat ac dignissim pretium. Fusce sagittis efficitur arcu, ac elementum metus varius eu. Vestibulum id mattis nunc.

Mauris orci nisl, finibus quis libero in, aliquam iaculis lacus. Vestibulum sit amet mi fermentum, posuere mauris sit amet, blandit leo. In ante urna, congue eu justo vel, egestas luctus ante. Fusce luctus massa varius ligula varius, sed rutrum nisi interdum.

<--->

---
title=YAML
file=none
highlight=yaml
markdownify=false
---
database:
  type: mysql:10.2
  disk: 2048
<--->

---
title=JS
file=none
highlight=js
markdownify=false
---
const config = require("platformsh-config").config();

const credentials = config.credentials('postgresdatabase');

let settings = {
  client: "postgres",
  host: credentials.ip,
  port: credentials.port,
  database: credentials.path,
  username: credentials.username,
  password: credentials.password
};

<--->

---
title=JSON
file=none
highlight=json
markdownify=false
---
{
   "database" : [
      {
         "path" : "main",
         "query" : {
            "is_master" : true
         },
         "port" : 3306,
         "username" : "user",
         "password" : "",
         "host" : "database.internal",
         "ip" : "246.0.241.50",
         "scheme" : "mysql"
      }
   ]
}

{{< /tabtest >}}

### Pulled in local files

{{< tabtest >}}

---
title=MD
file=static/files/misc/lorem.md
highlight=false
markdownify=true
---

<--->

---
title=YAML
file=static/files/misc/mysql.yaml
highlight=yaml
markdownify=false
---

<--->

---
title=JS
file=static/files/misc/basic.js
highlight=js
markdownify=false
---

<--->

---
title=JSON
file=static/files/misc/basic.json
highlight=json
markdownify=false
---

{{< /tabtest >}}
