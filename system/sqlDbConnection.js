import sql from 'mssql';

export const createSqlConnection = async () => {
  try {
    const sqlConfig = {
      server: process.env.Sql_Server,
      user: process.env.Sql_Server_Username,
      password: process.env.Sql_Server_Password,
      database: process.env.Sql_Server_Database_Name
    };

    if (!sqlConfig.server) throw 'Sql Server Server missing';
    if (!sqlConfig.user) throw 'Sql Server user missing';
    if (!sqlConfig.password) throw 'Sql Server password missing';
    if (!sqlConfig.database) throw 'Sql Server database name missing';

    await sql.connect(sqlConfig);
    console.log('Connection to Sql database successful');
  } catch (err) {
    console.error('Sql Database connection unsuccessful', err);
    throw err;
  }
};
