import { performance } from 'perf_hooks';

interface TraceMetadata {
  timestamp: string;
  duration: number;
  component: string;
  method: string;
  args: any[];
  result?: any;
  error?: any;
}

export class TracingService {
  private static traces: TraceMetadata[] = [];
  private static maxTraces = 1000;

  static addTrace(trace: TraceMetadata) {
    this.traces.unshift(trace);
    if (this.traces.length > this.maxTraces) {
      this.traces.pop();
    }
  }

  static getTraces() {
    return this.traces;
  }

  static clearTraces() {
    this.traces = [];
  }
}

type DecoratorFunction = (
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<any>
) => TypedPropertyDescriptor<any>;

function createTracingDecorator(): DecoratorFunction {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): TypedPropertyDescriptor<any> {
    const originalMethod = descriptor.value;
    if (!originalMethod) return descriptor;

    descriptor.value = async function (...args: any[]) {
      const start = performance.now();
      const component = this.constructor.name;
      console.log(`Entering ${String(propertyKey)}`);
      try {
        const result = await originalMethod.apply(this, args);
        console.log(`Exiting ${String(propertyKey)}`);
        const trace: TraceMetadata = {
          timestamp: new Date().toISOString(),
          duration: performance.now() - start,
          component,
          method: String(propertyKey),
          args,
          result
        };
        TracingService.addTrace(trace);
        return result;
      } catch (error) {
        const trace: TraceMetadata = {
          timestamp: new Date().toISOString(),
          duration: performance.now() - start,
          component,
          method: String(propertyKey),
          args,
          error
        };
        TracingService.addTrace(trace);
        throw error;
      }
    };

    return descriptor;
  };
}

export const withTracing = createTracingDecorator();