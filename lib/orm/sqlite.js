import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function connectSqlite(database){
    // open the database
    const db = await open({
      filename: database,
      driver: sqlite3.Database
    })
    return db;
}
