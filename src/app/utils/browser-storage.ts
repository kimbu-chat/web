export class BrowserStorage {
  private readonly prefix: string;

  constructor(prefix: string) {
    this.prefix = ':' + prefix + ':';
  }

  public setObject<T>(key: string, value: T): void {
    if (typeof value === 'object') {
      this.setItem(key, JSON.stringify(value));
    } else {
      this.setItem(key, null);
    }
  }

  // @ts-ignore
  public getObject<T>(key: string, defaultValue: T = undefined): T {
    let result: T = defaultValue;

    const item: string = this.getItem(key);

    if (item !== undefined) {
      try {
        result = JSON.parse(item);
      } catch (e) {
        console.error(`Failed to parse object with key = '${this.getKey(key)}'`, e);
      }
    }

    return result !== undefined && result !== null ? result : defaultValue;
  }

  public getItem(key: string): string {
    return <string>window.localStorage.getItem(this.getKey(key));
  }

  public setItem(key: string, data: any): void {
    window.localStorage.setItem(this.getKey(key), data);
  }

  public removeItem(key: string): void {
    window.localStorage.removeItem(this.getKey(key));
  }

  public clear(): void {
    for (let i = 0; i < window.localStorage.length; i++) {
      if (window?.localStorage?.key(i)?.startsWith(this.prefix)) {
        // @ts-ignore
        window.localStorage.removeItem(window.localStorage.key(i));
        i--;
      }
    }
  }

  private getKey(key: string): string {
    return this.prefix + key;
  }
}
