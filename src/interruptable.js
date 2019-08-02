export function interruptable(proc) {
  return function*() {
    let interrupt = () => console.log('') || this.halt();
    process.on('SIGINT', interrupt);
    try {
      yield proc;
    } finally {
      process.off('SIGINT', interrupt);
    }
  };
}
