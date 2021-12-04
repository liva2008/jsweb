import { Database, Model } from './mod.js';

class User extends Model{

    username = '';
    password = '';
    sex = 0;

}

// deno run --allow-net --allow-read --allow-write db.js
let db = new Database('deno', "sqlite");
await db.connect('test.db');

await db.link([User]);

let u = new User();

u.username = 'liva';
u.password = '1234';
u.sex = 1;

await u.insert();

await db.close();

