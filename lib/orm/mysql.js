import mysql from 'mysql2/promise';

export async function connectMysql(host, username, password, database){
    let db = await mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database
    });
    return db;
}