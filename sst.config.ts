import { SSTConfig } from "sst";
import { MyStack } from "./stacks/my-stack";

export default {
  config(_input) {
    return {
      name: "sst-sms-flujo-cas",
      region: "us-east-1",
    };
  },
  stacks(app) {
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }

    app.setDefaultFunctionProps({
      tracing: "disabled",
    });

    app.stack(MyStack);
  }
} satisfies SSTConfig;
