class InvalidOperationError extends Error {
    constructor(message) {
      super(message);
      this.name = "InvalidOperationError"; 
    }
}

class InvalidArgumentError extends Error {
    constructor(message) {
      super(message);
      this.name = "InvalidArgumentError"; 
    }
}

export {InvalidOperationError}
export {InvalidArgumentError}