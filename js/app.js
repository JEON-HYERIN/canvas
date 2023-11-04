const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const saveBtn = document.querySelector('#save');
const textInput = document.querySelector('#text');
const fileInput = document.querySelector('#file');
const modeBtn = document.querySelector('#mode-btn');
const destroyBtn = document.querySelector('#destroy-btn');
const eraserBtn = document.querySelector('#eraser-btn');
const colorOptions = Array.from(document.getElementsByClassName('color-option'));
const lineWidth = document.querySelector('#line-width');
const color = document.querySelector('#color');
const fontSelect = document.querySelector('select');

canvas.width = 800;
canvas.height = 800;
ctx.lineWidth = lineWidth.value;
ctx.font = '68px serif';
ctx.lineCap = 'round'; // 선의 끝점을 그리는데 사용되는 모양
let isPainting = false;
let isFilling = false;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

function onMove(event) {
  if(isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY); // offsetX, offsetY는 마우스가 클릭한 canvas 내부 좌표
    ctx.stroke();
    return;
  }
  ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting() {
  isPainting = true;
}

function cancelPainting() {
  isPainting = false;
  ctx.beginPath();
}

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
  ctx.strokeStyle = ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = ctx.fillStyle = event.target.dataset.color;
  color.value = colorValue;
}

function onModeClick() {
  if(isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}

function onCanvasClick() {
  if(isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function onDestoryClick() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserClick() {
  ctx.strokeStyle = 'white';
  isFilling = false;
  modeBtn.innerText = "Fill";
}

function onFileChange(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image(); // equal : const image = document.createElement('img');
  image.src = url;
  image.onload = function() {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  }
  // image.addEventListener('load', () => {
  //   ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  //   fileInput.value = null;
  // } );
}

function onDoubleClick(event) {
  const text = textInput.value;
  if(text !== '') {
    ctx.save(); // ctx의 현재 상태를 저장
    ctx.lineWidth = 1;
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore(); // 이전에 저장해두었던 상태로 돌아감
  }
}

function onSaveClick() {
  const url = canvas.toDataURL();
  const a = document.createElement('a');
  a.href = url;
  a.download = 'myDrawing.png';
  a.click();
}

function onFontChange(event) {
  const fontSize = event.target.value;
  ctx.font = `${fontSize} serif`;
  ctx.save();
}

canvas.addEventListener('dblclick', onDoubleClick);
canvas.addEventListener('mousemove', onMove);
canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mouseup', cancelPainting);
canvas.addEventListener('mouseleave', cancelPainting);
canvas.addEventListener('click', onCanvasClick);
lineWidth.addEventListener('change', onLineWidthChange);
color.addEventListener('change', onColorChange);
colorOptions.forEach(color => color.addEventListener('click', onColorClick));
modeBtn.addEventListener('click', onModeClick);
destroyBtn.addEventListener('click', onDestoryClick);
eraserBtn.addEventListener('click', onEraserClick);
fileInput.addEventListener('change', onFileChange);
saveBtn.addEventListener('click', onSaveClick);
fontSelect.addEventListener('change',onFontChange);