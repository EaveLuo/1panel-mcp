import { BaseAPI } from "./base.js";

export class TerminalAPI extends BaseAPI {
  async execCommand(command: string, cwd?: string): Promise<any> {
    return this.post("/api/v2/hosts/command", { command, cwd });
  }
}
