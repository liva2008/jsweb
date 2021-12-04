export class Database {
    constructor(platform = "deno", databaseType = "mysql") {
        this.platform = platform;
        this.databaseType = databaseType;
        this.connection = null;
    }

    async connect(database = 'test', host = "127.0.0.1", username = 'root', password = '123456') {
        if (this.platform == 'deno') {
            if (this.databaseType == 'mysql') {
                let {
                    Client
                } = await import('https://deno.land/x/mysql/mod.ts');
                this.connection = await new Client().connect({
                    hostname: host,
                    username: username,
                    db: database,
                    password: password,
                });
            } else if (this.databaseType == 'sqlite') {
                let {
                    DB
                } = await import('https://deno.land/x/sqlite/mod.ts');
                this.connection = await new DB(database);
            }
        } else {
            if (this.databaseType == 'mysql') {
                let {
                    connectMysql
                } = await import('./mysql.js')
                this.connection = await connectMysql(
                    host,
                    username,
                    password,
                    database
                );
            } else if (this.databaseType == 'sqlite') {
                let {
                    connectSqlite
                } = await import('./sqlite.js');
                this.connection = await connectSqlite(database);
            }
        }
    }

    async execute(sql) {
        if (this.platform == 'deno') {
            if (this.databaseType == 'mysql') {
                const result = await this.connection.execute(sql);
                //console.log(result.rows || result.affectedRows);

                //if select return array
                //if update, delete, insert return affected rows.  
                return result.rows || result.affectedRows;
            } else if (this.databaseType == 'sqlite') {
                const result = await this.connection.query(sql);
                //console.log(result);
                return result;
            }
        } else {
            if (this.databaseType == 'mysql') {
                const [rows, fields] = await this.connection.execute(sql);
                //console.log(rows.affectedRows || rows);

                //if select return array
                //if update, delete, insert return affected rows. 
                return rows.affectedRows ? rows.affectedRows : (rows.affectedRows == 0 ? 0 : rows);
            } else if (this.databaseType == 'sqlite') {
                const result = await this.connection.all(sql);
                return result;
            }
        }
    }

    async link(models){
        models.forEach(async (model) =>{
            let m = new model();
            model.link(this);
            //console.log(model._database);
            await m.createTable();
        })
    }

    async close() {
        await this.connection.close();
    }
}