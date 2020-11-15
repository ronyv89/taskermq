import { WorkerClass } from "../workerClass.ts";

export default class ConsolePrinter extends WorkerClass {
  perform(params: Object) {
    console.log(params);
  }
}
