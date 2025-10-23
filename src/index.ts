#!/usr/bin/env node

import {EnsureIsWp} from "./modules/ensure/EnsureIsWp.js";
import {AppPaths} from "./modules/paths/AppPaths.js";
import { JsonPath } from "./modules/paths/JsonPath.js";

async function main() {
  const app_path = new AppPaths();
  new EnsureIsWp(app_path.getThemeDir());
  new JsonPath();
}

main();
