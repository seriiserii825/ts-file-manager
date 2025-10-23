#!/usr/bin/env node

import {EnsureIsWp} from "./modules/ensure/EnsureIsWp.js";
import { JsonPath } from "./modules/paths/JsonPath.js";

async function main() {
  new EnsureIsWp();
  new JsonPath();
}

main();
