// Import the necessary modules
import { openSync, readSync, existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import yargs from 'yargs';

// Define the main function
function main() {

    //figure out how to get in bun environment
    //const version = process.env.npm_package_version;

    // Parse the command-line arguments using yargs
    const argv = yargs(process.argv.slice(2))
        .option('db', {
            alias: 'd',
            describe: 'path to the DuckDB file',
            demandOption: true,
            type: 'string',
        })
        .version(false)
        .alias('version', 'v')
        .help()
        .alias('help', 'h').argv;

    const dbfile = argv.db;

    // Check if the specified file exists
    if (!existsSync(dbfile)) {
        console.log(`duckdb file ${dbfile} does not exist.`);
        process.exit(1);
    }

    // Read the storage header from the file
    const pattern = Buffer.alloc(8 + 4 + 8);
    const fd = openSync(dbfile, 'r');
    readSync(fd, pattern, 0, pattern.length, 0);

    // Parse the storage header to determine the DuckDB version
    const result = {
        version: pattern.readUInt32LE(8),
        storageVersion: pattern.readBigInt64LE(12),
    };

    // Map the storage version to the corresponding DuckDB CLI version
    const map: Map<bigint, string> = new Map([
        [39n, 'duckdb-061'],
        [43n, 'duckdb-071'],
        [51n, 'duckdb-081'],
        [64n, 'duckdb-0102'],
    ]);
    const cli = map.get(result.storageVersion);

    // Generate a UUID for the backup file name
    const uuid = uuidv4();

    // Print the DuckDB CLI command to export the database to a backup file
    if (cli == undefined) {
        console.log(`unknown version ${result.storageVersion.toString()}`);
    } else {
        console.log(
            `${cli} ${dbfile} -c "export database 'backup-${uuid}' (format parquet);"`
        );
    }
}

// Call the main function to execute the code
main();