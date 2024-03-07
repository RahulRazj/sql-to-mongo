import mongoose from 'mongoose';

export const createMongoDBConnection = async () => {
  try {
    const options = { connectTimeoutMS: 30000 };

    if (!process.env.MongoDB_Connection_String) {
      throw 'DB connection url is missing.';
    }

    await mongoose.connect(process.env.MongoDB_Connection_String, options);
    console.log('Connection to Mongo database successful');
  } catch (error) {
    console.error('Mongo Database connection unsuccessful', error);
    throw error;
  }
};
