import * as readline from "readline";
import average from "./Average";
import IEntranceProcess from "./IEntranceProcess";
import IProcessing from "./IProcessing";
import ProcessResume from "./ProcessResume";

class Circular {
  private quantum: number;
  private entranceProcess: IEntranceProcess[];
  private processing: IProcessing[];
  constructor() {
    this.entranceProcess = [];
  }
  get quantumValue() {
    return this.quantum;
  }
  async setQuantumTime() {
    const quantumReader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) => {
      quantumReader.question(
        "Digite o valor de Quantum: ",
        async (quantumString) => {
          const quantum = parseInt(quantumString);
          if (quantum > 0) {
            this.quantum = quantum;
            console.log("\nQuantum Time: ", this.quantum, "\n");

            return resolve(quantumReader.close());
          } else {
            return resolve(quantumReader.close());
          }
        }
      );
    });
  }

  async includeDecision() {
    let notInclude: boolean = false;

    while (!notInclude) {
      await this.includeProcess();
      await new Promise((resolve) => {
        const decisionReader = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        decisionReader.question(
          "Deseja incluir outro processo (S/N): ",
          (response) => {
            if (response.toLowerCase().includes("s")) {
              return resolve(decisionReader.close());
            } else {
              notInclude = true;
              return resolve(decisionReader.close());
            }
          }
        );
      });
    }
  }

  async includeProcess() {
    const processReader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) => {
      processReader.question("Digite Nome do Processo: ", (name) => {
        processReader.question(
          "Digite o Tempo de Processamento: ",
          (processTimeString) => {
            const nameExistis = this.entranceProcess.filter(
              (process) => process.name === name
            );
            if (nameExistis.length > 0) {
              name += ` (${nameExistis.length})`;
            }
            const processTime = parseInt(processTimeString);
            if (processTime > 0) {
              this.entranceProcess.push({ name, processTime });
              console.log(
                `\nProcesso ${name} incluido com o tempo de processamento ${processTime} \n\n`
              );
              return resolve(processReader.close());
            } else {
              console.log(
                `\nProcesso ${name} não incluido,tempo de processamento ${processTime} é invalido.\n Dica: O tempo de processamento precisa ser superior a 0\n\n`
              );
              return resolve(processReader.close());
            }
          }
        );
      });
    });
  }
  run(): ProcessResume {
    if (this.entranceProcess.length < 1) {
      return {
        processResume: [],
        totalCpuTime: 0,
        waitingAverageTime: 0,
        turnaroundAverageTime: 0,
      };
    }
    if (this.entranceProcess.length === 1) {
      const process = this.entranceProcess[0];
      return {
        processResume: [
          {
            name: process.name,
            waitingTime: 0,
            tourarountTime: process.processTime,
            returnTime: process.processTime,
          },
        ],
        totalCpuTime: process.processTime,
        waitingAverageTime: 0,
        turnaroundAverageTime: process.processTime,
      };
    }

    this.processing = [
      ...this.entranceProcess.map((process) => {
        return {
          startTime: 0,
          status: "blocked",
          remainingTime: process.processTime,
          processTime: process.processTime,
          name: process.name,
          waitingTime: 0,
        } as IProcessing;
      }),
    ];
    let totalCpuTime: number = 0;
    this.processing[0].status = "running";
    this.processing[1].status = "ready";

    let timeToChange = 0;

    while (
      this.processing.filter((process) => process.status !== "complete")
        .length > 0
    ) {
      totalCpuTime++;
      timeToChange += 1;

      let goToNextProcess = timeToChange === this.quantum;

      const runningProcess = this.processing
        .filter((process) => process.status === "running")
        .shift();
      const indexSelected = this.processing.indexOf(runningProcess);
      runningProcess.remainingTime -= 1;

      if (runningProcess.remainingTime === 0) {
        runningProcess.status = "complete";
        runningProcess.endTime = totalCpuTime;
        goToNextProcess = true;
        timeToChange = 0;
      }

      const readyProcess = this.processing
        .filter((process) => process.status === "ready")
        .shift();

      if (goToNextProcess && runningProcess.remainingTime !== 0) {
        if (!!readyProcess) {
          runningProcess.status = "blocked";
        }
        timeToChange = 0;
      }
      this.processing[indexSelected] = { ...runningProcess };

      if (!!readyProcess && goToNextProcess) {
        readyProcess.status = "running";

        const indexReady = this.processing.indexOf(readyProcess);
        this.processing[indexReady] = { ...readyProcess };

        const processWaiting = this.processing.filter(
          (process) => process.status === "blocked"
        );

        if (processWaiting.length > 0) {
          const indexOfWaitingProcess = processWaiting.map((process) =>
            this.processing.indexOf(process)
          );
          const largerIndex = indexOfWaitingProcess.filter(
            (index) => index > indexReady
          );
          if (largerIndex.length) {
            const indexNextReady = Math.min(...largerIndex);
            this.processing[indexNextReady].status = "ready";
          } else {
            const indexNextReady = Math.min(...indexOfWaitingProcess);
            this.processing[indexNextReady].status = "ready";
          }
        }
      }
    }
    const processResume = this.processing.map((process) => {
      return {
        name: process.name,
        waitingTime: process.endTime - process.processTime,
        tourarountTime: process.endTime - process.startTime,
        returnTime: process.endTime,
      };
    });
    return {
      processResume: processResume,
      totalCpuTime,
      waitingAverageTime: average(processResume, "waitingTime"),
      turnaroundAverageTime: average(processResume, "tourarountTime"),
    };
  }
}

export default Circular;
