import { pool } from "../config/database";

const Paginator = async ({
  table,
  page = 1,
  limit = 10,
  filter, // text after where clause
  sort = "",
  join = "",
  select = "*",
  filterValues = [], // real values of pool query placeholder
}: {
  table: string;
  page?: number;
  limit?: number;
  filter?: string;
  join?: string;
  filterValues?: any[];
  sort?: string;
  select?: string;
}) => {
  const OFFSET = (page - 1) * limit; // page number
  const queryDetails = await pool.query(
    `SELECT ${select} FROM ${table} ${join} ${filter && "WHERE " + filter} ${
      sort && "ORDER BY " + sort
    } LIMIT ${limit} OFFSET ${OFFSET}`,
    filterValues
  );
  const totalItems = queryDetails.rowCount;
  const totalPages = Math.ceil((totalItems || 0) / limit);
  return {
    totalItems,
    totalPages,
    data: queryDetails.rows,
  };
};

export default Paginator;
