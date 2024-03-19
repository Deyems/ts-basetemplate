import { getPort } from '@common/utils/envConfig';
import { app, logger } from '@src/server';

const port = getPort();

const server = app.listen(port, () => {
  logger.info(`Server is listening on port ${port}`);
});

const onCloseSignal = () => {
  logger.info('sigint received, shutting down');
  server.close(() => {
    logger.info('server closed');
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

const onCloseSigTerm = () => {
  logger.info('sigterm received, shutting down');
  server.close(() => {
    logger.info('server closed');
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

const onCaughtSignal = () => {
  logger.info('UNCAUGHT EXCEPTION! 💥 Server Shutting down...');
  server.close(() => {
    logger.info('server closed');
    logger.error('UNCAUGHT EXCEPTION!! 💥 Server Shutting down... ' + new Date(Date.now()));
    process.exit();
  });
  setTimeout(() => process.exit(1), 5000).unref(); // Force shutdown after 5s
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSigTerm);
process.on('uncaughtException', onCaughtSignal);
