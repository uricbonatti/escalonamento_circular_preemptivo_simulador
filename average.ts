export default function average(array: any[], field: string): number {
  const values = array.map((value) => value[field]) as number[];
  const sum = values.reduce((value, c) => value + c, 0);
  return sum / array.length;
}
