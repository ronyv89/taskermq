# TaskerMQ

TaskerMQ is a Redis based simple background job processor for Deno 🦕.

## Usage

```javascript
// sampleWorker.ts
import { WorkerClass } from 'https://deno.land/x/taskermq/mod.ts';

export default class SampleWorker extends WorkerClass {
  // this is the function you need to perform the background job
  perform(params) {
    console.log(params[0] + params[1])
  }
}
```

```javascript
// work.ts
import { Connection, Tasker } from "https://deno.land/x/taskermq/mod.ts";
import SampleWorker from "./samplerWorker.ts";

// Configure your connection to the redis instance
const connection = new Connection({
  hostname: "localhost",
  port: 6379,
});

// Accept a new queue name for your task
const queue = Deno.args[0] || "taskerMQdefault";

// Connect to the redis instance
await connection.connectRedis();

// Create a new Tasker instance using the redis connection, queue name and an array of worker classes
const tasker = new Tasker(connection, queue, [SampleWorker]);

// Run tasker as a long running process.
tasker.run();
```

Our job processor is now set-up. Now we have to start adding jobs to the queue. TaskerMQ assumes the jobs to be in serialized JSON with the following format:

```json
{"klass": "SampleWorker", "params": [1, 2]}
```

TaskerMQ will try to deserialize the string and execute the job.

NOTE: Any job not in the correct format will be ignored and removed from the queue.

To run the worker:

```
deno run --allow-net work.ts sample-worker-queue
```