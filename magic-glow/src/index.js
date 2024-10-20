import configMessage from './configMessage';

const popConexao = document.getElementById('pop-conexao');
const popContent = document.getElementById('pop-content');
const popIconClose = document.getElementById('pop-icon-close');
const popIconCheck = document.getElementById('pop-icon-check');

const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
  let configSucess = configMessage.sucess();

  popConexao.classList.add(configSucess.class);
  popContent.textContent = configSucess.text;
  popIconClose.style = 'display: none;';
  popIconCheck.style = 'display: block; opcaticy: 1;';

  initCamera(
    config.video.width, config.video.height, config.video.fps
  ).then(video => {
    video.play()
    video.addEventListener("loadeddata", event => {
      cameraState.classList.remove('state-off');
      cameraState.classList.add('state-on');
      popConexao.style = "opacity: 0;";
      main();
    })
  })

  const canvas = document.querySelector("#pose-canvas");
  canvas.width = config.video.width;
  canvas.height = config.video.height;
};


socket.onmessage = (event) => {
  
  if (event.data == "2") {
    let configSucess = configMessage.sucess();

    popConexao.classList.add(configSucess.class);
    popContent.textContent = configSucess.text;
    popIconClose.style = 'display: none;';
    popIconCheck.style = 'display: block; opcaticy: 1;';
  }
};

socket.onclose = () => {
  let configError = configMessage.error();
  popConexao.classList.add(configError.class);
  popContent.textContent = configError.text;
  popIconClose.style = 'display: block;';
  popIconCheck.style = 'display: none; opcaticy: 1;';
};

// Quando ocorre um erro
socket.onerror = (error) => {
  let configError = configMessage.error();
  popConexao.classList.add(configError.class);
  popContent.textContent = configError.text;
  popIconClose.style = 'display: block;';
  popIconCheck.style = 'display: none; opcaticy: 1;';
};

const cameraState = document.getElementById('cameraState');
const lampState = document.getElementById('lampState');

const { GestureDescription, Finger, FingerCurl, FingerDirection } = window.fp;

const rockGesture = new GestureDescription('rock'); // ✊️
const paperGesture = new GestureDescription('paper'); // 🖐

rockGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
rockGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

// all other fingers: curled
for(let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    rockGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
    rockGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

// Paper
// -----------------------------------------------------------------------------

// no finger should be curled
for(let finger of Finger.all) {
    paperGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

const gestures = [
  rockGesture, paperGesture
];

const config = {
  video: { width: 640, height: 480, fps: 30 }
};

const gestureStrings = {
  'rock': '✊️',
  'paper': '🖐',
};

async function createDetector() {
  return window.handPoseDetection.createDetector(
    window.handPoseDetection.SupportedModels.MediaPipeHands,
    {
      runtime: "mediapipe",
      modelType: "full",
      maxHands: 2,
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915`,
    }
  )
}

// Função para converter os valores recebidos para a faixa de 1 a 100
function converterParaEscalaDe1a100(x) {
  // Valores de entrada (mínimo e máximo)
  const entradaMin = 160;
  const entradaMax = 520;

  // Valores de saída (1 a 100)
  const saidaMin = 1;
  const saidaMax = 100;

  // Mapeia o valor de x para a escala de 1 a 100
  const resultado = mapearValor(x, entradaMin, entradaMax, saidaMin, saidaMax);

  // Garante que o valor retornado esteja dentro dos limites de 1 a 100
  return Math.min(Math.max(resultado, saidaMin), saidaMax);
}

function mapearValor(valor, inMin, inMax, outMin, outMax) {
  // Mapeia o valor da faixa [inMin, inMax] para [outMin, outMax]
  return ((valor - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

async function main() {

  const video = document.querySelector("#pose-video")
  const canvas = document.querySelector("#pose-canvas")
  const ctx = canvas.getContext("2d")
  const resultLayer = {
    right: document.querySelector("#pose-result-right"),
    left: document.querySelector("#pose-result-left")
  }

  // configure gesture estimator
  // add "✌🏻" and "👍" as sample gestures
  const knownGestures = [
    ...gestures
  ]
  const GE = new fp.GestureEstimator(knownGestures)
  // load handpose model
  const detector = await createDetector()
  
  let numeroDeTentativas = 0;

  // main estimation loop
  const estimateHands = async () => {
    numeroDeTentativas += 1;

    // clear canvas overlay
    ctx.clearRect(0, 0, config.video.width, config.video.height);
    resultLayer.right.innerText = '';
    resultLayer.left.innerText = '';
    
    // get hand landmarks from video
    const hands = await detector.estimateHands(video, {
      flipHorizontal: true
    });

    for (const hand of hands) {
        
        const keypoints3D = hand.keypoints3D.map(keypoint => [keypoint.x, keypoint.y, keypoint.z])
        const predictions = GE.estimate(keypoints3D, 9);
       
        const middleFinger = hand.keypoints[12]; // Ponta do dedo do meio
        
        // x - max - 520
        // x - medium - 340
        // x - min - 160

        if (predictions.gestures.length > 0) {
        
          const result = predictions.gestures.reduce((p, c) => (p.score > c.score) ? p : c);
          
          const valorParaLigarLed = converterParaEscalaDe1a100(middleFinger.x).toFixed(0);
          
          if (result.name == 'rock') turnOffLed();
          else turnOnLed(valorParaLigarLed);

          const found = gestureStrings[result.name];
          const chosenHand = hand.handedness.toLowerCase();

          if(found !== gestureStrings.dont) {
              resultLayer[chosenHand].innerText = found;
              continue;
          }
        }
      }

    setTimeout(() => { 
      estimateHands();
    }, 1000 / config.video.fps);
    
    if (numeroDeTentativas == 150 && hands.length == 0) { 
      turnOffLed();
      numeroDeTentativas = 0; 
    }
  }

  estimateHands();
}

function turnOffLed() {
  lampState.classList.remove('state-on');
  lampState.classList.add('state-off');
  socket.send("1"); 
}

function turnOnLed(value) {
  lampState.classList.add('state-on');
  lampState.classList.remove('state-off');
  socket.send(value); 
}

async function initCamera(width, height, fps) {

  const constraints = {
    audio: false,
    video: {
      facingMode: "user",
      width: width,
      height: height,
      frameRate: { max: fps }
    }
  }

  const video = document.querySelector("#pose-video")
  video.width = width
  video.height = height

  // get video stream
  const stream = await navigator.mediaDevices.getUserMedia(constraints)
  video.srcObject = stream

  return new Promise(resolve => {
    video.onloadedmetadata = () => { 
      resolve(video)
    }
  })
}

function drawPoint(ctx, x, y, r, color) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fillStyle = color
  ctx.fill()
}
