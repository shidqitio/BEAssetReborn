import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config()

const db:Sequelize = new Sequelize(
    process.env.DB_DATABASE as string,
    process.env.DB_USERNAME as string,
    process.env.DB_PASSWORD as string,
    {
        host : process.env.DB_HOST as string,
        port : parseInt(process.env.DB_PORT as string, 10),
        dialect : 'mysql',
        logging : false,
        pool : {
            max : 100,
            min : 10,
            acquire : 5000,
            idle : 60000
        }
    }
)


export default db