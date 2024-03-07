import { migrateService } from '../services/migrator_service.js';

export const migrate = async (req, res) => {
  try {
    const payLoad = {
      tableName: req.body.sqlTableName,
      collectionName: req.body.mongoCollectionName,
      mapFields: req.body.mapFields,
      useConfigQuery: req.body.useConfigQuery,
      queryName: req.body.queryName || '',
      mappings: {
        remove: (req.body.mappings && req.body.mappings.remove) || [],
        rename: (req.body.mappings && req.body.mappings.rename) || {}
      }
    };

    if (!payLoad.mapFields) throw { statusCode: 400, message: 'Bad Request, Missing mapFields value' };

    if (!['original', 'mappings', 'mix'].includes(payLoad.mapFields)) throw { statusCode: 400, message: `Invalid Request, mapFields value must be one of these: 'original', 'mappings', 'mix'` };

    if (!payLoad.collectionName) throw { statusCode: 400, message: 'Bad Request, Missing mongo collection name' };

    if (!payLoad.tableName) throw { statusCode: 400, message: 'Bad Request, Missing sql table name' };

    if (typeof payLoad.mappings !== 'object' && !Array.isArray(payLoad.mappings.remove)) throw { statusCode: 400, message: 'Invalid Request, Mappings must be an object type' };

    if (!Array.isArray(payLoad.mappings.remove)) throw { statusCode: 400, message: 'Invalid Request, Mapping remove keys must be array of strings' };

    if (payLoad.useConfigQuery && typeof payLoad.useConfigQuery != 'boolean') throw { statusCode: 400, message: 'Invalid Request, useConfigQuery must be a boolean type' };

    if (payLoad.useConfigQuery && !payLoad.queryName) throw { statusCode: 400, message: 'Invalid Request, Query name is required when useConfigQuery is true' };

    const response = await migrateService(payLoad);

    return res.send(response);
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).send(err);
  }
};
