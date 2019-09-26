const InitConnection = require('./services/connection').init;
const InitWorker = require('./services/worker');

InitConnection()
  .then(() => InitWorker())
  .then(() => {
    console.log('Application is running');
  })
  .catch(err => {
    console.error('[INIT]: ', err.message);
  });
