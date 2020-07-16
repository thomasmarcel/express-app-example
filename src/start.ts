// @ts-nocheck
import express from "express";
import "express-async-errors";
import logger from "loglevel";
import { getRoutes } from "./routes";

function startServer({ port = process.env.PORT } = {}) {
  const app = express();

  app.use("/api", getRoutes());

  app.use(errorMiddleware);

  // src/start.ts(17,7): error TS2322: Type '() => Promise<unknown>' is not assignable to type '(callback?: ((err?: Error | undefined) => void) | undefined) => Server'.
  // Type 'Promise<unknown>' is missing the following properties from type 'Server': listen, close, address, getConnections, and 25 more

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      logger.info(`Listening on port ${port}`);
      const originalClose = server.close.bind(server);
      server.close = () => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose);
        });
      };
      setupCloseOnExit(server);
      resolve(server);
    });
  });
}

function errorMiddleware(error: any, req: any, res: any, next: any) {
  if (res.headersSent) {
    next(error);
  } else {
    logger.error(error);
    res.status(500);
    res.json({
      message: error.message,
      // we only add a `stack` property in non-production environments
      ...(process.env.NODE_ENV === "production"
        ? null
        : { stack: error.stack }),
    });
  }
}

function setupCloseOnExit(server: any) {
  // thank you stack overflow
  // https://stackoverflow.com/a/14032965/971592
  async function exitHandler(options = { exit: false }) {
    await server
      .close()
      .then(() => {
        logger.info("Server successfully closed");
      })
      .catch((e: any) => {
        logger.warn("Something went wrong closing the server", e.stack);
      });
    // eslint-disable-next-line no-process-exit
    if (options.exit) process.exit();
  }

  // do something when app is closing
  process.on("exit", exitHandler);

  // catches ctrl+c event
  process.on("SIGINT", exitHandler.bind(null, { exit: true }));

  // catches "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
  process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

  // catches uncaught exceptions
  process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
}

export { startServer };
