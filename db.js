import { Database } from './mod.js';

// deno run --allow-net --allow-read db.js
let db = new Database('deno');

// node db.js
//let db = new Database('node');

/* connect database
*  1st parameter: database address
*  2nd parameter: database username
*  3rd parameter: database password
*  4th parameter: database
*/
await db.connect('localhost', 'root', '123456', 'hello')

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
let r1 = await db.execute(`update student set sname='test' where sno='10001'`);

//if update, delete, insert return affected rows. 
console.log(r1);

//if select return array
let r2 = await db.execute(`select * from student`);
console.log(r2);

//if update, delete, insert return affected rows. 
let r3 = await db.execute(`insert into student values('10011', 'liva', '男', 25, 'cs')`);
console.log(r3);

// close database
await db.close();

