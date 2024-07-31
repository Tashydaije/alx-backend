import { createQueue } from "kue";
import createPushNotificationsJobs from "./8-job";
import {expect} from "chai";

const testQueue = createQueue({name: "Tests: Job creator"});

testQueue.testMode();
