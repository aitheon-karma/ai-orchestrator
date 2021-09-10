import * as http from 'http';
import * as path from 'path';
import { environment } from '../environment';
import { ExpressConfig, logger } from '@aitheon/core-server';
import * as docs from '@aitheon/core-server';
import { TransporterBroker } from '@aitheon/transporter';

export class Application {

  server: http.Server;
  express: ExpressConfig;
  transporter: TransporterBroker;

  constructor(transporter: TransporterBroker) {
    /**
     * Inner microservices communication via transporter
     */
    this.transporter = transporter;
    this.transporter.start();
    this.express = new ExpressConfig();

    docs.init(this.express.app, () => {
      console.log('Swagger documentation generated');
    });

    /**
     * Start server
     */
    this.server = this.express.app.listen(environment.port, () => {
      logger.debug(`
        ------------
        ${ environment.service._id} Service Started!
        Express: http://localhost:${ environment.port}
        ${ environment.production ? 'Production: true' : ''}
        ------------
      `);
    });

  }

}