import { CommandLineAction, CommandLineStringParameter } from '@rushstack/ts-command-line';
import { SocketClient } from '../lib/SocketClient';
import { Bucket } from '../constants';

const validInstanceNames = ['main', 'manco'];

export class TPrimeAction extends CommandLineAction {
  private _instanceName: CommandLineStringParameter;

  public constructor() {
    super({
      actionName: 'tprime',
      summary: 'Runs DevHooks for Treasury Prime',
      documentation: 'Runs DevHooks for Treasury Prime',
    });
  }

  protected async onExecute(): Promise<void> {
    const instanceName = this._instanceName.value;

    if (!validInstanceNames.includes(instanceName)) {
      throw new Error(`Invalid instance name: ${instanceName}. Valid names are: ${validInstanceNames.join(', ')}`);
    }

    let client: SocketClient;
    if (instanceName === 'main') {
      client = new SocketClient(Bucket.TPrimeMain);
    }
    if (instanceName === 'manco') {
      client = new SocketClient(Bucket.TPrimeManco);
    }

    client.listen();
  }

  protected onDefineParameters(): void {
    this._instanceName = this.defineStringParameter({
      required: true,
      parameterLongName: '--name',
      parameterShortName: '-n',
      argumentName: 'INSTANCE_NAME',
      description: 'The name of the instance to use',
    });
  }
}
