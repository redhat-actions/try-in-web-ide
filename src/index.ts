import "reflect-metadata";
import { setFailed } from "@actions/core";
import { Main } from "./main";

new Main().start().catch(setFailed);
