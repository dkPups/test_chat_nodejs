class RequestError extends Error {
  constructor(status, message) {
    super();
    this.name = 'RequestError';
    this.status = status;

    if (status === 500) {
      this.message =
        'Internal server error: something went wrong on server side';
    } else {
      this.message = message;
    }
  }
}

module.exports = RequestError;
