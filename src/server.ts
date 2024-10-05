import 'reflect-metadata';
import { App } from '@/app';
import { container, setupContainer } from './provider/etl-state.container';

setupContainer();

const app = container.resolve(App);

process.on('uncaughtException', function (err) {
  console.log(
    '****** Unhandled exception in etl-state-manager code ******',
    err,
  );
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('****** Unhandled rejection at ', promise, `reason: ${reason}`);
  process.exit(1);
});

process.on('SIGTERM', (signal) => {
  console.log(
    `****** etl-state-manager Process ${process.pid} received a SIGTERM signal - ${signal}`,
  );
  process.exit(0);
});

process.on('SIGINT', (signal) => {
  console.log(
    `****** etl-state-manager Process ${process.pid} has been interrupted with signal - ${signal}`,
  );
  process.exit(0);
});

app.listen();
