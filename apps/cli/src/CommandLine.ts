import { CommandLineParser } from '@rushstack/ts-command-line';

import { TestAction } from './actions/TestAction';

export class RequestBinCli extends CommandLineParser {
  public constructor() {
    super({
      toolFilename: 'request-bin',
      toolDescription: 'Tool for interacting with a request bin',
    });

    this.addAction(new TestAction());
  }
}
