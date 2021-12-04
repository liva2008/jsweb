//import { Database } from "https://deno.land/x/jsweb@v0.1.4/mod.js"; //remote
import { Database } from './mod.js';

// deno run --allow-net --allow-read --allow-write db.js
/* 
* 1st: platform deno or node
* 2nd: database type mysql or mongodb
*/
//let db = new Database('deno', "mysql");
let db = new Database('deno', "sqlite");

// node db.js
// npm install --save mysql2
// npm install sqlite3 --save
// npm install sqlite --save
//let db = new Database('node', "mysql");

/* connect database
*  1st parameter: database name
*  2nd parameter: database address
*  3rd parameter: database username
*  4th parameter: database password
*/
//await db.connect('hello', 'localhost', 'root', '123456')
await db.connect('hello.db');


let r0 = await db.execute(`
CREATE TABLE IF NOT EXISTS Student          
      (Sno   CHAR(9) PRIMARY KEY,                   
       Sname CHAR(20),
       Ssex  CHAR(2),
       Sage  SMALLINT,
       Sdept CHAR(20)
      ); 
`)
console.log(r0);

// executing sql by db.exectue method
let r1 = await db.execute(`update student set sname='test1' where sno='10001'`);

//if update, delete, insert return affected rows. 
console.log(r1);

//if select return array
let r2 = await db.execute(`select * from student`);
console.log(r2);

//if update, delete, insert return affected rows. 
let r3 = await db.execute(`insert into student values('10015', 'liva', '男', 25, 'cs')`);
console.log(r3);

// close database
await db.close();

