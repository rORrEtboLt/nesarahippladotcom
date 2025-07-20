import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Path from 'path';

const init = async () => {
  const server = Hapi.server({ port: 3000, host: '0.0.0.0' });
  await server.register(Inert);

  // API route
  server.route({
    method: 'GET',
    path: '/api/hello',
    handler: () => ({ msg: 'Hello from Hapi!' })
  });

  // Serve React static build
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: Path.join(process.cwd(), '../client/build'),
        index: ['index.html']
      }
    }
  });

  await server.start();
  console.log('Running →', server.info.uri);
};
init();
