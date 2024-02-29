import { NodeTracerProvider } from "@opentelemetry/node";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import { BatchSpanProcessor } from "@opentelemetry/tracing";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { RedisInstrumentation } from "@opentelemetry/instrumentation-redis";

function configureOpenTelemetry(serviceName) {
  // Create a tracer provider and register the Express instrumentation
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      // Add other resource attributes as needed
    }),
  });
  provider.register();

  // Configure and register Jaeger exporter
  const exporter = new JaegerExporter({
    serviceName: serviceName,
    agentHost: "localhost", // Change this to your Jaeger host
    agentPort: 16686, // Change this to your Jaeger port
  });

  // Use BatchSpanProcessor
  const spanProcessor = new BatchSpanProcessor(exporter);
  provider.addSpanProcessor(spanProcessor);

  // Register the Express instrumentation
  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      new ExpressInstrumentation(),
      new RedisInstrumentation(),
    ],
  });

  return provider;
}

export default configureOpenTelemetry;
