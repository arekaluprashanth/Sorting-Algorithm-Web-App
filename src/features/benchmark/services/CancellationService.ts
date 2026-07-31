export class CancellationService {
  private static instance: CancellationService;
  private cancelledTokens: Set<string> = new Set();

  public static getInstance(): CancellationService {
    if (!CancellationService.instance) {
      CancellationService.instance = new CancellationService();
    }
    return CancellationService.instance;
  }

  public cancel(token: string): void {
    this.cancelledTokens.add(token);
  }

  public isCancelled(token: string): boolean {
    return this.cancelledTokens.has(token);
  }

  public reset(token: string): void {
    this.cancelledTokens.delete(token);
  }

  public clearAll(): void {
    this.cancelledTokens.clear();
  }
}
