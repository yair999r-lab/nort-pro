import '@libs/demo';
import '@libs/united_packages';
import express from 'express';
import {
  corsMiddleware,
  pinoMiddleware,
  handleServerError,
  checkPostgresConnection,
  SERVER_PORT as PORT,
} from '@libs/global';
import router from './router';
// import { createTables } from "./helpers/postgres/createTables";
const app = express();
app.use(corsMiddleware);
app.use(pinoMiddleware);
app.use(express.json());
app.use(router);
app.use(express.static('./public'));

checkPostgresConnection()
  .then(() =>
    app.listen(PORT, () =>
      global.log.info({ tag: 'INITIAL SERVER' }, `server run on port ${PORT}`),
    ),
  )
  .catch(() =>
    global.log.error({ tag: 'INITIAL SERVER' }, 'The server in not listening'),
  );

app.use(handleServerError);
