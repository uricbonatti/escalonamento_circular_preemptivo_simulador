import * as readline from "readline";

import Circular from "./Circular";

const circular = new Circular();

async function Running() {
  while (!circular.quantumValue) {
    await circular.setQuantumTime();
  }
  await circular.includeDecision();
  const result = await circular.run();
  console.log(result);
}

Running();
