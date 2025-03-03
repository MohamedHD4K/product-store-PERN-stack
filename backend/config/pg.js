import pg from 'pg'

const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE, } = process.env

const pool = new pg.Pool({
    user: PGUSER,
    password: PGPASSWORD,
    host: PGHOST,
    port: PGPORT,
    database: PGDATABASE,
})

export default pool;