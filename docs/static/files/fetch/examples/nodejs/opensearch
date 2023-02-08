const { Client } = require("@opensearch-project/opensearch");
const config = require("platformsh-config").config();

exports.usageExample = async function () {
    const credentials = config.credentials("opensearch");

    const client = new Client({
        node: `${credentials.scheme}://${credentials.host}:${credentials.port}`,
    });

    const indexName = "my_index";

    // Index a few document.
    const names = ["Ada Lovelace", "Alonzo Church", "Barbara Liskov"];

    if(!await client.indices.exists({index: indexName})) {
        var response = await client.indices.create({
            index: indexName,
        });
    }

    names.forEach(name => {
        client.index({
            index: indexName,
            body: {
                name: name
            },
            refresh: "wait_for"
        })
    })

    const query = {
        query: {
          match: {
            name: {
              query: "Barbara Liskov",
            },
          },
        },
      };
    

    // Search for documents.
    var response = await client.search({
        index: indexName,
        body: query,
    });

    const outputRows = response.body.hits.hits
        .map(
            ({ _id: id, _source: { name } }) =>
                `<tr><td>${id}</td><td>${name}</td></tr>\n`
        )
        .join("\n");

    // Clean up after ourselves.
    await Promise.allSettled(
        response.body.hits.hits.map(({ _id: id }) =>
            client.delete({
                index: indexName,
                id,
            })
        )
    );

    return `
    <table>
        <thead>
            <tr>
                <th>ID</th><th>Name</th>
            </tr>
        </thhead>
        <tbody>
            ${outputRows}
        </tbody>
    </table>
    `;
};
