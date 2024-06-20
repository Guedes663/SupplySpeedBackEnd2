import knex from "knex";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const connection = knex({
    client: "mysql2",
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || "3306"),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
         ssl: {
             ca: fs.readFileSync(path.resolve(__dirname, "../../", process.env.DB_CA_PATH)),
        },
    },
    pool: { 
        min: 0,   
        max: 10, 
    }     
});

export default connection;