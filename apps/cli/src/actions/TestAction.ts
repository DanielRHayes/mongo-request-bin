import { CommandLineAction } from '@rushstack/ts-command-line';

export class TestAction extends CommandLineAction {
  public constructor() {
    super({
      actionName: 'test',
      summary: 'Tests the CLI',
      documentation: 'Update docs',
    });
  }

  protected onExecute(): Promise<void> {
    console.log('Hello world!');
    return;
  }

  protected onDefineParameters(): void {}
}
