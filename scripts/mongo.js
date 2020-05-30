const mongo = require('mongodb').MongoClient;
const url = 'mongodb+srv://ghellach:Alpha556677@achrafscluster-zxrkx.azure.mongodb.net/authdash?authSource=admin&replicaSet=AchrafsCluster-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true';
const dbName = 'authdash';
const client = new mongo(url, { useUnifiedTopology: true });

end = () => {console.log(Date() + ' | MongoDB query completed successfully'); process.exit()};

queryBuilder = async () => {
    await client.connect();
    const db = client.db(dbName);

    const query = await db.collection('applications').findOne();
    console.log(query);
}

queryBuilder().then(() => end());
