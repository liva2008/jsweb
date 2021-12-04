
/* All your model classes should extend this class
*  It includes the incremental 'id' by default
*/

export class Model {
    // proxy primary code
    id = 0;
    // Database
    static _database = null;

    static link(database){
        Model._database = database;
    }

    columnDefinition(property) {
        const v = Object.getOwnPropertyDescriptor(this, property);
        if (property === "id") {
            return "integer PRIMARY KEY AUTOINCREMENT NOT NULL";
        } else if (typeof v.value === "boolean") {
            return `integer NOT NULL DEFAULT ${v.value?1:0}`;
        } else if (typeof v.value === "string") {
            return `text DEFAULT '${v.value}'`;
        } else if (typeof v.value === "number") {
            return `integer NOT NULL DEFAULT ${v.value}`;
        }
        return undefined;
    }

    async createTable() {
        const names = Object.getOwnPropertyNames(this);
        let statement = 'CREATE TABLE IF NOT EXISTS "' + this.constructor.name.toLowerCase() + '" (';
        for (const p of names) {
            if (!statement.endsWith("(")) statement += ", ";
            let cd = this.columnDefinition(p);
            if(cd !== undefined)
                statement += '"' + p + '" ' + cd;
        }
        statement += ")";
        //console.log(statement);
        //console.log(Model._database);
        await Model._database.execute(statement);
    }

    async insert(){
        const names = Object.getOwnPropertyNames(this);
        console.log(names)
        let property = '(';
        let value = "(";
        for (const p of names) {
            if(p !== 'id' && p !== '_database'){
                const v = Object.getOwnPropertyDescriptor(this, p);
                property += p + ',';
                if(typeof v.value === 'string'){
                    value += `'${v.value}',`;
                }
                else {
                    value += v.value + ',';
                }

            }
        }


        let statement = `INSERT INTO ${this.constructor.name.toLowerCase()}${property.substring(0, property.length -1) + ')'} VALUES${value.substring(0, value.length -1) + ")"}`;
        console.log(statement);
        await Model._database.execute(statement);
    }
    

    /*
    print() {
        const names = Object.getOwnPropertyNames(this);
        console.log(names)
        for (let n of names) {
            const v = Object.getOwnPropertyDescriptor(this, n);
            console.log(v);
            console.log(typeof v.value)
        }
        console.log(this.constructor.name.toLowerCase());
        
    }
    */
}

/*
class User extends Model{

    username = '';
    password = '';
    sex = true;

}

class Stu extends User{
    department = '';

    say(){
        
    }
}
*/

//let m = new Model();
//m.print();

//let n = new Stu();
//n.createTable();

/*
const names = Object.getOwnPropertyNames(m);
console.log(names)
for (let n of names) {
    const v = Object.getOwnPropertyDescriptor(m, n);
    console.log(v);
    console.log(typeof v.value)
}
console.log(m.constructor.name.toLowerCase());

console.log(Object.entries(m));

console.log(Object.keys(m));
console.log(Object.values(m));
*/