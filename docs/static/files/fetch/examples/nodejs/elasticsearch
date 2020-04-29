const elasticsearch = require('elasticsearch');
const config = require("platformsh-config").config();

exports.usageExample = async function() {

    const credentials = config.credentials('elasticsearch');

    var client = new elasticsearch.Client({
        host: `${credentials.host}:${credentials.port}`,
    });


    let index = 'my_index';
    let type = 'People';

    // Index a few document.
    let names = ['Ada Lovelace', 'Alonzo Church', 'Barbara Liskov'];

    let message = {
        refresh: "wait_for",
        body: []
    };
    names.forEach((name) => {
        message.body.push({index: {_index: index, _type: type}});
        message.body.push({name: name});
    });
    await client.bulk(message);

    // Search for documents.
    const response = await client.search({
        index: index,
        q: 'name:Barbara Liskov'
    });

    let output = '';

    if(response.hits.total.value > 0) {
        output += `<table>
        <thead>
        <tr><th>ID</th><th>Name</th></tr>
        </thead>
        <tbody>`;
        response.hits.hits.forEach((record) => {
            output += `<tr><td>${record._id}</td><td>${record._source.name}</td></tr>\n`;
        });
        output += "</tbody>\n</table>\n";
    }
    else {
        output = "No records found.";
    }

    // Clean up after ourselves.
    response.hits.hits.forEach((record) => {
        client.delete({
            index: index,
            type: type,
            id: record._id,
        });
    });

    return output;
};
