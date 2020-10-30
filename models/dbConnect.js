const MongoClient = require('mongodb').MongoClient;

const url = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_NAME;

const options = {
    useUnifiedTopology: true
};

module.exports = () => {
    return new Promise((resolve, reject) => {
        new MongoClient(url, options).connect()
            .then(client => {
                resolve({
                    client: client,
                    db: client.db(dbName)
                })
            })
            .catch(err => reject(err));
    })
}