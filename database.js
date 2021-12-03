
export class Database{
    constructor(platform = "deno") {
        this.platform = platform;
        this.connection = null;
    }

    async connect(host = "127.0.0.1", username = 'root', password='123456', database='test'){
        if(this.platform == 'deno'){
            let {Client} = await import('./lib/mysql/mod.ts');
            this.connection = await new Client().connect({
                hostname: host,
                username: username,
                db: database,
                password: password,
              });
        }
        else{
            let mysql = await import('./lib/node_modules/mysql2/promise.js')
            this.connection = await mysql.createConnection({host:host, user: username, password:password,database: database});
        }
    }

    async execute(sql){
        if(this.platform == 'deno'){
            const result = await this.connection.execute(sql);
            //console.log(result.rows || result.affectedRows);

            //if select return array
            //if update, delete, insert return affected rows.  
            return result.rows || result.affectedRows;
        }
        else{
            const [rows, fields] = await this.connection.execute(sql);
            //console.log(rows.affectedRows || rows);

            //if select return array
            //if update, delete, insert return affected rows. 
            return rows.affectedRows?rows.affectedRows:(rows.affectedRows ==0?0:rows);
        }
    }

    async close(){
        await this.connection.close();
    }
}