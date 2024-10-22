
import { Pool, PoolClient, QueryConfig, QueryResult } from 'pg';
import { config } from '../config';
import { isPromise } from 'util/types';

const pgPool = new Pool({
  host: config.POSTGRES_HOST,
  port: config.POSTGRES_PORT,
  user: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DB,
});

export type DbClient = {
  query<T extends any[], V extends any[]>(query: string | QueryConfig<T[]>, values?: V): Promise<QueryResult>;
};

export class PgClient {
  private static async getClient() {
    const client = await pgPool.connect();
    return client;
  }

  static async query<T extends any[], V extends any[]>(query: string | QueryConfig<T[]>, values?: V): Promise<QueryResult> {
    // let client = await PgClient.getClient();
    // let queryRes = await client.query(query, values);
    // client.release();
    let queryRes = await pgPool.query(query, values);
    return queryRes;
  }

  static async transact<T>(cb: (client: PoolClient) => Promise<T> | T): Promise<T> {
    let txnClient: PoolClient;
    let cbResult: Promise<T> | T;
    txnClient = await PgClient.getClient();
    try {
      await txnClient.query('BEGIN');
      cbResult = cb(txnClient);
      if(isPromise(cbResult)) {
        await cbResult;
      }
      await txnClient.query('COMMIT');
      return cbResult;
    } catch(e) {
      await txnClient.query('ROLLBACK');
      throw e;
    } finally {
      txnClient.release();
    }
  }

  static end() {
    return pgPool.end();
  }

  static async checkTxn(client: DbClient) {
    /*
    see: https://dba.stackexchange.com/a/208375
    _*/
    let isTxn = !(await client.query('SELECT now() = statement_timestamp() as res')).rows[0]?.res;
    return isTxn;
  }
}
