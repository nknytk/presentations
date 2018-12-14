"use strict";

const videoWidth = 640;
const videoHeight = 480;
const imageSize = 224;
const cellSize = 32;
const nCells = 7;
const nClasses = 4;
const vectorSize = 4 + nClasses;
let widthRatio = videoWidth / imageSize;
let heightRatio = videoHeight / imageSize;
let detectionIsRunning = false;
let detectionApp = false;

function lineColor(classId) {
  if (classId == 1) {
    return "red";
  } else if (classId == 2) {
    return "green";
  } else if (classId == 3) {
    return "blue";
  }
}

// Original implemenation is
// https://gist.github.com/cyphunk/6c255fa05dd30e69f438a930faeb53fe
function softmax(arr) {
  const C = Math.max(...arr);
  const d = arr.map((y) => Math.exp(y - C)).reduce((a, b) => a + b);
  return arr.map((value, index) => {
    return Math.exp(value - C) / d;
  })
}


function predObjectList(pred) {
  let detectedObjects = [];
  for (let cellIndex = 0; cellIndex < nCells**2; cellIndex++) {
    const cellVector = pred.slice(cellIndex * vectorSize, (cellIndex + 1) * vectorSize);
    const probas = cellVector.slice(4, vectorSize);
    const classId = WebDNN.Math.argmax(probas);
    if (classId == 0) continue; // class=0 => no object
    if (softmax(probas)[classId] < 0.5) continue;

    const centerX = cellSize * (cellIndex % nCells + cellVector[0]);
    const centerY = cellSize * (Math.floor(cellIndex / nCells) + cellVector[1]);
    const sizeX = cellVector[2] * imageSize;
    const sizeY = cellVector[3] * imageSize;
    const minX = Math.max(0, centerX - sizeX);
    const minY = Math.max(0, centerY - sizeY);
    const maxX = Math.min(imageSize, centerX + sizeX);
    const maxY = Math.min(imageSize, centerY + sizeY);
    detectedObjects.push([classId, minX, minY, maxX, maxY]);
  }
  return detectedObjects;
}


class ObjectDetectionApplication {
  constructor (model_file) {
    this.runner = null;
    this.inputImage = null;
    this.model_file = model_file;
    this.flagRunning = true;
    this.initAsync().then(() => {
      document.getElementById('runButton').disabled = false;
      this.detect();
    });
  }

  async initAsync() {
    this.runner = await WebDNN.load(this.model_file);
    this.inputView = this.runner.inputs[0].toActual();
    this.outputView = this.runner.outputs[0].toActual();

    this.webcam = new WebCam(videoWidth, videoHeight);
    console.log(this.webcam);

    this.$inputVideo = document.getElementById('input');
    this.$inputVideo.width = videoWidth;
    this.$inputVideo.height = videoHeight;
    this.$inputVideo.srcObject = await this.webcam.getNextDeviceStream();
    this.$inputVideo.play()

    this.$outputCanvas = document.getElementById('output');
    this.$outputCanvas.style.display = "";
    this.$outputCanvas.width = videoWidth;
    this.$outputCanvas.height = videoHeight;
  }

  async detect() {
    if (!this.flagRunning) return;

    this.inputView.set(await WebDNN.Image.getImageArray(this.$inputVideo, {
      dstH: imageSize, dstW: imageSize,
      color: WebDNN.Image.Color.RGB,
      order: WebDNN.Image.Order.CHW
    }));

    await this.runner.run();

    WebDNN.Image.setImageArrayToCanvas(
      await WebDNN.Image.getImageArray(this.$inputVideo, {
        dstH: videoHeight, dstW: videoWidth,
        color: WebDNN.Image.Color.RGB,
        order: WebDNN.Image.Order.HWC
      }),
      videoWidth, videoHeight,
      this.$outputCanvas,
      {order: WebDNN.Image.Order.HWC}
    );

    let ctx = document.getElementById('output').getContext('2d');
    for (let detected of predObjectList(this.outputView)) {
      let minX = Math.round(detected[1] * widthRatio);
      let minY = Math.round(detected[2] * heightRatio);
      let sizeX = Math.round((detected[3] - detected[1]) * widthRatio);
      let sizeY = Math.round((detected[4] - detected[2]) * heightRatio);

      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = lineColor(detected[0]);
      ctx.rect(minX, minY, sizeX, sizeY);
      ctx.stroke();
    }

    if (this.flagRunning) requestAnimationFrame( () => this.detect() );
  }

  run () {
    this.flagRunning = true;
    this.detect();
  }

  stop() {
    this.flagRunning = false;
    this.$outputCanvas.style.display = "none";
    this.$inputVideo.pause()
    this.webcam.deactivateMediaStream()

  }
}


function toggleDetection() {
  if (detectionIsRunning) {
    detectionApp.stop();
  } else {
    let c = document.createElement('canvas');
    if (c.getContext('webgl') || c.getContext('experimental-webgl')) {
      detectionApp = new ObjectDetectionApplication("./slimvgg_9_webgl");
    } else {
      detectionApp = new ObjectDetectionApplication("./slimvgg_9_webassembly");
    }
  }
  detectionIsRunning = !detectionIsRunning;
}
