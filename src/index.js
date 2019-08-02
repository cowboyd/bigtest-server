import express from 'express';

export { interruptable } from './interruptable';

export function start(port) {
  return function*() {
    let server = new Server(port);

    let listener = yield server.listen;
    console.log(`listening on port ${listener.address().port}`);

    try {
      while (true) {
        let { response } = yield server.request;
        response.send("OK\n");
      }
    } catch (error) {
      console.log('error = ', error);
    } finally {
      listener.close();
      console.log('shutting down');
    }
  };
}

class Server {
  constructor(port) {
    this.port = port;
    this.app = express().get("/", (request, response) => {
      this.current.resume({ request, response });
    });
    this.current = { resume() {} };
  }

  get listen() {
    return nodecall(this.app, 'listen');
  }

  get request() {
    return execution => {
      this.current = execution;
    };
  }
}

function nodecall(object, methodName, args = []) {
  return execution => {
    let result = object[methodName].apply(object, args.concat(err => {
      if (err) {
        execution.throw(err);
      } else {
        execution.resume(result);
      }
    }));
  };
}
