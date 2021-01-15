const fs = require('fs');
const yaml = require('js-yaml');
const request = require("request");

// Example file data.
const dataDirectories = {
    "templates": {
        dir: 'data/remote-examples/templates/',
        fetchFunc: fetchFilesTemplates,
    },
    "language-examples": {
        dir: 'data/remote-examples/language-examples/',
        fetchFunc: fetchFilesExamples
    }
}

// Ensure subdirectory we're saving to exists.
function ensureSubdir(savePath) {
    var destinationDir = process.cwd() + savePath
    if (!fs.existsSync(destinationDir)){
        // Create subdirectory if doesn't exist.
        fs.mkdirSync(destinationDir);
    }
}

// Function to place the request and write to the file.
// function writeFileFromTarget(target, destination) {
//     // Get the file.
//     request.get(target, (error, response, body) => {
//         fs.writeFileSync(destination, body);
//     })
// }

function writeFileFromTarget(target, destination) {
    request.get(target, (error, response, body) => {
        try {
            fs.writeFile(destination, body, (err) => {
                if (err) {
                    console.log(`   ✖ ${destination.split(process.cwd())[1]}: Something went wrong with this one.`); 
                    console.log(err);
                } else {
                    console.log(`   ✔ ${destination.split(process.cwd())[1]}`);     
                }
            })
            // console.log(`   ✔ ${destination.split(process.cwd())[1]}`); 
        } catch {
            console.log(`   ✖ ${destination.split(process.cwd())[1]}: Something went wrong with this one.`); 
            console.log(err)
        }
    })
}

// function writeFileFromTarget(target, destination) {
//     // Make the request.
//     request.get(target, (error, response, body) => {
//         fs.writeFile(destination, body (err) => {
//             if (err) {
//                 // console.log(err)
//                 console.log(`   ✖ ${destination.split(process.cwd())[1]}: Something went wrong with this one.
// ${err}
//                 `); 
//             } else {
//                 console.log(`   ✔ ${destination}`); 
//             }
//         })
//     }
//         // Asynchronously write the file.
//         fs.writeFile(destination, body, (err) => { 
//             if (err) {
//                 // console.log(err)
//                 console.log(`   ✖ ${destination.split(process.cwd())[1]}: Something went wrong with this one.
// ${err}
//                 `); 
//             }
//             else { 
//                 console.log(`   ✔ ${destination}`); 
//             } 
        // }
//         try {
//             // Asynchronously write the file.
//             fs.writeFile(destination, body, (err) => { 
//                 if (err) {
//                     // console.log(err)
//                     console.log(`   ✖ ${destination.split(process.cwd())[1]}: Something went wrong with this one.
// $
//                     `); 
//                 }
//                 else { 
//                     console.log(`   ✔ ${destination}`); 
//                 } 
//             }); 
//         } catch {
//             console.log(`   ✖ ${destination.split(process.cwd())[1]}: Something went wrong with this one.`); 
//         }
    // })
// }

function writeFileFromTargetExamplesNew(target, destination) {

    request.get(target).then((response) => {
        fs.writeFileSync(destination, response.body);
        if (err) throw err;
    })
    // cy.request({
    //     method: 'GET',
    //     url: downloadUrl 
    // }).then((response) => {
    //     const fs = require('fs');
    //      fs.writeFile("out.xlsx",response.body,(err) => {
    //        if (err) throw err;
    //        console.log('The file has been saved!');
    //       })
    // })
}

function writeFileFromTargetExamples(target, destination){

    // Make the request.
    request.get(target, (error, response, body) => {
        try {
            // Asynchronously write the file.
            fs.writeFile(destination, body, (err) => { 
                if (err) {
                    console.log(err)
                }
                else { 
                    console.log(`   ✔ ${destination.split(process.cwd())[1]}`); 
                } 
            }); 
        } catch {
            console.log(`   ✖ ${destination.split(process.cwd())[1]}: Something went wrong with this one.`); 
        }
    })
//     console.log(`
// * ${target}
//                 `)
//     request.get(target, (error, response, body) => {
//         try {
//             fs.writeFileSync(destination, body)
//             console.log(`
// * ${target}
//     - OK
//             `)
//         } catch (err) {
//             console.log(`
// * ${target}
//     - ${target}
//     - ${destination}
//     - ${response}
//     - ${err}
//                     `)
//             // console.log(err);
//             // console.log(target);
//             // console.log(destination);
//             // console.log(response);
//             fs.writeFileSync(destination, new String(body))
//         }
//     })
}

// Function to parse out an example file's target and destination before request is made.
function fetchFilesTemplates(data) {
    for ( repo in data["repos"] ) {
        // Format target and destination.
        var target = `${data["root"]}/${data["repos"][repo]}/${data["branch"]}/${data["file"]}`;
        var destination = process.cwd() + `${data["savePath"]}/${data["repos"][repo]}`
        // Ensure subdirectory exists.
        ensureSubdir(data["savePath"]);
        writeFileFromTarget(target, destination);

    }
}

// Function to parse out an example file's target and destination before request is made.
function fetchFilesExamples(data) {
    // Ensure that the examples subdirectory exists.
    ensureSubdir(data["savePath"]);
    for ( language in data["paths"] ) {
        // Format target and destination for each language.
        var languageTargetDir = `${data["root"]}/${language}`;
        var languageDestDir = `${data["savePath"]}/${language}`;
        // Ensure the language subdirectory exists.
        ensureSubdir(languageDestDir)
        for ( service in data["paths"][language] ) {
            // Format target and destination for each service.
            var target = `${languageTargetDir}/${data["paths"][language][service]}`;
            var destination = process.cwd() + `${languageDestDir}/${data["paths"][language][service]}`;
            // Place the request and write the file.
            writeFileFromTarget(target, destination);
        }
    }
}

// Main fetch function.
function fetch(exampleGroup) {
    // Get data for the current group of examples.
    var dir = dataDirectories[exampleGroup]["dir"];
    var fetchFunc = dataDirectories[exampleGroup]["fetchFunc"];
    // list all files in the directory
    fs.readdir(dir, (err, files) => {
        if (err) {
            throw err;
        }
        files.forEach(file => {
            try {
                // Load the data.
                const data = yaml.safeLoad(fs.readFileSync(dir + file, 'utf8'));
                // Get the files.
                fetchFunc(data)
            } catch (e) {
                console.log(e);
            }
        });
    });
}

// Main run function.
function run(){
    console.log("\n\033[1mRetrieving example files from their sources:\033[0m\n");
    for ( exampleGroup in dataDirectories ){
        fetch(exampleGroup)
    }
}

// Run it.
run()

// function run2(target, id) {
//     var options = {
//         url: target,
//         // headers: headers,
//         method: 'GET',
//         // json: true
//     };

//     request.get(options, (error, response, body) => {
//         // console.log(body)
//         console.log(error)
//         fs.writeFileSync(`test${id}`, new String(body));
//     })
//     // console.log(`test${id}`)
//     // request.get(target, (error, response, body) => {
//     //     fs.writeFileSync(`test${id}`, body);
//     // })

// }

// var locations = [
//     "https://examples.docs.platform.sh/relationships/elasticsearch",
//     "https://examples.docs.platform.sh/golang/solr",
//     "https://examples.docs.platform.sh/java/elasticsearch"
// ]

// for (location in locations){
//     run2(locations[location], location)
// }

// run2("https://examples.docs.platform.sh/relationships/elasticsearch")