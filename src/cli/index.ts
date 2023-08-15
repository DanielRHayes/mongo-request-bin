import { CommandLineParser } from '@rushstack/ts-command-line';

import { TPrimeAction } from './actions/TPrimeAction';

export class DevHooksCli extends CommandLineParser {
  public constructor() {
    super({
      toolFilename: 'request-bin',
      toolDescription: 'Tool for interacting with a request bin',
    });

    this.addAction(new TPrimeAction());
  }
}
