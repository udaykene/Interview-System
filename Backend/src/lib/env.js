import dotenv from 'dotenv'
dotenv.config({quiet:true})//Stop the .env warning in the terminal 

export const ENV = {
    PORT:process.env.PORT,
    DB_URL:process.env.DB_URL,
    NODE_ENV:process.env.NODE_ENV
}