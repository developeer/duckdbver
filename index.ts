import { openSync, readSync, existsSync } from 'fs';


const dbfile = process.argv[2];

if (!existsSync(dbfile))
{
    console.log(`db file does not exist. ${dbfile}`);
    process.exit(1);
};

const pattern = Buffer.alloc(8 + 4 + 8);
const fd = openSync(dbfile, 'r');

//https://duckdb.org/internals/storage.html

readSync(fd, pattern, 0, pattern.length, 0);

const result = {
    version: pattern.readUInt32LE(8),
    storageVersion: pattern.readBigInt64LE(12)
};

const map: Map<bigint, string> = new Map();

map.set(39n, 'duckdb-061');
map.set(43n, 'duckdb-071');
map.set(51n, 'duckdb-081');
map.set(64n, 'duckdb-090');

const cli = map.get(result.storageVersion);

if (cli == undefined)
    console.log(`Unknown version ${result.storageVersion.toString()}`);
else
    console.log(`${cli} ${dbfile}`);




