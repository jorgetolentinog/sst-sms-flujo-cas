import { StackContext, Api, EventBus, Function } from "sst/constructs";
import { Chain, DefinitionBody, StateMachine, Parallel, IntegrationPattern, TaskInput, JsonPath, Pass, Fail, Wait, WaitTime } from "aws-cdk-lib/aws-stepfunctions";
import { LambdaInvoke } from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Duration } from "aws-cdk-lib/core";

export function MyStack({ stack }: StackContext) {
  const enviarMensaje = new LambdaInvoke(stack, "Enviar Mensaje", {
    lambdaFunction: new Function(stack, 'EnviarMensajeFunc', {
      handler: "packages/functions/src/enviar-mensaje.handler",
    }),
    retryOnServiceExceptions: false,
  });

  const marcarError = new LambdaInvoke(stack, "Marcar error", {
    lambdaFunction: new Function(stack, 'MarcarErrorFunc', {
      handler: "packages/functions/src/marcar-error.handler",
    }),
  });

  const actualizarEstado = new LambdaInvoke(stack, "Actualizar estado", {
    lambdaFunction: new Function(stack, 'ActualizarEstadoFunc', {
      handler: "packages/functions/src/marcar-error.handler",
    }),
    retryOnServiceExceptions: false,
  });

  enviarMensaje.addRetry({
    errors: ["States.ALL"],
    interval: Duration.seconds(1),
    maxAttempts: 3,
    backoffRate: 2.0,
  });

  enviarMensaje.addCatch(marcarError, {
    errors: ["States.ALL"],
    resultPath: "$.error",
  });

  const esperarResultado = new Wait(stack, "Esperar resultado", {
    time: WaitTime.duration(Duration.seconds(15)),
  });

  new StateMachine(stack, "StateMachine", {
    tracingEnabled: false,
    definitionBody: DefinitionBody.fromChainable(
      Chain.start(enviarMensaje).next(esperarResultado).next(actualizarEstado)
    ),
  })
}
