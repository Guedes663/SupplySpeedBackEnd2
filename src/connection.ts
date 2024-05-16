import knex from 'knex';

const connection = knex({
    client: "mysql",
    connection: {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "Guedes644",
        database: "supplyspeedbd",
        multipleStatements: true
    }
})

export default connection