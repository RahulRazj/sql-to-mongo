import sql from 'mssql';
import xmlParser from 'xml2json';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import configQuery from '../config/sqlQuery.json' assert { type: 'json' };

const mapSqlRows = (rows, mapFields, mappings) => {
  const mappedRows = [];
  try {
    if (mapFields.toLowerCase() === 'mappings') {
      const replaceKeys = Object.entries(mappings.rename || {});
      rows.forEach(row => {
        const mappedObj = {};
        for (const [oldKey, newKey] of replaceKeys) {
          row.hasOwnProperty(oldKey) && (mappedObj[newKey] = row[oldKey]);
        }
        mappedRows.push(mappedObj);
      });
    }

    if (mapFields.toLowerCase() === 'mix') {
      const replaceKeys = Object.entries(mappings.rename || {});
      const removeKeys = mappings.remove;

      rows = rows.map(row => {
        for (const [oldKey, newKey] of replaceKeys) {
          row.hasOwnProperty(oldKey) && delete Object.assign(row, { [newKey]: row[oldKey] })[oldKey];
        }
        for (const key of removeKeys) delete row[key];
        return row;
      });
    }

    return mapFields.toLowerCase() === 'mappings' ? mappedRows : rows;
  } catch (err) {
    throw err;
  }
};

const transformData = rows => {
  const sourcesProperty = { mn: 'mnemonic', ln: 'logName', it: 'indexType', desc: 'description', sc: 'serviceCompany', dt: 'dataType', ut: 'unitType', o: 'order' };
  const indexTypeEnum = ['DateTime', 'Date_Time', 'Depth', 'Measured_Depth', 'VerticalDepth', 'Vertical_Depth', 'ElapsedTime', 'Elapsed_Time', 'Length', 'Other', 'Unknown', 'All'];
  const dataTypeEnum = ['Unknown', 'Long', 'Double', 'three', 'Integer', 'five', 'six', 'seven', 'String', 'DateTime', 'Byte', 'Float', 'Int', 'Short', 'String40', 'String16'];
  try {
    rows.forEach(row => {
      // parse sourceXml to Json Object
      const xmlString = row.sources;
      const json = xmlParser.toJson(xmlString);

      const obj = JSON.parse(json);
      let sources = obj.sms.sm;

      row.sources = sources;

      // convert from char literal to boolean
      row.wellboreSpecific = row.wellboreSpecific === 'T';
      row.persistCurve = row.persistCurve === 'T';
      row.overrideDefault = row.overrideDefault === 'T';
      row.tenantId = uuid();

      // add additional json property
      row['additionalInfo'] = JSON.stringify({
        displayName: row.gmSetName,
        details: `${row.gmSetName}_${row.wellUid}_${row.wellboreUid}_${row.dataType}_${row.indexType}`
      });

      // convert sources to an array if not an array
      if (!Array.isArray(row.sources)) {
        row.sources = row.sources === undefined ? [] : [row.sources];
      }

      // rename source properties
      Object.entries(sourcesProperty).forEach(([oldKey, newKey]) => {
        row.sources.forEach(source => {
          delete Object.assign(source, { [newKey]: oldKey == 'o' ? +source[oldKey] : source[oldKey] })[oldKey];
        });
      });

      // parse sources string to enums
      row.sources.forEach(source => {
        source.indexType = indexTypeEnum.indexOf(source.indexType);
        source.dataType = dataTypeEnum.indexOf(source.dataType);
      });

      // change indexType & dataType from string to enum
      row.indexType = indexTypeEnum.indexOf(row.indexType);
      row.dataType = dataTypeEnum.indexOf(row.dataType);
    });
    return rows;
  } catch (err) {
    throw err;
  }
};

export const migrateService = async payload => {
  try {
    const rowsProcessLimit = +process.env.Process_Rows_Limit || 1000;

    let totalRowsProcessed = 0;

    const request = new sql.Request();
    request.stream = true;

    let query = configQuery.filter(q => q.queryName === (payload.useConfigQuery ? payload.queryName : 'defaultGetQuery')).map(q => q.query)[0];

    if (!query) throw 'Missing query config';

    query = query.replace('{TABLE_NAME}', payload.tableName);

    request.query(query);

    let rowsToProcess = [];

    await new Promise((resolve, reject) => {
      try {
        request.on('row', async row => {
          rowsToProcess.push(row);
          if (rowsToProcess.length >= rowsProcessLimit) {
            request.pause();
            await processRows();
          }
        });

        request.on('done', async () => {
          await processRows();
          resolve({ totalRowsProcessed });
        });

        request.on('error', err => {
          reject(err);
        });

        async function processRows() {
          if (rowsToProcess.length == 0) return;

          totalRowsProcessed += rowsToProcess.length;

          let mappedRows = rowsToProcess;
          if (payload.mapFields !== 'original') {
            mappedRows = mapSqlRows(rowsToProcess, payload.mapFields, payload.mappings);
          }

          /* Specific transformation. Skip if not needed */
          if (payload.tableName === 'T_TARGETMNEMONIC') {
            mappedRows = transformData(mappedRows);
          }

          const { db } = mongoose.connection;

          await db.collection(payload.collectionName).insertMany(mappedRows);
          
          console.log(`Processed ${rowsToProcess.length} rows at ${new Date().toLocaleString()}`);

          rowsToProcess = [];

          request.resume();
        }
      } catch (err) {
        reject(err);
      }
    });
    console.log({ totalRowsProcessed });
    return Promise.resolve({ totalRowsProcessed });
  } catch (err) {
    return Promise.reject(err);
  }
};
