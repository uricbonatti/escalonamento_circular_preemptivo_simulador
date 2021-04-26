interface AfterProcess {
  name: string;
  waitingTime: number;
  tourarountTime: number;
  returnTime: number;
}

export default interface ProcessResume {
  processResume: AfterProcess[];
  totalCpuTime: number;
  waitingAverageTime: number;
  turnaroundAverageTime: number;
}
