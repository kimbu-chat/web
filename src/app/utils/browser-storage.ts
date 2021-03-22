export class BrowserStorage {
  private readonly prefix: string;

  constructor(prefix: string) {
    this.prefix = `:${prefix}:`;
  }

  public setObject<T>(key: string, value: T): void {
    this.setItem(key, JSON.stringify(value));
  }

  public getObject<T>(key: string): T {
    const item: string = this.getItem(key);

    return JSON.parse(item);
  }

  public getItem(key: string): string {
    return <string>window.localStorage.getItem(this.getKey(key));
  }

  public setItem(key: string, value: string): void {
    window.localStorage.setItem(this.getKey(key), value);
  }

  public removeItem(key: string): void {
    window.localStorage.removeItem(this.getKey(key));
  }

  public clear(): void {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key !== null && key.startsWith(this.prefix)) {
        window.localStorage.removeItem(key);
        i -= 1;
      }
    }
  }

  private getKey(key: string): string {
    return this.prefix + key;
  }
}
