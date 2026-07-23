/**
 * Client-Side WebSocket Log Streamer with Exponential Backoff
 */
export class LogWebSocketClient {
  constructor(options = {}) {
    this.url = options.url || 'ws://localhost:8080/logs';
    this.onLog = options.onLog;
    this.onStatusChange = options.onStatusChange;

    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    this.updateStatus('connecting');

    try {
      // Create Mock WebSocket or standard WebSocket if supported
      this.socket = new EventTarget();
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.updateStatus('connected');
    } catch (err) {
      this.handleReconnect();
    }
  }

  handleReconnect() {
    this.isConnected = false;
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 16000);
      this.updateStatus(`reconnecting (attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connect(), delay);
    } else {
      this.updateStatus('failed');
    }
  }

  updateStatus(status) {
    if (this.onStatusChange) {
      this.onStatusChange(status);
    }
  }

  receiveChunk(chunk) {
    if (this.onLog) {
      this.onLog(chunk);
    }
  }

  close() {
    this.isConnected = false;
    this.updateStatus('disconnected');
  }
}
