const NodeEnvironment = require('jest-environment-node');
const nanoid = require('nanoid/non-secure');

// why: connect to the database in concurrence
module.exports = class UsingMongoEnv extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);

    this.testPath = context.testPath;
    if (process.env.MONGODB_URI == null) {
      this.global.process.env.MONGODB_URI = 'mongodb://localhost/anytt_test';
    }
    this._ORIGINAL_MONGODB_URI_ = process.env.MONGODB_URI;
  }

  async setup() {
    const parsed = new URL(this.global.process.env.MONGODB_URI);
    parsed.pathname = `${parsed.pathname}--${nanoid(4)}`;
    this.global.process.env.MONGODB_URI = parsed.toString();
  }

  async teardown() {
    this.global.process.env.MONGODB_URI = this._ORIGINAL_MONGODB_URI_;
  }

  runScript(script) {
    return super.runScript(script);
  }
};
