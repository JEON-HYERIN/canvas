const canvas = (function() {
  let isPainting = false;
  let isFilling = false;
  
  const init = function() {
    setElements();
    bindEvents();
    canvasSetting();
  };
  
  const els = {};
  
  const setElements = function() {
    els.section = document.querySelector('.canvas-area');
    if(!!els.section) {
     els.canvas = els.section.querySelector('canvas');
     els.ctx = els.canvas.getContext('2d');
     els.saveBtn = els.section.querySelector('#save');
     els.textInput = els.section.querySelector('#text');
     els.fileInput = els.section.querySelector('#file');
     els.modeBtn = els.section.querySelector('#mode-btn');
     els.destroyBtn = els.section.querySelector('#destroy-btn');
     els.eraserBtn = els.section.querySelector('#eraser-btn');
     els.colorOptions = els.section.querySelector('.color-options');
     els.lineWidth = els.section.querySelector('#line-width');
     els.color = els.section.querySelector('#color');
     els.fontSelect = els.section.querySelector('select');
    }
  }
  
  const bindEvents = function() {
    els.canvas.addEventListener('click', handlerList.onCanvasClick);
    els.canvas.addEventListener('dblclick', handlerList.onDoubleClick);
    els.canvas.addEventListener('mousemove', handlerList.onMove);
    els.canvas.addEventListener('mousedown', handlerList.startPainting);
    els.canvas.addEventListener('mouseup', handlerList.cancelPainting);
    els.canvas.addEventListener('mouseleave', handlerList.cancelPainting);

    els.lineWidth.addEventListener('change', handlerList.onLineWidthChange);
    els.color.addEventListener('change', handlerList.onColorChange);
    els.fileInput.addEventListener('change', handlerList.onFileChange);
    els.fontSelect.addEventListener('change',handlerList.onFontChange);
    els.modeBtn.addEventListener('click', handlerList.onModeClick);
    els.destroyBtn.addEventListener('click', handlerList.onDestoryClick);
    els.eraserBtn.addEventListener('click', handlerList.onEraserClick);
    els.saveBtn.addEventListener('click', handlerList.onSaveClick);
    els.colorOptions.addEventListener('click', function(event) { // 이벤트 위임
      if(event.target.classList.contains('color-option')) {
        handlerList.onColorClick(event);
      }
    });
  };
  
  const handlerList = {
    onMove: function(event) {
      if(isPainting) {
        els.ctx.lineTo(event.offsetX, event.offsetY); // offsetX, offsetY는 마우스가 클릭한 canvas 내부 좌표
        els.ctx.stroke();
        return;
      }

      els.ctx.moveTo(event.offsetX, event.offsetY);
    },
    startPainting: function() {
      isPainting = true;
    },
    cancelPainting: function() {
      isPainting = false;
      els.ctx.beginPath();
    },
    onLineWidthChange: function(event) {
      els.ctx.lineWidth = event.target.value;
    },
    onColorChange: function(event) {
      els.ctx.strokeStyle = els.ctx.fillStyle = event.target.value;
    },
    onColorClick: function(event) {
      const colorValue = event.target.dataset.color;

      els.ctx.strokeStyle = els.ctx.fillStyle = event.target.dataset.color;
      els.color.value = colorValue;
    },
    onModeClick: function() {
      if(isFilling) {
        isFilling = false;
        els.modeBtn.innerText = "Fill";
      } else {
        isFilling = true;
        els.modeBtn.innerText = "Draw";
      }
    },
    onCanvasClick: function() {
      if(isFilling) {
        els.ctx.fillRect(0, 0, els.canvas.width, els.canvas.height);
      }
    },
    onDestoryClick: function() {
      els.ctx.fillStyle = 'white';
      els.ctx.fillRect(0, 0, els.canvas.width, els.canvas.height);
    },
    onEraserClick: function() {
      els.ctx.strokeStyle = 'white';
      isFilling = false;
      els.modeBtn.innerText = "Fill";
    },
    onFileChange: function(event) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      const image = new Image(); // equal : const image = document.createElement('img');

      image.src = url;
      image.addEventListener('load', () => {
        els.ctx.drawImage(image, 0, 0, els.canvas.width, els.canvas.height);
        els.fileInput.value = null;
      } );
    },
    onDoubleClick: function(event) {
      const text = els.textInput.value;

      if(text !== '') {
        els.ctx.save(); // ctx의 현재 상태를 저장
        els.ctx.lineWidth = 1;
        els.ctx.fillText(text, event.offsetX, event.offsetY);
        els.ctx.restore(); // 이전에 저장해두었던 상태로 돌아감
      }
    },
    onSaveClick: function() {
      const url = els.canvas.toDataURL();
      const a = document.createElement('a');

      a.href = url;
      a.download = 'myDrawing.png';
      a.click();
    },
    onFontChange: function(event) {
      const fontSize = event.target.value;

      els.ctx.font = `${fontSize} serif`;
      els.ctx.save();
    }
  };

  const canvasSetting = function() {
    els.canvas.width = 800;
    els.canvas.height = 800;
    els.ctx.lineWidth = els.lineWidth.value;
    els.ctx.font = '68px serif';
    els.ctx.lineCap = 'round'; // 선의 끝점을 그리는데 사용되는 모양
  };

  return {
    init: init
  }
})();

canvas.init();