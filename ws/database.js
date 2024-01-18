const mongoose = require('mongoose');

const URI = 'mongodb+srv://salaoUser:semog037@clusterdev.a8j9fx2.mongodb.net/salao-na-mao?retryWrites=true&w=majority';

mongoose.connect(URI);

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Database is connected');
});
