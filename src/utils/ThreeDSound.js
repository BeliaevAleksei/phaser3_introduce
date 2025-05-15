export class ThreeDSound {
  constructor(
    scene,
    soundUrl,
    gameObject,
    maxDistance = 1200,
    minDistance = 200,
    loop = false
  ) {
    this.scene = scene;
    this.gameObject = gameObject;
    this.soundUrl = soundUrl;
    this.context = scene.sound.context;
    this.started = false;
    this.isSoundPlaying = false; // флаг для отслеживания, когда звук начался
    this.maxDistance = maxDistance; // максимальная дистанция, на которой звук можно услышать
    this.minDistance = minDistance; // минимальная дистанция, на которой звук будет полным
    this.loop = loop;
  }

  async initOnUserInput() {
    this._initAudio();
  }

  _initAudio() {
    // Создаём <audio> элемент
    this.audioElement = new Audio(this.soundUrl);
    this.audioElement.loop = this.loop;
    this.audioElement.crossOrigin = "anonymous";

    // Создаём источники и узлы
    this.sourceNode = this.context.createMediaElementSource(this.audioElement);
    this.pannerNode = this.context.createPanner();

    // Настройки паннера для плавного перехода
    this.pannerNode.panningModel = "equalpower"; // Используем равномерное панорамирование
    this.pannerNode.distanceModel = "linear";
    this.pannerNode.maxDistance = this.maxDistance;
    this.pannerNode.refDistance = this.minDistance;
    this.pannerNode.rolloffFactor = 1;

    // Изначальная позиция источника звука (машины)
    this.pannerNode.setPosition(this.gameObject.x, 0, 100); // добавлена ось Z для глубины

    // Подключаем цепочку: источник → паннер → выход
    this.sourceNode.connect(this.pannerNode).connect(this.context.destination);
  }

  play() {
    // Воспроизводим
    this.audioElement.play();
    this.started = true;
    this.isSoundPlaying = true;
  }

  update() {
    if (!this.started || !this.pannerNode) return;
    console.log("DDL this.gameObject.x", this.soundUrl, this.gameObject.x);
    // Получаем позицию машины
    const carX = this.gameObject.x;
    const carY = 0; // Позиция по оси Y (плоский мир)
    const carZ = 100; // Глубина на оси Z для добавления пространства

    // Паннер устанавливаем в положение машины (с небольшой глубиной)
    this.pannerNode.setPosition(carX, carY, carZ);

    // Расширяем центральную зону, где звук одинаково в обоих динамиках
    const camCenterX = this.scene.cameras.main.worldView.centerX; // Центр камеры
    const distanceToCenter = Math.abs(carX - camCenterX);

    if (distanceToCenter < this.maxDistance) {
      // Звук будет одинаково в обоих динамиках, когда машина в пределах центральной зоны
      this.pannerNode.setPosition(carX, carY, carZ);
    }

    // Слушатель устанавливается по центру камеры, чтобы следовать за игроком
    const listener = this.context.listener;
    listener.setPosition(camCenterX, 0, 300); // Смещение по оси Z для слушателя

    // Звук начинается, когда объект выходит за границу экрана
    if (!this.isSoundPlaying && Math.abs(carX) > this.maxDistance) {
      this.audioElement.play();
      this.isSoundPlaying = true;
    }
  }

  stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0; // Вернуться к началу
      this.isSoundPlaying = false;
    }
  }

  pause() {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
      this.isSoundPlaying = false;
    }
  }

  resume() {
    if (this.audioElement && this.audioElement.paused) {
      this.audioElement.play();
      this.isSoundPlaying = true;
    }
  }

  destroy() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = "";
      this.audioElement.load();
      this.audioElement = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.pannerNode) {
      this.pannerNode.disconnect();
      this.pannerNode = null;
    }

    this.started = false;
    this.isSoundPlaying = false;
  }
}
