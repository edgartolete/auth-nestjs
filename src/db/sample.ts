import { poolConnection } from '.';

(async () => {
  await poolConnection.query('SELECT NOW())').then((res) => {
    console.log(res);
  });
})();
