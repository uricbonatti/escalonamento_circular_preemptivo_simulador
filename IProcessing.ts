import IEntranceProcess from "./IEntranceProcess";

export default interface IProcessing extends IEntranceProcess {
  waitingTime: number;
  status: "blocked" | "running" | "ready" | "complete";
  endTime?: number;
  remainingTime: number;
  startTime: number;
  priority?: 1 | 2 | 3 | 4 | 5;
  tourarountTime?: number;
}
