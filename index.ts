import { generate_dm } from "./generate_dm.ts";

const TEST_ARRAY = ["1", "9", "15", "20", "500", "999", "77", "69"];

for (const i in TEST_ARRAY) {
  await generate_dm(TEST_ARRAY[i]);
}
