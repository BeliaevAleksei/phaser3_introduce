class WebSocketService {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("🔗 WebSocket подключен:", this.url);
      this.isConnected = true;
    };

    this.socket.onmessage = (event) => {
      console.log("📩 Получено сообщение:", event.data);
    };

    this.socket.onclose = () => {
      console.log("❌ WebSocket отключен");
      this.isConnected = false;
    };

    this.socket.onerror = (error) => {
      console.error("⚠ Ошибка WebSocket:", error);
    };
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
      console.log("📤 Отправлено:", data);
    } else {
      console.warn("🚫 WebSocket не подключен, отправка невозможна");
    }
  }
}

const wsService = new WebSocketService(
  process.env.WS_SERVER || "ws://localhost:8080"
);
export default wsService;
