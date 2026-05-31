export interface BlitOpts {
  transparentChar: string;
  autoTrans: boolean;
  defaultColor: string;
}

export class Grid {
  readonly width: number;
  readonly height: number;
  private chars: string[];
  private codes: string[];

  constructor(width: number, height: number) {
    this.width = Math.max(0, Math.floor(width));
    this.height = Math.max(0, Math.floor(height));
    const n = this.width * this.height;
    this.chars = new Array(n).fill(" ");
    this.codes = new Array(n).fill("w");
  }

  private idx(x: number, y: number): number { return y * this.width + x; }
  private inBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  charAt(x: number, y: number): string { return this.chars[this.idx(x, y)]; }
  codeAt(x: number, y: number): string { return this.codes[this.idx(x, y)]; }

  fillChar(ch: string): void { this.chars.fill(ch); }

  clear(): void { this.chars.fill(" "); this.codes.fill("w"); }

  blit(frame: string, mask: string, ox: number, oy: number, opts: BlitOpts): void {
    const fLines = frame.split("\n");
    const mLines = mask ? mask.split("\n") : [];
    for (let row = 0; row < fLines.length; row++) {
      const line = fLines[row];
      const mLine = mLines[row] ?? "";
      let leading = opts.autoTrans;
      for (let col = 0; col < line.length; col++) {
        const ch = line[col];
        if (leading && ch === " ") continue;
        if (ch !== " ") leading = false;
        if (ch === opts.transparentChar) continue;
        const x = Math.floor(ox) + col;
        const y = Math.floor(oy) + row;
        if (!this.inBounds(x, y)) continue;
        const i = this.idx(x, y);
        this.chars[i] = ch;
        const mc = mLine[col];
        this.codes[i] = mc && mc !== " " ? mc : opts.defaultColor;
      }
    }
  }
}
