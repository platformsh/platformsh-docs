<?php

declare(strict_types=1);

use Platformsh\ConfigReader\Config;
use InfluxDB\Client;
use InfluxDB\Database;
use InfluxDB\Point;
use InfluxDB\Database\RetentionPolicy;

// Create a new config object to ease reading the Platform.sh environment variables.
// You can alternatively use getenv() yourself.
$config = new Config();

// Get the credentials to connect to the InfluxDB service.
$credentials = $config->credentials('influxdb');

try {
    // Connecting to the InfluxDB server. By default it has no user defined, so you will need to create it.
    $client = new Client($credentials['host'], $credentials['port']);

    $password = base64_encode(random_bytes(12));
    $client->admin->createUser('deploy_user', $password, Client\Admin::PRIVILEGE_ALL);

    // Now reconnect with an authenticated connection so that we can access a database.
    $client = new Client($credentials['host'], $credentials['port'], 'deploy_user', $password);
    $database = $client->selectDB('deploys');

    // No database is created by default, so it needs to be created by the user.
    if (!$database->exists()) {
        $database->create(new RetentionPolicy('test', '1d', 2, true));
    }

    // Write some data.
    $points = [
        new Point(
            'deploy_time', // name of the measurement
            0.64, // the measurement value
            ['host' => 'server01', 'region' => 'us-west'], // optional tags
            ['cpucount' => 10], // optional additional fields
            1546556400 // Time precision has to be set to seconds!
        ),
        new Point(
            'deploy_time', // name of the measurement
            0.84, // the measurement value
            ['host' => 'server01', 'region' => 'us-west'], // optional tags
            ['cpucount' => 10], // optional additional fields
            1547161200 // Time precision has to be set to seconds!
        ),
    ];
    $result = $database->writePoints($points, Database::PRECISION_SECONDS);

    // Read the data back.
    $result = $database->query('select * from deploy_time LIMIT 5');
    $points = $result->getPoints();

    if ($points) {
        print <<<TABLE
<table>
<thead>
<tr><th>Timestamp</th><th>Value</th></tr>
</thead>
<tbody>
TABLE;
        foreach ($points as $point) {
            printf("<tr><td>%s</td><td>%s</td></tr>\n", $point['time'], $point['value']);
        }
        print "</tbody>\n</table>\n";
    }


    // Drop the database.
    $database->drop();

    // And remove the user.
    $client->admin->dropUser('deploy_user');

} catch (Exception $e) {
    print $e->getMessage();
}
