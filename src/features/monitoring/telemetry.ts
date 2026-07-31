export interface TelemetryEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: number;
}

export class Telemetry {
  private static events: TelemetryEvent[] = [];

  public static track(name: string, properties?: Record<string, unknown>): void {
    const event: TelemetryEvent = {
      name,
      properties,
      timestamp: Date.now(),
    };
    this.events.push(event);
  }

  public static getEvents(): TelemetryEvent[] {
    return [...this.events];
  }

  public static clear(): void {
    this.events = [];
  }
}
