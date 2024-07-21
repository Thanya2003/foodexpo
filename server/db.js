const mongoose = require('mongoose');

module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    const dbUri = process.env.DB;
    if (!dbUri) {
        console.error('Database URI is not defined in environment variables');
        return;
    }

    mongoose.connect(dbUri, connectionParams)
        .then(() => {
            console.log('Connected to database successfully');
        })
        .catch((error) => {
            console.error('Could not connect to database', error);
        });
};
module
