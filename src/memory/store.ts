export class Memory {
  private data: Map<string, any>;

  constructor() {
    this.data = new Map();
  }

  async get(key: string): Promise<any> {
    return this.data.get(key);
  }

  async set(key: string, value: any): Promise<void> {
    this.data.set(key, value);
  }
}

