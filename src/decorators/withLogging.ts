export function withLogging(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function(...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    try {
      const result = await originalMethod.apply(this, args);
      console.log(`${propertyKey} returned:`, result);
      return result;
    } catch (error) {
      console.error(`${propertyKey} threw error:`, error);
      throw error;
    }
  };

  return descriptor;
}