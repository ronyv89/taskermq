import { sleep } from "https://deno.land/x/sleep/mod.ts";
import { Connection } from "./connection.ts";
import { WorkerClass } from "./workerClass.ts";

export class Tasker {
  queue: string;
  connection: Connection;
  workerClasses: typeof WorkerClass[];

  constructor(
    connection: Connection,
    queue: string,
    workerClasses: typeof WorkerClass[],
  ) {
    this.queue = queue;
    this.connection = connection;
    this.workerClasses = workerClasses;
  }

  async run() {
    while (true) {
      const taskDetails = await this.connection.redis.lpop(this.queue);
      if (taskDetails) {
        try {
          const decodedTask = JSON.parse(taskDetails);
          const className = decodedTask.klass;
          const params: Object = decodedTask.params;
          const klass = this.workerClasses.find(
            (workerClass: typeof WorkerClass) => workerClass.name === className,
          );
          if (klass) {
            const instance: WorkerClass = new klass();
            instance.perform(params);
          }
        } catch (e) {
          console.log("Error occured. Skipping job");
          console.log(e);
        }
      } else {
        await sleep(5);
      }
    }
  }
}
