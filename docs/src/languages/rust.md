---
title: "Rust"
description:
banner:
  title: Beta
  body: The Rust runtime is currently available in Beta.
        To share your feedback so we can improve it, add a comment to the [Rust feature card](https://next.platform.sh/c/221-rust).
---

Platform.sh supports building and deploying applications written in Rust.

## Supported versions

| Grid and {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|----------------------------------------|------------------------------ |
| {{< image-versions image="rust" status="supported" environment="grid" >}} | {{< image-versions image="rust" status="supported" environment="dedicated-gen-2" >}} |

{{% language-specification type="rust" display_name="Rust" %}}

## Dependencies

The recommended way to handle Rust dependencies on Platform.sh is using Cargo.
Commit a `cargo.toml` and a `cargo.lock` file in your repository
so the system automatically downloads dependencies using Cargo.

## Building and running your app

Assuming your `cargo.toml` and `cargo.lock` files are present in your repository,
you can build your app using the `cargo build` command to produce a working executable.

You can then start it from the `web.commands.start` directive.
Note that the start command _must_ run in the foreground.
If the program terminates for any reason it is automatically restarted.

The following basic [app configuration](../../create-apps/_index.md) is sufficient to run most Rust apps.

```yaml {location=".platform.app.yaml"}

# The app's name, which must be unique within the project.
name: 'app'

# The language and version for your app.
type: 'rust:1.68'

# The size of the app's persistent disk (in MB).
disk: 2048

hooks:
  build:
    cargo build

web:
  commands:
      # Customize the start command with your own target.
      start: './target/debug/hello'
  
  locations:
        /:
            # Route all requests to the Rust app, unconditionally.
            # If you want some files served directly by the web server without hitting Rust, see
            # https://docs.platform.../create-apps/app-reference.html
            allow: false
            passthru: true
```

Note that there is still an Nginx proxy server sitting in front of your application. If desired, certain paths may be served directly by Nginx without hitting your application (for static files, primarily) or you may route all requests to the Rust app unconditionally, as in the example above.

## Platform.sh variables

Platform.sh exposes relationships and other configuration as environment variables.
To get the `PORT` environment variable (the port on which your app is supposed to listen):

```bash
COMMAND TO BE DOCUMENTED
```

## Complete example

To serve a static `index.html` file, you could follow these steps:

1. Use the following [app configuration](../../create-apps/_index.md):

```yaml {location=".platform.app.yaml"}

# The app's name, which must be unique within the project.
name: 'app'

# The language and version for your app.
type: 'rust:1'

# The size of the app's persistent disk (in MB).
disk: 2048

hooks:
  build:
    cargo build

web:
  commands:
      start: './target/debug/hello'
```

2. Use the following `hello.rs` file:

```rust
/* Simple HTTP Server */
/* Author : Ramesh Vyas */
use std::io::prelude::*;
use std::net::TcpListener;
use std::net::TcpStream;
use std::fs;

fn main() {
    
    /* Creating a Local TcpListener at Port 8477 */
    const HOST : &str ="127.0.0.1";
    const PORT : &str ="8888";

    /* Concating Host address and Port to Create Final Endpoint */
    let end_point : String = HOST.to_owned() + ":" +  PORT;

    /*Creating TCP Listener at our end point */
    let listener = TcpListener::bind(end_point).unwrap();

    println!("Web server is listening at port {}",PORT);

    /* Conneting to any incoming connections */
    for stream in listener.incoming() {
        let _stream = stream.unwrap();
        // Call Function to process any incomming connections
        handle_connection(_stream);
    }
    
}

fn handle_connection(mut stream: TcpStream) {
    let mut buffer = [0; 1024];
    stream.read(&mut buffer).unwrap();

    let get = b"GET / HTTP/1.1\r\n";

    if buffer.starts_with(get) {
        let contents = fs::read_to_string("index.html").unwrap();

        let response = format!(
            "HTTP/1.1 200 OK\r\nContent-Length: {}\r\n\r\n{}",
            contents.len(),
            contents
        );

        stream.write(response.as_bytes()).unwrap();
        stream.flush().unwrap();
    } else {
        // some other request
    }
}
```