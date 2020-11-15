import { Connection } from "../mod.ts";
import { Tasker } from "../tasker.ts";
import ConsolePrinter from "./consolePrinter.ts";

const connection = new Connection({
  hostname: "localhost",
  port: 6379,
});

const queue = Deno.args[0] || "taskerMQdefault";
await connection.connectRedis();
const tasker = new Tasker(connection, queue, [ConsolePrinter]);
tasker.run();
