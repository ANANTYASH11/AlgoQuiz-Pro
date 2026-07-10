export class KeyValuePair<K, V> {
  constructor(public key: K, public value: V) {}
}

export class HashMap<K, V> {
  private buckets: KeyValuePair<K, V>[][];
  private _size: number = 0;

  constructor(private capacity: number = 127) {
    this.buckets = Array.from({ length: capacity }, () => []);
  }

  private hash(key: K): number {
    const str = String(key);
    let hashVal = 0;
    for (let i = 0; i < str.length; i++) {
      hashVal = (hashVal * 31 + str.charCodeAt(i)) % this.capacity;
    }
    return hashVal;
  }

  public put(key: K, value: V): void {
    const bucketIdx = this.hash(key);
    const bucket = this.buckets[bucketIdx];
    for (const pair of bucket) {
      if (pair.key === key) {
        pair.value = value;
        return;
      }
    }
    bucket.push(new KeyValuePair(key, value));
    this._size++;
  }

  public get(key: K): V | undefined {
    const bucketIdx = this.hash(key);
    const bucket = this.buckets[bucketIdx];
    for (const pair of bucket) {
      if (pair.key === key) {
        return pair.value;
      }
    }
    return undefined;
  }

  public has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  public delete(key: K): boolean {
    const bucketIdx = this.hash(key);
    const bucket = this.buckets[bucketIdx];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === key) {
        bucket.splice(i, 1);
        this._size--;
        return true;
      }
    }
    return false;
  }

  public clear(): void {
    this.buckets = Array.from({ length: this.capacity }, () => []);
    this._size = 0;
  }

  public size(): number {
    return this._size;
  }

  public getSize(): number {
    return this._size;
  }

  public keys(): K[] {
    const list: K[] = [];
    for (const bucket of this.buckets) {
      for (const pair of bucket) {
        list.push(pair.key);
      }
    }
    return list;
  }

  public values(): V[] {
    const list: V[] = [];
    for (const bucket of this.buckets) {
      for (const pair of bucket) {
        list.push(pair.value);
      }
    }
    return list;
  }
}
