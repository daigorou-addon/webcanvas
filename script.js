(() => {
  'use strict';

  const stage = document.getElementById('stage');
  const stageInner = document.getElementById('stageInner');
  const stageWrap = document.getElementById('stageWrap');
  const canvasDimLabel = document.getElementById('canvasDim');
  const presetSelect = document.getElementById('presetSelect');
  const customSizeBox = document.getElementById('customSize');
  const customW = document.getElementById('customW');
  const customH = document.getElementById('customH');
  const applyCustomBtn = document.getElementById('applyCustom');
  const stageEmptyHint = document.getElementById('stageEmptyHint');
  const addMenuSelect = document.getElementById('addMenu');
  const fitCanvasBtn = document.getElementById('fitCanvasBtn');
  const fileInput = document.getElementById('fileInput');
  const deleteTextBtn = document.getElementById('deleteTextBtn');
  const deleteImageBtn = document.getElementById('deleteImageBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const layersListEl = document.getElementById('layersList');

  const textOptionsEl = document.getElementById('textOptions');
  const imageOptionsEl = document.getElementById('imageOptions');
  const cropControlsEl = document.getElementById('cropControls');
  const fontSelect = document.getElementById('fontSelect');
  const textColorInput = document.getElementById('textColor');
  const textBgColorInput = document.getElementById('textBgColor');
  const clearBgColorBtn = document.getElementById('clearBgColor');
  const outlineChip = document.getElementById('outlineChip');
  const outlineOptionsEl = document.getElementById('outlineOptions');
  const outlineColorInput = document.getElementById('outlineColor');
  const outlineWidthInput = document.getElementById('outlineWidth');
  const shadowChip = document.getElementById('shadowChip');
  const italicChip = document.getElementById('italicChip');
  const arcRange = document.getElementById('arcRange');
  const cropBtn = document.getElementById('cropBtn');
  const cropApplyBtn = document.getElementById('cropApply');
  const cropCancelBtn = document.getElementById('cropCancel');
  const tableOptionsEl = document.getElementById('tableOptions');
  const deleteTableBtn = document.getElementById('deleteTableBtn');
  const lineOptionsEl = document.getElementById('lineOptions');
  const deleteLineBtn = document.getElementById('deleteLineBtn');
  const lineColorInput = document.getElementById('lineColor');
  const lineWidthInput = document.getElementById('lineWidth');
  const shapeOptionsEl = document.getElementById('shapeOptions');
  const deleteShapeBtn = document.getElementById('deleteShapeBtn');
  const shapeTypeSelect = document.getElementById('shapeTypeSelect');
  const shapeFillColorInput = document.getElementById('shapeFillColor');
  const clearShapeFillBtn = document.getElementById('clearShapeFill');
  const shapeFillWrapEl = document.getElementById('shapeFillWrap');
  const shapeStrokeColorInput = document.getElementById('shapeStrokeColor');
  const shapeStrokeWidthInput = document.getElementById('shapeStrokeWidth');
  const shapeImageInput = document.getElementById('shapeImageInput');
  const shapeAddImageBtn = document.getElementById('shapeAddImageBtn');
  const shapeClearImageBtn = document.getElementById('shapeClearImageBtn');
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');
  const penChip = document.getElementById('penChip');
  const eraserChip = document.getElementById('eraserChip');
  const drawOptionsEl = document.getElementById('drawOptions');
  const penColorInput = document.getElementById('penColor');
  const penSizeInput = document.getElementById('penSize');
  const clearDrawingBtn = document.getElementById('clearDrawing');
  const bgColorWrapEl = document.getElementById('bgColorWrap');
  const arcChip = document.getElementById('arcChip');
  const arcOptionsEl = document.getElementById('arcOptions');

  // ---- サイズプリセット（表示ラベルはi18nキー経由で翻訳） ----
  const PRESETS = [
    { group: 'YouTube', key: 'opt_yt_thumbnail', w: 1280, h: 720 },
    { group: 'YouTube', key: 'opt_yt_banner', w: 2560, h: 1440 },
    { group: 'YouTube', key: 'opt_yt_icon', w: 800, h: 800 },
    { group: 'Instagram', key: 'opt_ig_square', w: 1080, h: 1080 },
    { group: 'Instagram', key: 'opt_ig_portrait', w: 1080, h: 1350 },
    { group: 'Instagram', key: 'opt_ig_story', w: 1080, h: 1920 },
    { group: 'Instagram', key: 'opt_ig_icon', w: 320, h: 320 },
    { group: 'TikTok', key: 'opt_tt_video', w: 1080, h: 1920 },
    { group: 'TikTok', key: 'opt_tt_icon', w: 200, h: 200 },
    { group: 'Twitch', key: 'opt_tw_offline', w: 1920, h: 1080 },
    { group: 'Twitch', key: 'opt_tw_banner', w: 1200, h: 480 },
    { group: 'Twitch', key: 'opt_tw_panel', w: 320, h: 160 },
    { group: 'X', key: 'opt_x_post', w: 1600, h: 900 },
    { group: 'X', key: 'opt_x_header', w: 1500, h: 500 },
    { group: 'X', key: 'opt_x_icon', w: 400, h: 400 },
    { group: 'Facebook', key: 'opt_fb_post', w: 1200, h: 630 },
    { group: 'Facebook', key: 'opt_fb_cover', w: 820, h: 312 },
    { group: 'Facebook', key: 'opt_fb_icon', w: 180, h: 180 },
    { group: '__general__', key: 'opt_gen_icon', w: 512, h: 512 },
  ];

  function renderPresetOptions(){
    const prevValue = presetSelect.value;
    presetSelect.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = t('select_size_placeholder');
    presetSelect.appendChild(placeholder);
    const customOpt = document.createElement('option');
    customOpt.value = 'custom';
    customOpt.textContent = t('opt_custom');
    presetSelect.appendChild(customOpt);

    const groups = {};
    PRESETS.forEach(p => {
      const groupLabel = p.group === '__general__' ? t('group_general') : p.group;
      if(!groups[groupLabel]) groups[groupLabel] = document.createElement('optgroup');
      groups[groupLabel].label = groupLabel;
      const opt = document.createElement('option');
      opt.value = `${p.w}x${p.h}`;
      opt.textContent = `${t(p.key)}（${p.w}×${p.h}）`;
      groups[groupLabel].appendChild(opt);
    });
    Object.values(groups).forEach(g => presetSelect.appendChild(g));
    presetSelect.value = prevValue && [...presetSelect.options].some(o => o.value === prevValue) ? prevValue : '';
  }
  window.onWebCanvasLangChange = () => { renderPresetOptions(); renderLayerList(); };
  renderPresetOptions();

  // ---- キャンバスの状態 ----
  let canvasW = 1280, canvasH = 720;
  let scale = 1;
  const items = []; // { id, type, x, y, w, h, rotation, el, ... }
  let nextId = 1;
  let selectedId = null;

  function setCanvasSize(w, h){
    canvasW = w; canvasH = h;
    canvasDimLabel.textContent = `${w} × ${h} px`;
    layoutStage();
    if(typeof resizeDrawLayer === 'function') resizeDrawLayer();
  }

  function layoutStage(){
    const wrapRect = stageWrap.getBoundingClientRect();
    const availW = wrapRect.width - 48;
    const availH = wrapRect.height - 48;
    scale = Math.min(availW / canvasW, availH / canvasH, 3);
    stage.style.width = (canvasW * scale) + 'px';
    stage.style.height = (canvasH * scale) + 'px';
    stageInner.style.width = canvasW + 'px';
    stageInner.style.height = canvasH + 'px';
    stageInner.style.transform = `scale(${scale})`;
    updateAllHandleSizes();
  }
  window.addEventListener('resize', layoutStage);

  presetSelect.addEventListener('change', () => {
    const v = presetSelect.value;
    if(v === 'custom'){
      customSizeBox.classList.add('show');
      customW.value = canvasW;
      customH.value = canvasH;
      return;
    }
    customSizeBox.classList.remove('show');
    if(!v) return;
    const [w, h] = v.split('x').map(Number);
    setCanvasSize(w, h);
    pushHistory();
  });
  applyCustomBtn.addEventListener('click', () => {
    const w = Math.max(1, Math.min(8000, parseInt(customW.value, 10) || canvasW));
    const h = Math.max(1, Math.min(8000, parseInt(customH.value, 10) || canvasH));
    setCanvasSize(w, h);
    pushHistory();
  });

  // ---- ハンドル（リサイズ4隅＋回転） ----
  // タッチ操作(スマホ・タブレット)ではポインタが「粗い」判定になるため、
  // それに合わせてハンドルなどの当たり判定を大きくする
  const IS_COARSE_POINTER = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const HANDLE_PX = IS_COARSE_POINTER ? 24 : 10;
  const ROTATE_STALK_PX = IS_COARSE_POINTER ? 34 : 26;

  function buildHandles(includeEdges){
    const wrap = document.createElement('div');
    wrap.className = 'handles';
    const positions = includeEdges ? ['nw','ne','sw','se','n','s','e','w'] : ['nw','ne','sw','se'];
    positions.forEach(pos => {
      const h = document.createElement('div');
      h.className = `handle handle-${pos}`;
      h.dataset.handle = pos;
      wrap.appendChild(h);
    });
    const stalk = document.createElement('div');
    stalk.className = 'handle-rotate-stalk';
    wrap.appendChild(stalk);
    const rot = document.createElement('div');
    rot.className = 'handle handle-rotate';
    rot.dataset.handle = 'rotate';
    wrap.appendChild(rot);
    return wrap;
  }
  // 各ハンドルの符号（どちら向きの辺/角か）。自由変形時の対角(または対辺)固定に使う
  const HANDLE_SIGN = {
    nw:[-1,-1], ne:[1,-1], sw:[-1,1], se:[1,1],
    n:[0,-1], s:[0,1], e:[1,0], w:[-1,0]
  };

  function updateAllHandleSizes(){
    const real = Math.max(4, HANDLE_PX/scale);
    const stalkLen = Math.max(8, ROTATE_STALK_PX/scale);
    document.querySelectorAll('.handle').forEach(h => {
      h.style.width = real+'px';
      h.style.height = real+'px';
      h.style.marginLeft = (-real/2)+'px';
      h.style.marginTop = (-real/2)+'px';
    });
    document.querySelectorAll('.handle-rotate').forEach(h => { h.style.top = (-stalkLen)+'px'; });
    document.querySelectorAll('.handle-rotate-stalk').forEach(s => {
      s.style.width = Math.max(1, 2/scale)+'px';
      s.style.height = stalkLen+'px';
      s.style.top = (-stalkLen)+'px';
    });
    document.querySelectorAll('.crop-handle').forEach(h => {
      const real2 = Math.max(6, 12/scale);
      h.style.width = real2+'px';
      h.style.height = real2+'px';
      h.style.marginLeft = (-real2/2)+'px';
      h.style.marginTop = (-real2/2)+'px';
    });
  }

  function stagePointFromEvent(e){
    const rect = stageInner.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale };
  }

  // ---- スナップ(吸着) ----
  const SNAP_THRESHOLD_PX = 8; // 画面上での吸着範囲(px相当)
  const guideV = document.createElement('div');
  guideV.className = 'snap-guide snap-guide-v';
  const guideH = document.createElement('div');
  guideH.className = 'snap-guide snap-guide-h';
  stageInner.appendChild(guideV);
  stageInner.appendChild(guideH);

  // ---- 手描きレイヤー（ペン・消しゴム） ----
  const drawLayer = document.createElement('canvas');
  drawLayer.id = 'drawLayer';
  stageInner.appendChild(drawLayer);
  const drawCtx = drawLayer.getContext('2d');
  let drawMode = null; // null | 'pen' | 'eraser'
  let isDrawing = false;
  let lastDrawPt = null;
  let drawLayerVisible = true;
  let hasDrawing = false; // 実際に何か描かれているか（空のレイヤーをリストに出さないため）
  function setDrawLayerVisible(visible){
    drawLayerVisible = visible;
    drawLayer.style.visibility = visible ? 'visible' : 'hidden';
  }
  function clearDrawing(){
    drawCtx.clearRect(0, 0, drawLayer.width, drawLayer.height);
    hasDrawing = false;
    pushHistory();
    renderLayerList();
  }
  // 大きいキャンバスが空のとき（画像も手描きもまだ無いとき）だけ、
  // 「画像をドラッグ＆ドロップ／クリックしてファイルを選択」のヒントを表示する
  function updateStageEmptyHint(){
    const show = items.length === 0 && !hasDrawing && drawMode === null;
    stageEmptyHint.style.display = show ? 'flex' : 'none';
  }

  function resizeDrawLayer(){
    // サイズ変更時、既存の描画内容をできる範囲で保持する
    const prevDataUrl = (drawLayer.width>0 && drawLayer.height>0) ? drawLayer.toDataURL() : null;
    drawLayer.width = canvasW;
    drawLayer.height = canvasH;
    if(prevDataUrl){
      const img = new Image();
      img.onload = () => drawCtx.drawImage(img, 0, 0);
      img.src = prevDataUrl;
    }
  }

  function setDrawMode(mode){
    drawMode = (drawMode === mode) ? null : mode;
    penChip.classList.toggle('on', drawMode === 'pen');
    eraserChip.classList.toggle('on', drawMode === 'eraser');
    drawLayer.classList.toggle('draw-active', drawMode !== null);
    drawOptionsEl.style.display = drawMode !== null ? 'flex' : 'none';
    updateStageEmptyHint();
  }
  // 手描きモードを強制的にOFFにする。手描きモードが有効なままだと、手描きレイヤーが
  // キャンバス全面のポインター操作を奪ってしまい、他の要素をつかめなくなるため、
  // 新しい要素を追加したり別のツールに切り替えたりしたタイミングで必ず呼び出す。
  function deactivateDrawMode(){
    if(drawMode === null) return;
    drawMode = null;
    penChip.classList.remove('on');
    eraserChip.classList.remove('on');
    drawLayer.classList.remove('draw-active');
    drawOptionsEl.style.display = 'none';
    if(addMenuSelect.value === 'draw') addMenuSelect.value = ''; // 手描きOFFになったら選択表示も戻す
    updateStageEmptyHint();
  }
  penChip.addEventListener('click', () => setDrawMode('pen'));
  eraserChip.addEventListener('click', () => setDrawMode('eraser'));

  function drawLayerPoint(e){
    const rect = drawLayer.getBoundingClientRect();
    return { x: (e.clientX-rect.left)/scale, y: (e.clientY-rect.top)/scale };
  }
  drawLayer.addEventListener('pointerdown', e => {
    if(!drawMode) return;
    e.preventDefault();
    isDrawing = true;
    hasDrawing = true;
    drawLayer.setPointerCapture(e.pointerId);
    lastDrawPt = drawLayerPoint(e);
    drawCtx.globalCompositeOperation = drawMode === 'eraser' ? 'destination-out' : 'source-over';
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
    drawCtx.strokeStyle = penColorInput.value;
    drawCtx.lineWidth = parseInt(penSizeInput.value, 10) || 6;
    // 点を打っただけでも見えるように、開始点に小さい線を描く
    drawCtx.beginPath();
    drawCtx.moveTo(lastDrawPt.x, lastDrawPt.y);
    drawCtx.lineTo(lastDrawPt.x+0.01, lastDrawPt.y+0.01);
    drawCtx.stroke();
  });
  drawLayer.addEventListener('pointermove', e => {
    if(!isDrawing) return;
    const pt = drawLayerPoint(e);
    drawCtx.beginPath();
    drawCtx.moveTo(lastDrawPt.x, lastDrawPt.y);
    drawCtx.lineTo(pt.x, pt.y);
    drawCtx.stroke();
    lastDrawPt = pt;
  });
  function endDrawing(){
    if(!isDrawing) return;
    isDrawing = false;
    lastDrawPt = null;
    pushHistory();
    renderLayerList();
  }
  drawLayer.addEventListener('pointerup', endDrawing);
  drawLayer.addEventListener('pointerleave', endDrawing);
  clearDrawingBtn.addEventListener('click', clearDrawing);


  function showSnapGuides(x, y){
    const lineW = Math.max(1, 1/scale);
    if(x != null){
      guideV.style.left = x + 'px';
      guideV.style.width = lineW + 'px';
      guideV.style.display = 'block';
    } else {
      guideV.style.display = 'none';
    }
    if(y != null){
      guideH.style.top = y + 'px';
      guideH.style.height = lineW + 'px';
      guideH.style.display = 'block';
    } else {
      guideH.style.display = 'none';
    }
  }
  function hideSnapGuides(){
    guideV.style.display = 'none';
    guideH.style.display = 'none';
  }

  function getSnapTargets(excludeId){
    const targetsX = [0, canvasW/2, canvasW];
    const targetsY = [0, canvasH/2, canvasH];
    items.forEach(it => {
      if(it.id === excludeId) return;
      targetsX.push(it.x, it.x+it.w/2, it.x+it.w);
      targetsY.push(it.y, it.y+it.h/2, it.y+it.h);
    });
    return { targetsX, targetsY };
  }
  // 値をスナップ候補群に対して吸着させる。吸着したらその値を、しなければnullを返す
  function snapValue(value, targets, threshold){
    let best = null, bestDist = threshold;
    targets.forEach(target => {
      const d = Math.abs(value-target);
      if(d < bestDist){ bestDist = d; best = target; }
    });
    return best;
  }

  // ドラッグ移動中の位置に吸着補正をかけ、item.x/item.yを直接更新する
  function applyDragSnap(item){
    const threshold = SNAP_THRESHOLD_PX/scale;
    const left = item.x, centerX = item.x+item.w/2, right = item.x+item.w;
    const top = item.y, centerY = item.y+item.h/2, bottom = item.y+item.h;
    const { targetsX, targetsY } = getSnapTargets(item.id);

    let bestDX = null, bestDist = threshold, lineX = null;
    [left, centerX, right].forEach(val => {
      targetsX.forEach(target => {
        const d = Math.abs(val-target);
        if(d < bestDist){ bestDist = d; bestDX = target-val; lineX = target; }
      });
    });
    let bestDY = null, bestDistY = threshold, lineY = null;
    [top, centerY, bottom].forEach(val => {
      targetsY.forEach(target => {
        const d = Math.abs(val-target);
        if(d < bestDistY){ bestDistY = d; bestDY = target-val; lineY = target; }
      });
    });

    if(bestDX != null) item.x += bestDX;
    if(bestDY != null) item.y += bestDY;
    showSnapGuides(lineX, lineY);
  }

  // ---- 選択・レイヤー順・レイヤーパネル ----
  function getItem(id){ return items.find(it => it.id === id); }

  function selectItem(id){
    if(id != null) deactivateDrawMode(); // 要素を選んだら手描きモードは自動的に解除する
    selectedId = id;
    items.forEach(it => it.el.classList.toggle('selected', it.id === id));
    reflectOrder(); // まず全要素を配列順どおりのz-indexに戻す
    const sel = getItem(id);
    // 選択中の要素のハンドルが他の要素の下に隠れないよう、一時的に最前面のz-indexにする
    // （実際の重なり順=items配列の並びは変えない。見た目の並びはreflectOrder()側で管理）
    if(sel) sel.el.style.zIndex = String(items.length + 1);

    const showText = !!(sel && sel.type === 'text' && !sel.cropping);
    const showImageOpts = !!(sel && sel.type === 'image' && !sel.cropping);
    const showTable = !!(sel && sel.type === 'table');
    const showLine = !!(sel && sel.type === 'line');
    const showShape = !!(sel && sel.type === 'shape');
    const showCrop = !!(sel && sel.cropping);
    textOptionsEl.style.display = showText ? 'flex' : 'none';
    imageOptionsEl.style.display = showImageOpts ? 'flex' : 'none';
    tableOptionsEl.style.display = showTable ? 'flex' : 'none';
    lineOptionsEl.style.display = showLine ? 'flex' : 'none';
    shapeOptionsEl.style.display = showShape ? 'flex' : 'none';
    cropControlsEl.style.display = showCrop ? 'flex' : 'none';

    if(showLine){
      lineColorInput.value = sel.color;
      lineWidthInput.value = sel.strokeWidth;
    }
    if(showShape){
      shapeTypeSelect.value = sel.shapeType;
      shapeFillColorInput.value = sel.fillColor || '#29e0c4';
      clearShapeFillBtn.classList.toggle('on', !sel.fillColor);
      shapeFillWrapEl.classList.toggle('none-active', !sel.fillColor);
      shapeStrokeColorInput.value = sel.strokeColor;
      shapeStrokeWidthInput.value = sel.strokeWidth;
      shapeClearImageBtn.style.display = sel.fillImage ? '' : 'none';
    }

    if(showText){
      fontSelect.value = sel.fontFamily;
      textColorInput.value = sel.color;
      textBgColorInput.value = sel.bgColor || '#000000';
      clearBgColorBtn.classList.toggle('on', !sel.bgColor);
      bgColorWrapEl.classList.toggle('none-active', !sel.bgColor);
      outlineChip.classList.toggle('on', sel.outline);
      outlineOptionsEl.style.display = sel.outline ? 'flex' : 'none';
      outlineColorInput.value = sel.outlineColor;
      outlineWidthInput.value = sel.outlineWidth;
      shadowChip.classList.toggle('on', sel.shadow);
      italicChip.classList.toggle('on', sel.italic);
      arcChip.classList.toggle('on', sel.arcEnabled);
      arcOptionsEl.style.display = sel.arcEnabled ? 'flex' : 'none';
      arcRange.value = sel.arc;
    }
    renderLayerList();
  }

  function reflectOrder(){
    // DOM順だけに頼らず、確実に重なり順どおりに見えるよう明示的にz-indexも振る
    items.forEach((it, idx) => {
      stageInner.appendChild(it.el);
      it.el.style.zIndex = String(idx + 1);
    });
  }

  function moveLayerRelative(id, direction){
    const idx = items.findIndex(it => it.id === id);
    if(idx < 0) return;
    const swapIdx = idx + direction;
    if(swapIdx < 0 || swapIdx >= items.length) return;
    const tmp = items[idx]; items[idx] = items[swapIdx]; items[swapIdx] = tmp;
    reflectOrder();
    renderLayerList();
    pushHistory();
  }
  function bringToAbsoluteFront(id){
    const idx = items.findIndex(it => it.id === id);
    if(idx < 0) return;
    const [it] = items.splice(idx, 1);
    items.push(it);
    reflectOrder();
    renderLayerList();
    pushHistory();
  }
  function sendToAbsoluteBack(id){
    const idx = items.findIndex(it => it.id === id);
    if(idx < 0) return;
    const [it] = items.splice(idx, 1);
    items.unshift(it);
    reflectOrder();
    renderLayerList();
    pushHistory();
  }
  function deleteItem(id){
    const idx = items.findIndex(it => it.id === id);
    if(idx === -1) return;
    items[idx].el.remove();
    items.splice(idx, 1);
    selectItem(null);
    pushHistory();
  }
  deleteTextBtn.addEventListener('click', () => { if(selectedId != null) deleteItem(selectedId); });
  deleteImageBtn.addEventListener('click', () => { if(selectedId != null) deleteItem(selectedId); });
  deleteTableBtn.addEventListener('click', () => { if(selectedId != null) deleteItem(selectedId); });
  deleteLineBtn.addEventListener('click', () => { if(selectedId != null) deleteItem(selectedId); });
  deleteShapeBtn.addEventListener('click', () => { if(selectedId != null) deleteItem(selectedId); });

  // ---- 線オプションパネルの配線 ----
  lineColorInput.addEventListener('input', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'line') return;
    item.color = lineColorInput.value;
    renderLineSVG(item);
  });
  lineColorInput.addEventListener('change', () => pushHistory());
  lineWidthInput.addEventListener('input', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'line') return;
    item.strokeWidth = parseInt(lineWidthInput.value, 10) || 1;
    renderLineSVG(item);
  });
  lineWidthInput.addEventListener('change', () => pushHistory());

  // ---- 図形オプションパネルの配線 ----
  shapeTypeSelect.addEventListener('change', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'shape') return;
    item.shapeType = shapeTypeSelect.value;
    renderShapeSVG(item);
    pushHistory();
  });
  shapeFillColorInput.addEventListener('input', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'shape') return;
    item.fillColor = shapeFillColorInput.value;
    clearShapeFillBtn.classList.remove('on');
    shapeFillWrapEl.classList.remove('none-active');
    renderShapeSVG(item);
  });
  shapeFillColorInput.addEventListener('change', () => pushHistory());
  clearShapeFillBtn.addEventListener('click', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'shape') return;
    item.fillColor = null;
    clearShapeFillBtn.classList.add('on');
    shapeFillWrapEl.classList.add('none-active');
    renderShapeSVG(item);
    pushHistory();
  });
  shapeStrokeColorInput.addEventListener('input', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'shape') return;
    item.strokeColor = shapeStrokeColorInput.value;
    renderShapeSVG(item);
  });
  shapeStrokeColorInput.addEventListener('change', () => pushHistory());
  shapeStrokeWidthInput.addEventListener('input', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'shape') return;
    item.strokeWidth = parseInt(shapeStrokeWidthInput.value, 10) || 0;
    renderShapeSVG(item);
  });
  shapeStrokeWidthInput.addEventListener('change', () => pushHistory());
  shapeAddImageBtn.addEventListener('click', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'shape') return;
    shapeImageInput.value = '';
    shapeImageInput.onchange = () => {
      if(shapeImageInput.files[0]) setShapeFillImage(item, shapeImageInput.files[0]);
    };
    shapeImageInput.click();
  });
  shapeClearImageBtn.addEventListener('click', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'shape') return;
    clearShapeFillImage(item);
    shapeClearImageBtn.style.display = 'none';
  });

  // ---- 右クリックのレイヤーメニュー ----
  let activeContextMenu = null;
  function closeContextMenu(){
    if(activeContextMenu){ activeContextMenu.remove(); activeContextMenu = null; }
  }
  function showContextMenu(item, x, y, cellPos){
    closeContextMenu();
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    const options = [];
    if(item.type === 'table' && cellPos){
      options.push({ label: t('ctx_table_add_col'), action: () => addTableColumn(item, cellPos.col) });
      options.push({ label: t('ctx_table_remove_col'), action: () => removeTableColumn(item, cellPos.col) });
      options.push({ label: t('ctx_table_shift_col_left'), action: () => shiftTableColumn(item, cellPos.col, -1) });
      options.push({ label: t('ctx_table_shift_col_right'), action: () => shiftTableColumn(item, cellPos.col, 1) });
      options.push({ sep: true });
      options.push({ label: t('ctx_table_add_row'), action: () => addTableRow(item, cellPos.row) });
      options.push({ label: t('ctx_table_remove_row'), action: () => removeTableRow(item, cellPos.row) });
      options.push({ label: t('ctx_table_shift_row_up'), action: () => shiftTableRow(item, cellPos.row, -1) });
      options.push({ label: t('ctx_table_shift_row_down'), action: () => shiftTableRow(item, cellPos.row, 1) });
      options.push({ sep: true });
      // スマホ・タブレットではアプリ間ドラッグ＆ドロップが不安定なので、
      // タップだけでこのセルに画像を入れられるようにしておく
      options.push({ label: t('ctx_table_cell_add_image'), action: () => {
        shapeImageInput.value = '';
        shapeImageInput.onchange = () => {
          if(shapeImageInput.files[0]) setTableCellImage(item, cellPos.row, cellPos.col, shapeImageInput.files[0]);
        };
        shapeImageInput.click();
      }});
      if(item.cellImages[cellPos.row][cellPos.col]){
        options.push({ label: t('ctx_table_cell_clear_image'), action: () => clearTableCellImage(item, cellPos.row, cellPos.col) });
      }
      options.push({ sep: true });
    }
    options.push({ label: t('ctx_bring_front'), action: () => bringToAbsoluteFront(item.id) });
    options.push({ label: t('ctx_forward'), action: () => moveLayerRelative(item.id, 1) });
    options.push({ label: t('ctx_backward'), action: () => moveLayerRelative(item.id, -1) });
    options.push({ label: t('ctx_send_back'), action: () => sendToAbsoluteBack(item.id) });
    options.forEach(opt => {
      if(opt.sep){
        const sep = document.createElement('div');
        sep.className = 'context-menu-sep';
        menu.appendChild(sep);
        return;
      }
      const row = document.createElement('div');
      row.className = 'context-menu-item';
      row.textContent = opt.label;
      row.addEventListener('click', () => { opt.action(); closeContextMenu(); });
      menu.appendChild(row);
    });
    const sep = document.createElement('div');
    sep.className = 'context-menu-sep';
    menu.appendChild(sep);
    const delRow = document.createElement('div');
    delRow.className = 'context-menu-item danger';
    delRow.textContent = t('ctx_delete');
    delRow.addEventListener('click', () => { deleteItem(item.id); closeContextMenu(); });
    menu.appendChild(delRow);

    document.body.appendChild(menu);
    // 画面外にはみ出さないよう位置を調整
    const rect = menu.getBoundingClientRect();
    const left = Math.min(x, window.innerWidth - rect.width - 8);
    const top = Math.min(y, window.innerHeight - rect.height - 8);
    menu.style.left = Math.max(4, left) + 'px';
    menu.style.top = Math.max(4, top) + 'px';
    activeContextMenu = menu;
    setTimeout(() => document.addEventListener('click', closeContextMenu, { once:true }), 0);
  }

  stageWrap.addEventListener('pointerdown', e => {
    if(e.target === stageWrap || e.target === stage || e.target === stageInner){
      selectItem(null);
    }
  });

  function renderLayerList(){
    layersListEl.innerHTML = '';
    updateStageEmptyHint();

    // 手描きレイヤーは、実際に何か描かれているときだけリストの先頭に固定表示する
    if(hasDrawing){
      const drawRow = document.createElement('div');
      drawRow.className = 'layer-row layer-row-draw' + (drawMode !== null ? ' selected' : '') + (drawLayerVisible ? '' : ' dimmed');
      const drawLabel = document.createElement('span');
      drawLabel.className = 'layer-row-label';
      drawLabel.textContent = `✎ ${t('layer_draw_label')}`;
      drawRow.appendChild(drawLabel);
      const drawActions = document.createElement('div');
      drawActions.className = 'layer-row-actions';
      const toggleBtn = document.createElement('span');
      toggleBtn.className = 'layer-row-icon-btn';
      toggleBtn.title = t('layer_draw_toggle_title');
      toggleBtn.textContent = drawLayerVisible ? '👁' : '—';
      toggleBtn.addEventListener('click', e => {
        e.stopPropagation();
        setDrawLayerVisible(!drawLayerVisible);
        renderLayerList();
      });
      const clearBtn = document.createElement('span');
      clearBtn.className = 'layer-row-icon-btn';
      clearBtn.title = t('layer_draw_clear_title');
      clearBtn.textContent = '🗑';
      clearBtn.addEventListener('click', e => {
        e.stopPropagation();
        clearDrawing();
      });
      drawActions.appendChild(toggleBtn);
      drawActions.appendChild(clearBtn);
      drawRow.appendChild(drawActions);
      drawRow.addEventListener('click', () => setDrawMode('pen'));
      layersListEl.appendChild(drawRow);
    }

    for(let i = items.length-1; i >= 0; i--){
      const it = items[i];
      const row = document.createElement('div');
      row.className = 'layer-row' + (it.id === selectedId ? ' selected' : '');

      if(it.type === 'image'){
        const thumb = document.createElement('img');
        thumb.className = 'layer-thumb';
        thumb.src = it.img.src;
        row.appendChild(thumb);
      }
      const label = document.createElement('span');
      label.className = 'layer-row-label';
      if(it.type === 'image'){
        label.textContent = `${t('layer_image_label')} ${i+1}`;
      } else if(it.type === 'table'){
        label.textContent = `${t('add_menu_table')} ${it.rows}×${it.cols}`;
      } else if(it.type === 'line'){
        label.textContent = t('add_menu_line');
      } else if(it.type === 'shape'){
        label.textContent = `${t('add_menu_shape')}（${shapeLabel(it.shapeType)}）`;
      } else {
        const preview = (it.text || '').replace(/\n/g,' ').slice(0, 12) || t('layer_empty_text');
        label.textContent = `${t('layer_text_label')}: ${preview}`;
      }
      row.appendChild(label);

      row.draggable = true;
      row.dataset.id = it.id;
      row.addEventListener('click', () => selectItem(it.id));
      row.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', String(it.id));
        e.dataTransfer.effectAllowed = 'move';
        row.classList.add('dragging-row');
      });
      row.addEventListener('dragend', () => row.classList.remove('dragging-row'));
      row.addEventListener('dragover', e => {
        e.preventDefault();
        row.classList.add('drop-target');
      });
      row.addEventListener('dragleave', () => row.classList.remove('drop-target'));
      row.addEventListener('drop', e => {
        e.preventDefault();
        row.classList.remove('drop-target');
        const draggedId = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if(!draggedId || draggedId === it.id) return;
        reorderItemsByDrop(draggedId, it.id);
      });
      layersListEl.appendChild(row);
    }
  }

  // レイヤーパネルでドラッグしたレイヤーを、ドロップ先のレイヤーの位置へ移動する
  function reorderItemsByDrop(draggedId, targetId){
    const fromIdx = items.findIndex(it => it.id === draggedId);
    if(fromIdx < 0) return;
    const [moved] = items.splice(fromIdx, 1);
    // 移動後の配列で改めて目的地を探す（前後どちらにドラッグしても位置がずれないように）
    const toIdx = items.findIndex(it => it.id === targetId);
    if(toIdx < 0){ items.splice(fromIdx, 0, moved); return; }
    items.splice(toIdx, 0, moved);
    reflectOrder();
    renderLayerList();
    pushHistory();
  }

  // ---- 画像に合わせてキャンバスサイズを作る ----
  fitCanvasBtn.addEventListener('click', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'image') return;
    const newW = item.img.naturalWidth, newH = item.img.naturalHeight;
    setCanvasSize(newW, newH);
    item.x = 0; item.y = 0; item.w = newW; item.h = newH; item.rotation = 0;
    item.el.style.left = '0px'; item.el.style.top = '0px';
    item.el.style.width = newW + 'px'; item.el.style.height = newH + 'px';
    item.el.style.transform = 'rotate(0deg)';
    presetSelect.value = '';
    customSizeBox.classList.remove('show');
    layoutStage();
    pushHistory();
  });

  // ---- 長押しで右クリックメニュー相当を開く（スマホ・タブレット用） ----
  // マウスなら右クリックが使えるので、タッチ/ペンの時だけ長押しを拾う。
  // 長押しが成立したら、進行中かもしれない「掴んで移動」操作を安全に打ち切ってからメニューを開く。
  function bindLongPress(el, onLongPress){
    const THRESHOLD = 10, DURATION = 550;
    let timer = null, startX = 0, startY = 0, pointerId = null;
    function cancel(){ if(timer){ clearTimeout(timer); timer = null; } }
    el.addEventListener('pointerdown', e => {
      if(e.pointerType !== 'touch' && e.pointerType !== 'pen') return;
      startX = e.clientX; startY = e.clientY; pointerId = e.pointerId;
      cancel();
      timer = setTimeout(() => {
        timer = null;
        // 掴んで移動中のドラッグ処理へ「指が離れた」ことを伝えて、そちらを綺麗に終わらせる
        el.dispatchEvent(new PointerEvent('pointerup', { pointerId, bubbles:true, cancelable:true }));
        onLongPress(e);
      }, DURATION);
    });
    el.addEventListener('pointermove', e => {
      if(e.pointerId !== pointerId) return;
      if(Math.abs(e.clientX-startX) > THRESHOLD || Math.abs(e.clientY-startY) > THRESHOLD) cancel();
    });
    el.addEventListener('pointerup', cancel);
    el.addEventListener('pointercancel', cancel);
  }

  // ---- ドラッグ移動・リサイズ・回転・テキスト編集の配線 ----
  function bindItemInteractions(item){
    item.el.addEventListener('contextmenu', e => {
      if(item.cropping) return;
      e.preventDefault();
      selectItem(item.id);
      showContextMenu(item, e.clientX, e.clientY);
    });
    bindLongPress(item.el, e => {
      if(item.cropping) return;
      selectItem(item.id);
      showContextMenu(item, e.clientX, e.clientY);
    });
    item.el.addEventListener('pointerdown', e => {
      if(item.cropping) return; // クロップ中は要素自体のドラッグを無効化
      if(e.target.classList.contains('handle')) return;
      if(item.type === 'text' && item.editing) return; // 編集中はテキスト内クリックを邪魔しない
      if(item.type === 'table' && item.tableEditing) return; // セル編集中も同様
      if(item.type === 'shape' && item.shapeTextEditing) return; // 図形内文字の編集中も同様
      e.preventDefault();
      selectItem(item.id);
      item.el.classList.add('dragging');
      const startClientX = e.clientX, startClientY = e.clientY;
      const startX = item.x, startY = item.y;
      item.el.setPointerCapture(e.pointerId);

      function onMove(ev){
        const dx = (ev.clientX - startClientX) / scale;
        const dy = (ev.clientY - startClientY) / scale;
        item.x = Math.round(startX + dx);
        item.y = Math.round(startY + dy);
        applyDragSnap(item);
        item.el.style.left = item.x + 'px';
        item.el.style.top = item.y + 'px';
      }
      function onUp(){
        item.el.classList.remove('dragging');
        hideSnapGuides();
        item.el.removeEventListener('pointermove', onMove);
        item.el.removeEventListener('pointerup', onUp);
        pushHistory();
      }
      item.el.addEventListener('pointermove', onMove);
      item.el.addEventListener('pointerup', onUp);
    });

    // リサイズハンドル
    // ・画像: 中心を固定して縦横比を保ったまま拡大縮小（歪み防止）
    // ・テキスト: 対角(または対辺)を固定した自由変形。辺ハンドルで幅/高さを個別に伸縮できる
    item.el.querySelectorAll('.handle[data-handle]').forEach(handleEl => {
      const pos = handleEl.dataset.handle;
      if(pos === 'rotate') return;
      handleEl.addEventListener('pointerdown', e => {
        if(item.cropping) return;
        e.preventDefault();
        e.stopPropagation();
        selectItem(item.id);
        handleEl.setPointerCapture(e.pointerId);

        const startW = item.w, startH = item.h;
        const rotRad = item.rotation * Math.PI/180;
        const startClientX = e.clientX, startClientY = e.clientY;

        if(item.type === 'text' || item.type === 'table' || item.type === 'line' || item.type === 'shape'){
          // ---- 自由変形（対角/対辺固定）。テキスト・表・線・図形は縦横比を無視して自由に伸縮できる ----
          const [sx, sy] = HANDLE_SIGN[pos];
          const centerX0 = item.x + startW/2, centerY0 = item.y + startH/2;
          const fixedLocal0 = { x: -sx*startW/2, y: -sy*startH/2 };
          const fixedWorld = {
            x: centerX0 + (fixedLocal0.x*Math.cos(rotRad) - fixedLocal0.y*Math.sin(rotRad)),
            y: centerY0 + (fixedLocal0.x*Math.sin(rotRad) + fixedLocal0.y*Math.cos(rotRad))
          };
          const startFontSize = item.fontSize;
          const MIN_SIZE = 16;

          function onMove(ev){
            const dx = (ev.clientX - startClientX) / scale;
            const dy = (ev.clientY - startClientY) / scale;
            const localDx = dx*Math.cos(rotRad) + dy*Math.sin(rotRad);
            const localDy = -dx*Math.sin(rotRad) + dy*Math.cos(rotRad);
            let newW = Math.max(MIN_SIZE, startW + sx*localDx);
            let newH = Math.max(MIN_SIZE, startH + sy*localDy);

            let lineX = null, lineY = null;
            if(Math.abs(item.rotation) < 0.5){
              const { targetsX, targetsY } = getSnapTargets(item.id);
              const threshold = SNAP_THRESHOLD_PX/scale;
              if(sx !== 0){
                const snapped = snapValue(fixedWorld.x + sx*newW, targetsX, threshold);
                if(snapped != null){ newW = Math.max(MIN_SIZE, Math.abs(snapped - fixedWorld.x)); lineX = snapped; }
              }
              if(sy !== 0){
                const snapped = snapValue(fixedWorld.y + sy*newH, targetsY, threshold);
                if(snapped != null){ newH = Math.max(MIN_SIZE, Math.abs(snapped - fixedWorld.y)); lineY = snapped; }
              }
            }
            showSnapGuides(lineX, lineY);

            const halfW = sx*newW/2, halfH = sy*newH/2;
            const newCenterX = fixedWorld.x + (halfW*Math.cos(rotRad) - halfH*Math.sin(rotRad));
            const newCenterY = fixedWorld.y + (halfW*Math.sin(rotRad) + halfH*Math.cos(rotRad));
            item.w = newW; item.h = newH;
            item.x = newCenterX - newW/2;
            item.y = newCenterY - newH/2;
            item.el.style.left = item.x + 'px';
            item.el.style.top = item.y + 'px';
            item.el.style.width = item.w + 'px';
            item.el.style.height = item.h + 'px';
            if(item.type === 'text'){
              item.fontSize = Math.max(6, startFontSize*(newH/startH));
              refreshTextVisuals(item);
            }
          }
          function onUp(){
            hideSnapGuides();
            handleEl.removeEventListener('pointermove', onMove);
            handleEl.removeEventListener('pointerup', onUp);
            pushHistory();
          }
          handleEl.addEventListener('pointermove', onMove);
          handleEl.addEventListener('pointerup', onUp);
        } else {
          // ---- 画像: 反対側の角を固定して縦横比を保ったまま拡大縮小（歪み防止） ----
          const sx = pos.includes('e') ? 1 : -1;
          const sy = pos.includes('s') ? 1 : -1;
          const centerX0 = item.x + startW/2, centerY0 = item.y + startH/2;
          const originalLocal = { x: sx*startW/2, y: sy*startH/2 };
          const originalDist = Math.hypot(originalLocal.x, originalLocal.y) || 1;
          const fixedLocal0 = { x: -sx*startW/2, y: -sy*startH/2 }; // 固定する反対側の角
          const fixedWorld = {
            x: centerX0 + (fixedLocal0.x*Math.cos(rotRad) - fixedLocal0.y*Math.sin(rotRad)),
            y: centerY0 + (fixedLocal0.x*Math.sin(rotRad) + fixedLocal0.y*Math.cos(rotRad))
          };

          function onMove(ev){
            const dx = (ev.clientX - startClientX) / scale;
            const dy = (ev.clientY - startClientY) / scale;
            const localDx = dx*Math.cos(rotRad) + dy*Math.sin(rotRad);
            const localDy = -dx*Math.sin(rotRad) + dy*Math.cos(rotRad);
            const newLocal = { x: originalLocal.x + localDx, y: originalLocal.y + localDy };
            const newDist = Math.hypot(newLocal.x, newLocal.y);
            let factor = Math.max(0.05, newDist/originalDist);
            let newW = Math.max(8, startW*factor);
            let newH = Math.max(8, startH*factor);

            let lineX = null, lineY = null;
            if(Math.abs(item.rotation) < 0.5){
              const { targetsX, targetsY } = getSnapTargets(item.id);
              const threshold = SNAP_THRESHOLD_PX/scale;
              const candidateRight = fixedWorld.x + sx*newW;
              const candidateBottom = fixedWorld.y + sy*newH;
              const snappedX = snapValue(candidateRight, targetsX, threshold);
              const snappedY = snapValue(candidateBottom, targetsY, threshold);
              // 縦横比を保つため、より近い方のスナップを基準に両辺を再計算する
              let chosenFactor = null;
              if(snappedX != null && snappedY != null){
                const factorFromX = Math.abs(snappedX-fixedWorld.x)/startW;
                const factorFromY = Math.abs(snappedY-fixedWorld.y)/startH;
                const distX = Math.abs(candidateRight-snappedX), distY = Math.abs(candidateBottom-snappedY);
                chosenFactor = distX <= distY ? factorFromX : factorFromY;
                lineX = snappedX; lineY = snappedY;
              } else if(snappedX != null){
                chosenFactor = Math.abs(snappedX-fixedWorld.x)/startW;
                lineX = snappedX;
              } else if(snappedY != null){
                chosenFactor = Math.abs(snappedY-fixedWorld.y)/startH;
                lineY = snappedY;
              }
              if(chosenFactor != null){
                factor = Math.max(0.05, chosenFactor);
                newW = startW*factor;
                newH = startH*factor;
              }
            }
            showSnapGuides(lineX, lineY);

            const halfW = sx*newW/2, halfH = sy*newH/2;
            const newCenterX = fixedWorld.x + (halfW*Math.cos(rotRad) - halfH*Math.sin(rotRad));
            const newCenterY = fixedWorld.y + (halfW*Math.sin(rotRad) + halfH*Math.cos(rotRad));
            item.w = newW; item.h = newH;
            item.x = newCenterX - newW/2;
            item.y = newCenterY - newH/2;
            item.el.style.left = item.x + 'px';
            item.el.style.top = item.y + 'px';
            item.el.style.width = item.w + 'px';
            item.el.style.height = item.h + 'px';
          }
          function onUp(){
            hideSnapGuides();
            handleEl.removeEventListener('pointermove', onMove);
            handleEl.removeEventListener('pointerup', onUp);
            pushHistory();
          }
          handleEl.addEventListener('pointermove', onMove);
          handleEl.addEventListener('pointerup', onUp);
        }
      });
    });

    // 回転ハンドル
    const rotateHandle = item.el.querySelector('.handle-rotate');
    rotateHandle.addEventListener('pointerdown', e => {
      if(item.cropping) return;
      e.preventDefault();
      e.stopPropagation();
      selectItem(item.id);
      rotateHandle.setPointerCapture(e.pointerId);

      const centerX = item.x + item.w/2, centerY = item.y + item.h/2;
      const startPt = stagePointFromEvent(e);
      const startAngle = Math.atan2(startPt.y-centerY, startPt.x-centerX) * 180/Math.PI;
      const startRotation = item.rotation;

      function onMove(ev){
        const pt = stagePointFromEvent(ev);
        const angle = Math.atan2(pt.y-centerY, pt.x-centerX) * 180/Math.PI;
        item.rotation = startRotation + (angle - startAngle);
        item.el.style.transform = `rotate(${item.rotation}deg)`;
      }
      function onUp(){
        rotateHandle.removeEventListener('pointermove', onMove);
        rotateHandle.removeEventListener('pointerup', onUp);
        pushHistory();
      }
      rotateHandle.addEventListener('pointermove', onMove);
      rotateHandle.addEventListener('pointerup', onUp);
    });

    // テキストの編集モード切り替え（ダブルクリック）
    if(item.type === 'text'){
      item.el.addEventListener('dblclick', e => {
        e.stopPropagation();
        enterTextEdit(item);
      });
      item.editEl.addEventListener('input', () => {
        item.text = item.editEl.textContent;
      });
      item.editEl.addEventListener('blur', () => { exitTextEdit(item); });
    }
    // 図形のダブルクリックで中に文字を入力できるようにする
    if(item.type === 'shape'){
      item.el.addEventListener('dblclick', e => {
        e.stopPropagation();
        enterShapeTextEdit(item);
      });
    }
  }

  // ---- テキストの編集モード ----
  function enterTextEdit(item){
    item.editing = true;
    item.editEl.style.display = 'flex';
    item.arcPreviewEl.style.display = 'none';
    item.editEl.focus();
    document.getSelection().selectAllChildren(item.editEl);
  }
  function exitTextEdit(item){
    item.editing = false;
    item.text = item.editEl.textContent;
    applyArcModeVisibility(item);
  }
  function applyArcModeVisibility(item){
    if(item.editing) return;
    if(item.arcEnabled && item.arc !== 0){
      item.editEl.style.display = 'none';
      renderArcPreview(item);
      item.arcPreviewEl.style.display = 'block';
    } else {
      item.editEl.style.display = 'flex';
      item.arcPreviewEl.style.display = 'none';
    }
  }

  function refreshTextVisuals(item){
    item.editEl.style.fontFamily = `"${item.fontFamily}", "Hiragino Sans", sans-serif`;
    item.editEl.style.fontSize = item.fontSize + 'px';
    item.editEl.style.color = item.color;
    item.editEl.style.fontStyle = item.italic ? 'italic' : 'normal';
    item.editEl.style.webkitTextStroke = item.outline
      ? `${Math.max(0.5, item.fontSize*item.outlineWidth/100)}px ${item.outlineColor}`
      : '0px transparent';
    item.editEl.style.textShadow = item.shadow
      ? `${item.fontSize*0.05}px ${item.fontSize*0.06}px ${item.fontSize*0.1}px rgba(0,0,0,.55)`
      : 'none';
    item.bgEl.style.background = item.bgColor || 'transparent';
    applyArcModeVisibility(item);
  }

  // ---- 弧を描くテキストのプレビュー描画（DOM側） ----
  function computeArcLayout(text, arcAmount, fontSize){
    const chars = [...text].filter(c => c !== '\n');
    const n = chars.length;
    const maxSpan = Math.PI;
    const angleSpan = (arcAmount/100) * maxSpan;
    const direction = angleSpan >= 0 ? 1 : -1;
    const absSpan = Math.abs(angleSpan);
    const radius = absSpan > 0.001 ? (n * fontSize*0.6) / absSpan : 0;
    return { chars, n, direction, absSpan, radius };
  }

  function renderArcPreview(item){
    const container = item.arcPreviewEl;
    container.innerHTML = '';
    const { chars, n, direction, absSpan, radius } = computeArcLayout(item.text || '', item.arc, item.fontSize);
    if(n === 0) return;
    const strokeW = item.outline
      ? `${Math.max(0.5, item.fontSize*item.outlineWidth/100)}px ${item.outlineColor}`
      : '0px transparent';
    chars.forEach((ch, i) => {
      const tt = n === 1 ? 0 : (i/(n-1) - 0.5);
      const angle = tt * absSpan * direction;
      const x = radius * Math.sin(angle);
      const y = direction > 0 ? -radius*Math.cos(angle) : radius*Math.cos(angle) - radius;
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.left = '50%';
      span.style.top = '50%';
      span.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle*direction}rad)`;
      span.style.fontSize = item.fontSize + 'px';
      span.style.fontFamily = `"${item.fontFamily}", "Hiragino Sans", sans-serif`;
      span.style.color = item.color;
      span.style.fontStyle = item.italic ? 'italic' : 'normal';
      span.style.webkitTextStroke = strokeW;
      span.style.textShadow = item.shadow
        ? `${item.fontSize*0.05}px ${item.fontSize*0.06}px ${item.fontSize*0.1}px rgba(0,0,0,.55)`
        : 'none';
      container.appendChild(span);
    });
  }

  // ---- テキストオプションパネルの配線 ----
  fontSelect.addEventListener('change', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'text') return;
    item.fontFamily = fontSelect.value;
    refreshTextVisuals(item);
    pushHistory();
  });
  textColorInput.addEventListener('input', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'text') return;
    item.color = textColorInput.value;
    refreshTextVisuals(item);
  });
  textColorInput.addEventListener('change', () => pushHistory());
  textBgColorInput.addEventListener('input', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'text') return;
    item.bgColor = textBgColorInput.value;
    clearBgColorBtn.classList.remove('on');
    bgColorWrapEl.classList.remove('none-active');
    refreshTextVisuals(item);
  });
  textBgColorInput.addEventListener('change', () => pushHistory());
  clearBgColorBtn.addEventListener('click', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'text') return;
    item.bgColor = null;
    clearBgColorBtn.classList.add('on');
    bgColorWrapEl.classList.add('none-active');
    refreshTextVisuals(item);
    pushHistory();
  });
  outlineChip.addEventListener('click', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'text') return;
    item.outline = !item.outline;
    outlineChip.classList.toggle('on', item.outline);
    outlineOptionsEl.style.display = item.outline ? 'flex' : 'none';
    refreshTextVisuals(item);
    pushHistory();
  });
  outlineColorInput.addEventListener('input', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'text') return;
    item.outlineColor = outlineColorInput.value;
    refreshTextVisuals(item);
  });
  outlineColorInput.addEventListener('change', () => pushHistory());
  outlineWidthInput.addEventListener('input', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'text') return;
    item.outlineWidth = parseInt(outlineWidthInput.value, 10) || 12;
    refreshTextVisuals(item);
  });
  outlineWidthInput.addEventListener('change', () => pushHistory());
  shadowChip.addEventListener('click', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'text') return;
    item.shadow = !item.shadow;
    shadowChip.classList.toggle('on', item.shadow);
    refreshTextVisuals(item);
    pushHistory();
  });
  italicChip.addEventListener('click', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'text') return;
    item.italic = !item.italic;
    italicChip.classList.toggle('on', item.italic);
    refreshTextVisuals(item);
    pushHistory();
  });
  arcChip.addEventListener('click', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'text') return;
    item.arcEnabled = !item.arcEnabled;
    if(item.arcEnabled && item.arc === 0){ item.arc = 40; arcRange.value = 40; } // ONにした瞬間に変化が分かるよう初期値を入れる
    arcChip.classList.toggle('on', item.arcEnabled);
    arcOptionsEl.style.display = item.arcEnabled ? 'flex' : 'none';
    applyArcModeVisibility(item);
    pushHistory();
  });
  arcRange.addEventListener('input', () => {
    const item = getItem(selectedId);
    if(!item || item.type !== 'text') return;
    item.arc = parseInt(arcRange.value, 10) || 0;
    applyArcModeVisibility(item);
  });

  // ---- 要素の生成 ----
  function createBaseEl(x, y, w, h){
    const el = document.createElement('div');
    el.className = 'placed-item';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    return el;
  }

  function addImageFile(file, dropX, dropY){
    if(!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let w = img.naturalWidth, h = img.naturalHeight;
      const maxW = canvasW * 0.6, maxH = canvasH * 0.6;
      const fit = Math.min(1, maxW/w, maxH/h);
      w = Math.max(1, Math.round(w*fit));
      h = Math.max(1, Math.round(h*fit));
      let x, y;
      if(dropX != null){
        x = Math.round(dropX - w/2);
        y = Math.round(dropY - h/2);
      } else {
        x = Math.round((canvasW - w)/2) + items.length*16;
        y = Math.round((canvasH - h)/2) + items.length*16;
      }
      createImageItem(img, x, y, w, h);
    };
    img.src = url;
  }

  function buildCropOverlay(item){
    const overlay = document.createElement('div');
    overlay.className = 'crop-overlay';
    const rectEl = document.createElement('div');
    rectEl.className = 'crop-rect';
    ['nw','ne','sw','se'].forEach(pos => {
      const h = document.createElement('div');
      h.className = `crop-handle crop-handle-${pos}`;
      h.dataset.pos = pos;
      h.style.left = pos.includes('e') ? '100%' : '0%';
      h.style.top = pos.includes('s') ? '100%' : '0%';
      rectEl.appendChild(h);
    });
    overlay.appendChild(rectEl);
    item.cropOverlayEl = overlay;
    item.cropRectEl = rectEl;
    return overlay;
  }

  function renderCropRect(item){
    const r = item.cropRect;
    item.cropRectEl.style.left = r.left + 'px';
    item.cropRectEl.style.top = r.top + 'px';
    item.cropRectEl.style.width = (r.right-r.left) + 'px';
    item.cropRectEl.style.height = (r.bottom-r.top) + 'px';
  }

  function bindCropInteractions(item){
    item.cropRectEl.addEventListener('pointerdown', e => {
      if(e.target.classList.contains('crop-handle')) return;
      e.preventDefault(); e.stopPropagation();
      item.cropRectEl.setPointerCapture(e.pointerId);
      const start = { ...item.cropRect };
      const rotRad = item.rotation * Math.PI/180;
      const startClientX = e.clientX, startClientY = e.clientY;
      const w = start.right-start.left, h = start.bottom-start.top;
      function onMove(ev){
        const dx = (ev.clientX-startClientX)/scale, dy = (ev.clientY-startClientY)/scale;
        const localDx = dx*Math.cos(rotRad) + dy*Math.sin(rotRad);
        const localDy = -dx*Math.sin(rotRad) + dy*Math.cos(rotRad);
        let left = Math.max(0, Math.min(item.w-w, start.left+localDx));
        let top = Math.max(0, Math.min(item.h-h, start.top+localDy));
        item.cropRect = { left, top, right: left+w, bottom: top+h };
        renderCropRect(item);
      }
      function onUp(){
        item.cropRectEl.removeEventListener('pointermove', onMove);
        item.cropRectEl.removeEventListener('pointerup', onUp);
      }
      item.cropRectEl.addEventListener('pointermove', onMove);
      item.cropRectEl.addEventListener('pointerup', onUp);
    });

    item.cropOverlayEl.querySelectorAll('.crop-handle').forEach(h => {
      const pos = h.dataset.pos;
      h.addEventListener('pointerdown', e => {
        e.preventDefault(); e.stopPropagation();
        h.setPointerCapture(e.pointerId);
        const start = { ...item.cropRect };
        const rotRad = item.rotation * Math.PI/180;
        const startClientX = e.clientX, startClientY = e.clientY;
        function onMove(ev){
          const dx = (ev.clientX-startClientX)/scale, dy = (ev.clientY-startClientY)/scale;
          const localDx = dx*Math.cos(rotRad) + dy*Math.sin(rotRad);
          const localDy = -dx*Math.sin(rotRad) + dy*Math.cos(rotRad);
          let { left, top, right, bottom } = start;
          if(pos.includes('w')) left = Math.min(right-10, Math.max(0, start.left+localDx));
          if(pos.includes('e')) right = Math.max(left+10, Math.min(item.w, start.right+localDx));
          if(pos.includes('n')) top = Math.min(bottom-10, Math.max(0, start.top+localDy));
          if(pos.includes('s')) bottom = Math.max(top+10, Math.min(item.h, start.bottom+localDy));
          item.cropRect = { left, top, right, bottom };
          renderCropRect(item);
        }
        function onUp(){
          h.removeEventListener('pointermove', onMove);
          h.removeEventListener('pointerup', onUp);
        }
        h.addEventListener('pointermove', onMove);
        h.addEventListener('pointerup', onUp);
      });
    });
  }

  function enterCropMode(item){
    if(item.type !== 'image') return;
    item.cropping = true;
    item.cropRect = { left: 0, top: 0, right: item.w, bottom: item.h };
    item.handlesEl.style.display = 'none';
    item.cropOverlayEl.style.display = 'block';
    renderCropRect(item);
    updateAllHandleSizes();
    selectItem(item.id);
  }
  function applyCrop(item){
    const r = item.cropRect;
    const cropW = r.right-r.left, cropH = r.bottom-r.top;
    if(cropW < 2 || cropH < 2) return;
    const scaleX = item.img.naturalWidth/item.w, scaleY = item.img.naturalHeight/item.h;
    const nx = r.left*scaleX, ny = r.top*scaleY, nw = cropW*scaleX, nh = cropH*scaleY;
    const cv = document.createElement('canvas');
    cv.width = Math.max(1, Math.round(nw)); cv.height = Math.max(1, Math.round(nh));
    const cctx = cv.getContext('2d');
    cctx.drawImage(item.img, nx, ny, nw, nh, 0, 0, cv.width, cv.height);
    const newImg = new Image();
    newImg.onload = () => {
      item.img = newImg;
      item.x = item.x + r.left;
      item.y = item.y + r.top;
      item.w = cropW; item.h = cropH;
      item.el.style.left = item.x + 'px'; item.el.style.top = item.y + 'px';
      item.el.style.width = item.w + 'px'; item.el.style.height = item.h + 'px';
      item.contentEl.querySelector('img').src = newImg.src;
      pushHistory();
    };
    newImg.src = cv.toDataURL('image/png');
  }
  function exitCropMode(item, apply){
    if(apply) applyCrop(item);
    item.cropping = false;
    item.cropOverlayEl.style.display = 'none';
    item.handlesEl.style.display = '';
    selectItem(item.id);
  }
  cropBtn.addEventListener('click', () => {
    const item = getItem(selectedId);
    if(item && item.type === 'image') enterCropMode(item);
  });
  cropApplyBtn.addEventListener('click', () => {
    const item = getItem(selectedId);
    if(item) exitCropMode(item, true);
  });
  cropCancelBtn.addEventListener('click', () => {
    const item = getItem(selectedId);
    if(item) exitCropMode(item, false);
  });

  function createImageItem(img, x, y, w, h, opts){
    opts = opts || {};
    const id = nextId++;
    const el = createBaseEl(x, y, w, h);
    const content = document.createElement('div');
    content.className = 'item-content';
    const inner = document.createElement('img');
    inner.src = img.src;
    content.appendChild(inner);
    el.appendChild(content);
    const handlesEl = buildHandles(false);
    el.appendChild(handlesEl);
    stageInner.appendChild(el);

    const rotation = opts.rotation || 0;
    if(rotation) el.style.transform = `rotate(${rotation}deg)`;
    const item = { id, type:'image', img, x, y, w, h, rotation, el, contentEl: content, handlesEl, cropping:false };
    el.appendChild(buildCropOverlay(item));
    items.push(item);
    reflectOrder(); // 新規追加時にも明示的な重なり順(z-index)を必ず反映させる
    bindItemInteractions(item);
    bindCropInteractions(item);
    if(opts.autoSelect !== false) selectItem(id);
    updateAllHandleSizes();
    if(opts.pushHist !== false) pushHistory();
    return item;
  }

  function createTextItem(text, x, y, w, h, opts){
    opts = opts || {};
    const id = nextId++;
    const el = createBaseEl(x, y, w, h);
    const content = document.createElement('div');
    content.className = 'item-content text-content';

    const bgEl = document.createElement('div');
    bgEl.className = 'text-bg';
    content.appendChild(bgEl);

    const editEl = document.createElement('div');
    editEl.className = 'text-edit';
    editEl.contentEditable = 'true';
    editEl.spellcheck = false;
    editEl.textContent = text;
    content.appendChild(editEl);

    const arcPreviewEl = document.createElement('div');
    arcPreviewEl.className = 'text-arc-preview';
    content.appendChild(arcPreviewEl);

    el.appendChild(content);
    const handlesEl = buildHandles(true);
    el.appendChild(handlesEl);
    stageInner.appendChild(el);

    const rotation = opts.rotation || 0;
    if(rotation) el.style.transform = `rotate(${rotation}deg)`;
    const fontSize = opts.fontSize != null ? opts.fontSize : Math.max(10, Math.round(h*0.55));
    const item = {
      id, type:'text', x, y, w, h, rotation, el, contentEl: content, handlesEl,
      editEl, bgEl, arcPreviewEl, text, fontSize,
      fontFamily: opts.fontFamily || 'Zen Kaku Gothic New',
      color: opts.color || '#ffffff',
      bgColor: opts.bgColor != null ? opts.bgColor : null,
      outline: !!opts.outline, outlineColor: opts.outlineColor || '#000000', outlineWidth: opts.outlineWidth || 12,
      shadow: !!opts.shadow, italic: !!opts.italic,
      arc: opts.arc || 0, arcEnabled: !!opts.arcEnabled,
      editing: false, cropping:false
    };
    items.push(item);
    reflectOrder(); // 新規追加時にも明示的な重なり順(z-index)を必ず反映させる
    bindItemInteractions(item);
    refreshTextVisuals(item);
    if(opts.autoSelect !== false) selectItem(id);
    updateAllHandleSizes();
    if(opts.pushHist !== false) pushHistory();
    return item;
  }

  // ---- 表(テーブル) ----
  function cumulativePercents(fractions){
    // [0.25, 0.5, 0.25] -> [25, 75] （境界線の位置、%）
    const out = [];
    let sum = 0;
    for(let i = 0; i < fractions.length-1; i++){
      sum += fractions[i];
      out.push(sum*100);
    }
    return out;
  }
  function applyTableSizing(item){
    const table = item.contentEl.querySelector('table.wc-table');
    if(!table) return;
    const cols = table.querySelectorAll('colgroup col');
    item.colWidths.forEach((wFrac, c) => { if(cols[c]) cols[c].style.width = (wFrac*100) + '%'; });
    const trs = table.querySelectorAll('tr');
    item.rowHeights.forEach((hFrac, r) => { if(trs[r]) trs[r].style.height = (hFrac*100) + '%'; });
    const rowBoundaries = cumulativePercents(item.rowHeights);
    item.contentEl.querySelectorAll('.row-grip').forEach((grip, i) => { grip.style.top = rowBoundaries[i] + '%'; });
    const colBoundaries = cumulativePercents(item.colWidths);
    item.contentEl.querySelectorAll('.col-grip').forEach((grip, i) => { grip.style.left = colBoundaries[i] + '%'; });
  }
  function buildTableDOM(item){
    const table = document.createElement('table');
    table.className = 'wc-table';
    const colgroup = document.createElement('colgroup');
    for(let c = 0; c < item.cols; c++) colgroup.appendChild(document.createElement('col'));
    table.appendChild(colgroup);
    for(let r = 0; r < item.rows; r++){
      const tr = document.createElement('tr');
      for(let c = 0; c < item.cols; c++){
        const td = document.createElement('td');
        td.contentEditable = 'true';
        td.spellcheck = false;
        td.textContent = item.cells[r][c] || '';
        const cellImg = item.cellImages && item.cellImages[r] && item.cellImages[r][c];
        if(cellImg){
          td.style.backgroundImage = `url("${cellImg}")`;
          td.style.backgroundSize = 'contain';
          td.style.backgroundPosition = 'center';
          td.style.backgroundRepeat = 'no-repeat';
        }
        td.addEventListener('input', () => { item.cells[r][c] = td.textContent; });
        td.addEventListener('pointerdown', e => {
          // 編集中のセルの外側をクリックしたときだけ、ここで止めて編集を終わらせる。
          // それ以外は伝播させ、通常どおり「選択してそのままドラッグで移動」できるようにする
          // （前は選択済みのセルをクリックした瞬間に編集扱いになり、掴んで動かせなくなっていた）
          if(item.tableEditing){ e.stopPropagation(); return; }
        });
        td.addEventListener('dblclick', e => {
          e.stopPropagation();
          selectItem(item.id);
          td.focus();
          document.getSelection().selectAllChildren(td);
        });
        td.addEventListener('focus', () => { item.tableEditing = true; });
        td.addEventListener('blur', () => { item.tableEditing = false; });
        td.addEventListener('contextmenu', e => {
          e.preventDefault();
          e.stopPropagation();
          selectItem(item.id);
          showContextMenu(item, e.clientX, e.clientY, { row:r, col:c });
        });
        bindLongPress(td, e => {
          selectItem(item.id);
          showContextMenu(item, e.clientX, e.clientY, { row:r, col:c });
        });
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    item.contentEl.innerHTML = '';
    item.contentEl.appendChild(table);

    // 行・列の境界線をつかんでサイズを変えられるように、見えないグリップを重ねる
    for(let r = 0; r < item.rows-1; r++){
      const grip = document.createElement('div');
      grip.className = 'row-grip';
      item.contentEl.appendChild(grip);
      bindTableGrip(item, grip, true, { value: r });
    }
    for(let c = 0; c < item.cols-1; c++){
      const grip = document.createElement('div');
      grip.className = 'col-grip';
      item.contentEl.appendChild(grip);
      bindTableGrip(item, grip, false, { value: c });
    }
    applyTableSizing(item);
  }

  function createTableItem(rows, cols, x, y, w, h, opts){
    opts = opts || {};
    const id = nextId++;
    const el = createBaseEl(x, y, w, h);
    const content = document.createElement('div');
    content.className = 'item-content table-content';
    el.appendChild(content);
    const handlesEl = buildHandles(true);
    el.appendChild(handlesEl);
    stageInner.appendChild(el);

    const rotation = opts.rotation || 0;
    if(rotation) el.style.transform = `rotate(${rotation}deg)`;
    const cells = opts.cells || Array.from({length: rows}, () => Array.from({length: cols}, () => ''));
    const cellImages = opts.cellImages || Array.from({length: rows}, () => Array.from({length: cols}, () => null));
    const colWidths = opts.colWidths || Array.from({length: cols}, () => 1/cols);
    const rowHeights = opts.rowHeights || Array.from({length: rows}, () => 1/rows);
    const item = {
      id, type:'table', x, y, w, h, rotation, el, contentEl: content, handlesEl,
      rows, cols, cells, cellImages, colWidths, rowHeights, tableEditing: false, cropping:false
    };
    buildTableDOM(item);
    items.push(item);
    reflectOrder(); // 新規追加時にも明示的な重なり順(z-index)を必ず反映させる
    bindItemInteractions(item);
    if(opts.autoSelect !== false) selectItem(id);
    updateAllHandleSizes();
    if(opts.pushHist !== false) pushHistory();
    return item;
  }

  function addTableColumn(item, afterCol){
    const oldCols = item.cols;
    item.cols += 1;
    item.cells.forEach(row => row.splice(afterCol+1, 0, ''));
    item.cellImages.forEach(row => row.splice(afterCol+1, 0, null));
    const shrink = oldCols/(oldCols+1);
    item.colWidths = item.colWidths.map(w => w*shrink);
    item.colWidths.splice(afterCol+1, 0, 1/(oldCols+1));
    buildTableDOM(item);
    pushHistory();
  }
  function removeTableColumn(item, col){
    if(item.cols <= 1) return;
    item.cols -= 1;
    item.cells.forEach(row => row.splice(col, 1));
    item.cellImages.forEach(row => row.splice(col, 1));
    const removed = item.colWidths[col];
    item.colWidths.splice(col, 1);
    const remain = 1 - removed;
    if(remain > 0.0001) item.colWidths = item.colWidths.map(w => w/remain);
    else item.colWidths = item.colWidths.map(() => 1/item.cols);
    buildTableDOM(item);
    pushHistory();
  }
  // データだけを入れ替える版（罫線ドラッグ中に連続適用するため、DOM再構築や履歴保存を都度行わない）
  function shiftColumnData(item, col, direction){
    const target = col + direction;
    if(target < 0 || target >= item.cols) return false;
    item.cells.forEach(row => { const tmp = row[col]; row[col] = row[target]; row[target] = tmp; });
    item.cellImages.forEach(row => { const tmp = row[col]; row[col] = row[target]; row[target] = tmp; });
    return true;
  }
  function shiftRowData(item, row, direction){
    const target = row + direction;
    if(target < 0 || target >= item.rows) return false;
    const tmp = item.cells[row]; item.cells[row] = item.cells[target]; item.cells[target] = tmp;
    const tmpImg = item.cellImages[row]; item.cellImages[row] = item.cellImages[target]; item.cellImages[target] = tmpImg;
    return true;
  }
  function shiftTableColumn(item, col, direction){
    if(shiftColumnData(item, col, direction)){ buildTableDOM(item); pushHistory(); }
  }
  function addTableRow(item, afterRow){
    const oldRows = item.rows;
    item.rows += 1;
    item.cells.splice(afterRow+1, 0, new Array(item.cols).fill(''));
    item.cellImages.splice(afterRow+1, 0, new Array(item.cols).fill(null));
    const shrink = oldRows/(oldRows+1);
    item.rowHeights = item.rowHeights.map(h => h*shrink);
    item.rowHeights.splice(afterRow+1, 0, 1/(oldRows+1));
    buildTableDOM(item);
    pushHistory();
  }
  function removeTableRow(item, row){
    if(item.rows <= 1) return;
    item.rows -= 1;
    item.cells.splice(row, 1);
    item.cellImages.splice(row, 1);
    const removed = item.rowHeights[row];
    item.rowHeights.splice(row, 1);
    const remain = 1 - removed;
    if(remain > 0.0001) item.rowHeights = item.rowHeights.map(h => h/remain);
    else item.rowHeights = item.rowHeights.map(() => 1/item.rows);
    buildTableDOM(item);
    pushHistory();
  }
  function shiftTableRow(item, row, direction){
    if(shiftRowData(item, row, direction)){ buildTableDOM(item); pushHistory(); }
  }
  // 罫線をドラッグして、隣り合う列/行の境界だけを動かす（内容の入れ替えではなく、幅・高さの変更）
  const TABLE_MIN_FRACTION = 0.06;
  function bindTableGrip(item, gripEl, isRow, boundaryRef){
    gripEl.addEventListener('pointerdown', e => {
      e.preventDefault();
      e.stopPropagation();
      selectItem(item.id);
      gripEl.setPointerCapture(e.pointerId);
      const boundary = boundaryRef.value; // この境界の手前(boundary)と奥(boundary+1)の間
      const sizes = isRow ? item.rowHeights : item.colWidths;
      const totalPx = isRow ? item.h : item.w;
      const startA = sizes[boundary], startB = sizes[boundary+1];
      const pairSum = startA + startB;
      const startPos = isRow ? e.clientY : e.clientX;
      let changed = false;

      function onMove(ev){
        const pos = isRow ? ev.clientY : ev.clientX;
        const deltaFrac = ((pos - startPos) / scale) / totalPx;
        let newA = startA + deltaFrac;
        newA = Math.max(TABLE_MIN_FRACTION, Math.min(pairSum - TABLE_MIN_FRACTION, newA));
        const newB = pairSum - newA;
        sizes[boundary] = newA;
        sizes[boundary+1] = newB;
        changed = true;
        applyTableSizing(item);
      }
      function onUp(){
        gripEl.removeEventListener('pointermove', onMove);
        gripEl.removeEventListener('pointerup', onUp);
        if(changed) pushHistory();
      }
      gripEl.addEventListener('pointermove', onMove);
      gripEl.addEventListener('pointerup', onUp);
    });
  }
  // 表の特定のセルだけに画像をはめ込む（そのセルの枠からはみ出さない）
  function setTableCellImage(item, row, col, file){
    if(!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      item.cellImages[row][col] = reader.result;
      buildTableDOM(item);
      pushHistory();
    };
    reader.readAsDataURL(file);
  }
  function clearTableCellImage(item, row, col){
    item.cellImages[row][col] = null;
    buildTableDOM(item);
    pushHistory();
  }

  // ---- 線 ----
  function renderLineSVG(item){
    const halfStroke = item.strokeWidth/2;
    item.contentEl.innerHTML =
      `<svg viewBox="0 0 ${item.w} ${item.h}" preserveAspectRatio="none">` +
      `<line x1="0" y1="${item.h/2}" x2="${item.w}" y2="${item.h/2}" stroke="${item.color}" stroke-width="${item.strokeWidth}" stroke-linecap="round"/>` +
      `</svg>`;
  }
  function createLineItem(x, y, w, h, opts){
    opts = opts || {};
    const id = nextId++;
    const el = createBaseEl(x, y, w, h);
    const content = document.createElement('div');
    content.className = 'item-content line-content';
    el.appendChild(content);
    const handlesEl = buildHandles(true);
    el.appendChild(handlesEl);
    stageInner.appendChild(el);

    const rotation = opts.rotation || 0;
    if(rotation) el.style.transform = `rotate(${rotation}deg)`;
    const item = {
      id, type:'line', x, y, w, h, rotation, el, contentEl: content, handlesEl,
      color: opts.color || '#29e0c4', strokeWidth: opts.strokeWidth || 6, cropping:false
    };
    renderLineSVG(item);
    items.push(item);
    reflectOrder(); // 新規追加時にも明示的な重なり順(z-index)を必ず反映させる
    bindItemInteractions(item);
    if(opts.autoSelect !== false) selectItem(id);
    updateAllHandleSizes();
    if(opts.pushHist !== false) pushHistory();
    return item;
  }

  // ---- 図形 ----
  // 図形の形状は共通の「パスコマンド」列で表現し、SVGプレビューとcanvas書き出しの
  // 両方で同じジオメトリを使い回す（見た目のズレを防ぐため）。
  // コマンド: ['M',x,y] ['L',x,y] ['C',c1x,c1y,c2x,c2y,x,y] ['Z']
  function regularPolygonCommands(cx, cy, rx, ry, sides, angleOffset){
    const cmds = [];
    for(let i = 0; i < sides; i++){
      const angle = angleOffset + i*(2*Math.PI/sides);
      const x = cx + rx*Math.cos(angle), y = cy + ry*Math.sin(angle);
      cmds.push([i===0?'M':'L', x, y]);
    }
    cmds.push(['Z']);
    return cmds;
  }
  function starCommands(cx, cy, rx, ry, spikes, innerRatio){
    const cmds = [];
    const step = Math.PI/spikes;
    let angle = -Math.PI/2;
    for(let i = 0; i < spikes*2; i++){
      const r = (i % 2 === 0) ? 1 : innerRatio;
      const x = cx + Math.cos(angle)*rx*r, y = cy + Math.sin(angle)*ry*r;
      cmds.push([i===0?'M':'L', x, y]);
      angle += step;
    }
    cmds.push(['Z']);
    return cmds;
  }
  function heartCommands(x0, y0, w, h){
    const cx = x0 + w/2;
    return [
      ['M', cx, y0+h*0.97],
      ['C', x0+w*0.0, y0+h*0.62, x0+w*0.02, y0+h*0.02, cx, y0+h*0.28],
      ['C', x0+w*0.98, y0+h*0.02, x0+w*1.0, y0+h*0.62, cx, y0+h*0.97],
      ['Z']
    ];
  }
  function roundedRectCommands(x0, y0, w, h, r){
    r = Math.max(0, Math.min(r, Math.min(w, h)/2));
    const k = 0.5522847498;
    const x1 = x0+w, y1 = y0+h;
    if(r < 0.01){
      return [['M',x0,y0],['L',x1,y0],['L',x1,y1],['L',x0,y1],['Z']];
    }
    return [
      ['M', x0+r, y0],
      ['L', x1-r, y0],
      ['C', x1-r+k*r, y0, x1, y0+r-k*r, x1, y0+r],
      ['L', x1, y1-r],
      ['C', x1, y1-r+k*r, x1-r+k*r, y1, x1-r, y1],
      ['L', x0+r, y1],
      ['C', x0+r-k*r, y1, x0, y1-r+k*r, x0, y1-r],
      ['L', x0, y0+r],
      ['C', x0, y0+r-k*r, x0+r-k*r, y0, x0+r, y0],
      ['Z']
    ];
  }
  const ADVANCED_SHAPE_TYPES = ['triangle','diamond','pentagon','hexagon','star','heart','parallelogram','rounded-rect','pill'];
  // w,h,sw を受け取り、そのシェイプのパスコマンド列(絶対座標 0..w, 0..h)を返す。
  // rect/ellipse はそれぞれ専用の描画をするのでnullを返す。
  function shapeCommands(shapeType, w, h, sw){
    const inset = sw/2;
    const x0 = inset, y0 = inset;
    const bw = Math.max(0, w-sw), bh = Math.max(0, h-sw);
    const x1 = x0+bw, y1 = y0+bh;
    const cx = x0+bw/2, cy = y0+bh/2;
    switch(shapeType){
      case 'triangle': return [['M', cx, y0], ['L', x1, y1], ['L', x0, y1], ['Z']];
      case 'diamond': return [['M', cx, y0], ['L', x1, cy], ['L', cx, y1], ['L', x0, cy], ['Z']];
      case 'pentagon': return regularPolygonCommands(cx, cy, bw/2, bh/2, 5, -Math.PI/2);
      case 'hexagon': return regularPolygonCommands(cx, cy, bw/2, bh/2, 6, 0);
      case 'star': return starCommands(cx, cy, bw/2, bh/2, 5, 0.45);
      case 'heart': return heartCommands(x0, y0, bw, bh);
      case 'parallelogram': {
        const skew = bw*0.22;
        return [['M', x0+skew, y0], ['L', x1, y0], ['L', x1-skew, y1], ['L', x0, y1], ['Z']];
      }
      case 'rounded-rect': return roundedRectCommands(x0, y0, bw, bh, Math.min(bw, bh)*0.16);
      case 'pill': return roundedRectCommands(x0, y0, bw, bh, bh/2);
      default: return null;
    }
  }
  function commandsToSvgPath(cmds){
    return cmds.map(cmd => {
      if(cmd[0] === 'Z') return 'Z';
      return cmd[0] + ' ' + cmd.slice(1).map(n => Math.round(n*100)/100).join(' ');
    }).join(' ');
  }
  function applyCommandsToCtx(ctx, cmds, ox, oy){
    ctx.beginPath();
    cmds.forEach(cmd => {
      const type = cmd[0];
      if(type === 'M') ctx.moveTo(cmd[1]+ox, cmd[2]+oy);
      else if(type === 'L') ctx.lineTo(cmd[1]+ox, cmd[2]+oy);
      else if(type === 'C') ctx.bezierCurveTo(cmd[1]+ox, cmd[2]+oy, cmd[3]+ox, cmd[4]+oy, cmd[5]+ox, cmd[6]+oy);
      else if(type === 'Z') ctx.closePath();
    });
  }
  function shapeLabel(shapeType){
    const map = {
      rect:'shape_rect_label', ellipse:'shape_ellipse_label', 'rounded-rect':'shape_rounded_rect_label',
      pill:'shape_pill_label', triangle:'shape_triangle_label', diamond:'shape_diamond_label',
      pentagon:'shape_pentagon_label', hexagon:'shape_hexagon_label', star:'shape_star_label',
      heart:'shape_heart_label', parallelogram:'shape_parallelogram_label'
    };
    return t(map[shapeType] || 'shape_rect_label');
  }

  function renderShapeSVG(item){
    const sw = item.strokeWidth;
    const fill = item.fillImage ? 'none' : (item.fillColor || 'none');
    const inset = sw/2;
    let shapeTag, clipDefs = '', pathD = null;
    if(item.shapeType === 'ellipse'){
      shapeTag = `<ellipse cx="${item.w/2}" cy="${item.h/2}" rx="${Math.max(0,item.w/2-inset)}" ry="${Math.max(0,item.h/2-inset)}" fill="${fill}" stroke="${item.strokeColor}" stroke-width="${sw}"/>`;
      pathD = null;
    } else if(!ADVANCED_SHAPE_TYPES.includes(item.shapeType)){
      shapeTag = `<rect x="${inset}" y="${inset}" width="${Math.max(0,item.w-sw)}" height="${Math.max(0,item.h-sw)}" fill="${fill}" stroke="${item.strokeColor}" stroke-width="${sw}"/>`;
    } else {
      const cmds = shapeCommands(item.shapeType, item.w, item.h, sw);
      pathD = commandsToSvgPath(cmds);
      shapeTag = `<path d="${pathD}" fill="${fill}" stroke="${item.strokeColor}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    }
    let imageTag = '';
    if(item.fillImage){
      const clipId = `shapeclip-${item.id}`;
      let clipShape;
      if(item.shapeType === 'ellipse'){
        clipShape = `<ellipse cx="${item.w/2}" cy="${item.h/2}" rx="${Math.max(0,item.w/2-inset)}" ry="${Math.max(0,item.h/2-inset)}"/>`;
      } else if(pathD){
        clipShape = `<path d="${pathD}"/>`;
      } else {
        clipShape = `<rect x="${inset}" y="${inset}" width="${Math.max(0,item.w-sw)}" height="${Math.max(0,item.h-sw)}"/>`;
      }
      clipDefs = `<defs><clipPath id="${clipId}">${clipShape}</clipPath></defs>`;
      imageTag = `<image href="${item.fillImage.src}" x="0" y="0" width="${item.w}" height="${item.h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"/>`;
    }
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox', `0 0 ${item.w} ${item.h}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.innerHTML = clipDefs + imageTag + shapeTag;
    if(item.svgEl) item.svgEl.remove();
    item.svgEl = svg;
    item.contentEl.insertBefore(svg, item.contentEl.firstChild);
  }
  function createShapeItem(shapeType, x, y, w, h, opts){
    opts = opts || {};
    const id = nextId++;
    const el = createBaseEl(x, y, w, h);
    const content = document.createElement('div');
    content.className = 'item-content shape-content';
    el.appendChild(content);
    const handlesEl = buildHandles(true);
    el.appendChild(handlesEl);
    stageInner.appendChild(el);

    const rotation = opts.rotation || 0;
    if(rotation) el.style.transform = `rotate(${rotation}deg)`;
    const item = {
      id, type:'shape', x, y, w, h, rotation, el, contentEl: content, handlesEl,
      shapeType: shapeType || 'rect',
      fillColor: opts.fillColor !== undefined ? opts.fillColor : null,
      strokeColor: opts.strokeColor || '#ffffff',
      strokeWidth: opts.strokeWidth != null ? opts.strokeWidth : 4,
      fillImage: opts.fillImage || null,
      shapeText: opts.shapeText || '',
      shapeTextEditing: false,
      cropping:false
    };
    renderShapeSVG(item);
    buildShapeTextEl(item);
    items.push(item);
    reflectOrder(); // 新規追加時にも明示的な重なり順(z-index)を必ず反映させる
    bindItemInteractions(item);
    if(opts.autoSelect !== false) selectItem(id);
    updateAllHandleSizes();
    if(opts.pushHist !== false) pushHistory();
    return item;
  }

  // ---- 図形の中に入れる文字 ----
  function buildShapeTextEl(item){
    if(item.shapeTextEl) item.shapeTextEl.remove();
    const el = document.createElement('div');
    el.className = 'shape-text-edit';
    el.contentEditable = 'true';
    el.spellcheck = false;
    el.textContent = item.shapeText || '';
    el.style.display = item.shapeText ? 'flex' : 'none';
    el.addEventListener('pointerdown', e => { if(item.shapeTextEditing) e.stopPropagation(); });
    el.addEventListener('input', () => { item.shapeText = el.textContent; });
    el.addEventListener('blur', () => {
      item.shapeTextEditing = false;
      item.shapeText = el.textContent;
      el.style.display = item.shapeText ? 'flex' : 'none';
      pushHistory();
    });
    item.contentEl.appendChild(el);
    item.shapeTextEl = el;
  }
  function enterShapeTextEdit(item){
    item.shapeTextEditing = true;
    item.shapeTextEl.style.display = 'flex';
    item.shapeTextEl.focus();
    document.getSelection().selectAllChildren(item.shapeTextEl);
  }
  // 図形の画像を設定/解除
  function setShapeFillImage(item, file){
    if(!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        item.fillImage = img;
        renderShapeSVG(item);
        if(selectedId === item.id) selectItem(item.id);
        pushHistory();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
  function clearShapeFillImage(item){
    item.fillImage = null;
    renderShapeSVG(item);
    pushHistory();
  }


  addMenuSelect.addEventListener('change', () => {
    const v = addMenuSelect.value;
    if(v && v !== 'draw') deactivateDrawMode();
    if(v === 'text'){
      const w = Math.round(canvasW*0.5), h = Math.round(canvasH*0.18);
      const x = Math.round((canvasW-w)/2), y = Math.round((canvasH-h)/2);
      createTextItem(t('new_text_default'), x, y, w, h);
    } else if(v === 'table'){
      const w = Math.round(canvasW*0.5), h = Math.round(canvasH*0.35);
      const x = Math.round((canvasW-w)/2), y = Math.round((canvasH-h)/2);
      createTableItem(3, 3, x, y, w, h);
    } else if(v === 'draw'){
      setDrawMode('pen');
    } else if(v === 'line'){
      const w = Math.round(canvasW*0.4), h = 40;
      const x = Math.round((canvasW-w)/2), y = Math.round((canvasH-h)/2);
      createLineItem(x, y, w, h);
    } else if(v === 'shape'){
      const w = Math.round(canvasW*0.3), h = Math.round(canvasW*0.3);
      const x = Math.round((canvasW-w)/2), y = Math.round((canvasH-h)/2);
      createShapeItem('rect', x, y, w, h);
    }
  });

  // ---- 画像追加のUI（クリック / ドラッグ&ドロップ） ----
  stageEmptyHint.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', e => {
    deactivateDrawMode();
    [...e.target.files].forEach(f => addImageFile(f));
    e.target.value = '';
  });

  // ドロップ位置にある要素を調べ、選択中の図形や表のセルの上に落とされた場合は
  // 新しい画像レイヤーを作らずその図形/セルの中だけに画像をはめ込む
  function findDropTarget(e){
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if(!el) return null;
    const td = el.closest ? el.closest('td') : null;
    if(td){
      const tableEl = td.closest('.placed-item');
      const tableItem = tableEl && items.find(it => it.el === tableEl && it.type === 'table');
      if(tableItem){
        const tr = td.parentNode;
        const row = Array.prototype.indexOf.call(tableEl.querySelectorAll('tr'), tr);
        const col = Array.prototype.indexOf.call(tr.children, td);
        return { kind:'table-cell', item: tableItem, row, col };
      }
    }
    const shapeEl = el.closest ? el.closest('.placed-item') : null;
    const shapeItem = shapeEl && items.find(it => it.el === shapeEl && it.type === 'shape');
    if(shapeItem) return { kind:'shape', item: shapeItem };
    return null;
  }

  stageWrap.addEventListener('dragover', e => { e.preventDefault(); stageEmptyHint.classList.add('drag'); });
  stageWrap.addEventListener('dragleave', () => stageEmptyHint.classList.remove('drag'));
  stageWrap.addEventListener('drop', e => {
    e.preventDefault();
    stageEmptyHint.classList.remove('drag');
    deactivateDrawMode();
    const files = [...e.dataTransfer.files];
    if(files.length === 0) return;
    if(files[0].type.startsWith('image/')){
      const target = findDropTarget(e);
      if(target && target.kind === 'table-cell'){
        setTableCellImage(target.item, target.row, target.col, files[0]);
        return;
      }
      if(target && target.kind === 'shape'){
        setShapeFillImage(target.item, files[0]);
        return;
      }
    }
    const pt = stagePointFromEvent(e);
    files.forEach(f => addImageFile(f, pt.x, pt.y));
  });

  // ---- テキストの折り返し（文字単位。スペースが無いCJKにも対応） ----
  function wrapText(ctx, text, maxWidth){
    const paragraphs = (text || '').split('\n');
    const lines = [];
    paragraphs.forEach(p => {
      if(p === ''){ lines.push(''); return; }
      let line = '';
      for(const ch of p){
        const test = line + ch;
        if(line !== '' && ctx.measureText(test).width > maxWidth){
          lines.push(line);
          line = ch;
        } else {
          line = test;
        }
      }
      if(line !== '') lines.push(line);
    });
    return lines;
  }

  function drawImageItem(ctx, item){
    ctx.save();
    const cx = item.x + item.w/2, cy = item.y + item.h/2;
    ctx.translate(cx, cy);
    ctx.rotate(item.rotation * Math.PI/180);
    ctx.drawImage(item.img, -item.w/2, -item.h/2, item.w, item.h);
    ctx.restore();
  }

  function drawTableItem(ctx, item){
    ctx.save();
    const cx = item.x + item.w/2, cy = item.y + item.h/2;
    ctx.translate(cx, cy);
    ctx.rotate(item.rotation * Math.PI/180);
    const colWidths = item.colWidths || Array.from({length:item.cols}, () => 1/item.cols);
    const rowHeights = item.rowHeights || Array.from({length:item.rows}, () => 1/item.rows);
    const colXs = [0]; colWidths.forEach(f => colXs.push(colXs[colXs.length-1] + f*item.w));
    const rowYs = [0]; rowHeights.forEach(f => rowYs.push(rowYs[rowYs.length-1] + f*item.h));
    const avgCellW = item.w/item.cols, avgCellH = item.h/item.rows;
    const fontSize = Math.max(9, Math.min(avgCellH*0.4, avgCellW*0.18));
    ctx.font = `700 ${fontSize}px "Zen Kaku Gothic New", "Hiragino Sans", sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for(let r = 0; r < item.rows; r++){
      for(let c = 0; c < item.cols; c++){
        const x0 = -item.w/2 + colXs[c], y0 = -item.h/2 + rowYs[r];
        const cellW = colXs[c+1]-colXs[c], cellH = rowYs[r+1]-rowYs[r];
        const cellImg = item.cellImages && item.cellImages[r] && item.cellImages[r][c] && item.cellImageEls && item.cellImageEls[r] && item.cellImageEls[r][c];
        if(cellImg && cellImg.complete){
          // そのセルの枠だけに収まるよう、はみ出さずに中央配置（contain）する
          ctx.save();
          ctx.beginPath();
          ctx.rect(x0, y0, cellW, cellH);
          ctx.clip();
          const ir = cellImg.naturalWidth / cellImg.naturalHeight;
          const cr = cellW / cellH;
          let dw, dh;
          if(ir > cr){ dw = cellW; dh = dw/ir; } else { dh = cellH; dw = dh*ir; }
          ctx.drawImage(cellImg, x0+cellW/2-dw/2, y0+cellH/2-dh/2, dw, dh);
          ctx.restore();
        }
        ctx.strokeStyle = 'rgba(255,255,255,.9)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x0, y0, cellW, cellH);
        const text = (item.cells[r] && item.cells[r][c]) || '';
        if(text){
          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, x0+cellW/2, y0+cellH/2, cellW-8);
        }
      }
    }
    ctx.restore();
  }

  function drawLineItem(ctx, item){
    ctx.save();
    const cx = item.x + item.w/2, cy = item.y + item.h/2;
    ctx.translate(cx, cy);
    ctx.rotate(item.rotation * Math.PI/180);
    ctx.strokeStyle = item.color;
    ctx.lineWidth = item.strokeWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-item.w/2, 0);
    ctx.lineTo(item.w/2, 0);
    ctx.stroke();
    ctx.restore();
  }

  function traceShapePath(ctx, item, ox, oy){
    const inset = item.strokeWidth/2;
    if(item.shapeType === 'ellipse'){
      ctx.beginPath();
      ctx.ellipse(ox, oy, Math.max(0, item.w/2-inset), Math.max(0, item.h/2-inset), 0, 0, Math.PI*2);
    } else if(!ADVANCED_SHAPE_TYPES.includes(item.shapeType)){
      ctx.beginPath();
      ctx.rect(-item.w/2+inset, -item.h/2+inset, Math.max(0, item.w-item.strokeWidth), Math.max(0, item.h-item.strokeWidth));
    } else {
      const cmds = shapeCommands(item.shapeType, item.w, item.h, item.strokeWidth);
      applyCommandsToCtx(ctx, cmds, -item.w/2, -item.h/2);
    }
  }
  function drawShapeItem(ctx, item){
    ctx.save();
    const cx = item.x + item.w/2, cy = item.y + item.h/2;
    ctx.translate(cx, cy);
    ctx.rotate(item.rotation * Math.PI/180);

    traceShapePath(ctx, item, 0, 0);
    if(item.fillImage){
      ctx.save();
      ctx.clip();
      // 図形を覆うように、画像をアスペクト比を保って中央にトリミング配置（cover）
      const ir = item.fillImage.naturalWidth / item.fillImage.naturalHeight;
      const br = item.w / item.h;
      let dw, dh;
      if(ir > br){ dh = item.h; dw = dh*ir; } else { dw = item.w; dh = dw/ir; }
      ctx.drawImage(item.fillImage, -dw/2, -dh/2, dw, dh);
      ctx.restore();
    } else if(item.fillColor){
      ctx.fillStyle = item.fillColor; ctx.fill();
    }
    if(item.strokeWidth > 0){
      traceShapePath(ctx, item, 0, 0);
      ctx.strokeStyle = item.strokeColor; ctx.lineWidth = item.strokeWidth; ctx.stroke();
    }
    if(item.shapeText){
      const fontSize = Math.max(9, Math.min(item.h, item.w)*0.16);
      ctx.font = `900 ${fontSize}px "Zen Kaku Gothic New", "Hiragino Sans", sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      const lines = wrapText(ctx, item.shapeText, item.w*0.82);
      const lineHeight = fontSize*1.2;
      let ty = -((lines.length-1)*lineHeight)/2;
      lines.forEach(line => { ctx.fillText(line, 0, ty); ty += lineHeight; });
    }
    ctx.restore();
  }

  function drawArcTextInner(ctx, item){
    const { chars, n, direction, absSpan, radius } = computeArcLayout(item.text || '', item.arc, item.fontSize);
    if(n === 0) return;
    const style = item.italic ? 'italic ' : '';
    ctx.font = `${style}900 ${item.fontSize}px "${item.fontFamily}", sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    chars.forEach((ch, i) => {
      const tt = n === 1 ? 0 : (i/(n-1) - 0.5);
      const angle = tt * absSpan * direction;
      const x = radius * Math.sin(angle);
      const y = direction > 0 ? -radius*Math.cos(angle) : radius*Math.cos(angle) - radius;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle*direction);
      if(item.shadow){
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,.55)';
        ctx.shadowBlur = item.fontSize*0.1;
        ctx.shadowOffsetX = item.fontSize*0.05;
        ctx.shadowOffsetY = item.fontSize*0.06;
        if(item.outline){
          ctx.lineWidth = Math.max(1, item.fontSize*item.outlineWidth/100);
          ctx.strokeStyle = item.outlineColor;
          ctx.strokeText(ch, 0, 0);
        } else {
          ctx.fillStyle = item.color;
          ctx.fillText(ch, 0, 0);
        }
        ctx.restore(); // シャドウ設定を解除してから、くっきりした本体を重ね描きする
      }
      if(item.outline){
        ctx.lineWidth = Math.max(1, item.fontSize*item.outlineWidth/100);
        ctx.strokeStyle = item.outlineColor;
        ctx.strokeText(ch, 0, 0);
      }
      ctx.fillStyle = item.color;
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    });
  }

  function drawTextItem(ctx, item){
    ctx.save();
    const cx = item.x + item.w/2, cy = item.y + item.h/2;
    ctx.translate(cx, cy);
    ctx.rotate(item.rotation * Math.PI/180);
    if(item.bgColor){
      ctx.fillStyle = item.bgColor;
      ctx.fillRect(-item.w/2, -item.h/2, item.w, item.h);
    }
    if(item.arcEnabled && item.arc !== 0){
      drawArcTextInner(ctx, item);
      ctx.restore();
      return;
    }
    const style = item.italic ? 'italic ' : '';
    ctx.font = `${style}900 ${item.fontSize}px "${item.fontFamily}", "Hiragino Sans", sans-serif`;
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    const lineHeight = item.fontSize * 1.2;
    const lines = wrapText(ctx, item.text, item.w);
    const totalHeight = lines.length * lineHeight;
    let y = -totalHeight/2 + lineHeight/2;
    for(const line of lines){
      if(item.shadow){
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,.55)';
        ctx.shadowBlur = item.fontSize*0.1;
        ctx.shadowOffsetX = item.fontSize*0.05;
        ctx.shadowOffsetY = item.fontSize*0.06;
        if(item.outline){
          ctx.lineWidth = Math.max(1, item.fontSize*item.outlineWidth/100);
          ctx.strokeStyle = item.outlineColor;
          ctx.strokeText(line, 0, y);
        } else {
          ctx.fillStyle = item.color;
          ctx.fillText(line, 0, y);
        }
        ctx.restore(); // シャドウ設定を解除してから、くっきりした本体を重ね描きする
      }
      if(item.outline){
        ctx.lineWidth = Math.max(1, item.fontSize*item.outlineWidth/100);
        ctx.strokeStyle = item.outlineColor;
        ctx.strokeText(line, 0, y);
      }
      ctx.fillStyle = item.color;
      ctx.fillText(line, 0, y);
      y += lineHeight;
    }
    ctx.restore();
  }

  // ---- 画像の読み込みキャッシュ(表のセル画像などをcanvas書き出し時に再利用) ----
  const imageLoadCache = new Map();
  function loadImage(src){
    if(!src) return Promise.resolve(null);
    if(imageLoadCache.has(src)) return Promise.resolve(imageLoadCache.get(src));
    return new Promise(res => {
      const im = new Image();
      im.onload = () => { imageLoadCache.set(src, im); res(im); };
      im.onerror = () => res(null);
      im.src = src;
    });
  }

  // ---- ダウンロード ----
  downloadBtn.addEventListener('click', async () => {
    if(document.fonts && document.fonts.ready) await document.fonts.ready;
    for(const item of items){
      if(item.type === 'table'){
        item.cellImageEls = await Promise.all(item.cellImages.map(row => Promise.all(row.map(src => loadImage(src)))));
      }
    }
    const cv = document.createElement('canvas');
    cv.width = canvasW; cv.height = canvasH;
    const ctx = cv.getContext('2d');
    for(const item of items){
      if(item.type === 'image') drawImageItem(ctx, item);
      else if(item.type === 'text') drawTextItem(ctx, item);
      else if(item.type === 'table') drawTableItem(ctx, item);
      else if(item.type === 'line') drawLineItem(ctx, item);
      else if(item.type === 'shape') drawShapeItem(ctx, item);
    }
    if(drawLayerVisible) ctx.drawImage(drawLayer, 0, 0); // 手描きレイヤーは一番上に重ねる
    const blob = await new Promise(res => cv.toBlob(res, 'image/png'));
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'webcanvas.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  });

  // ---- 元に戻す / やり直す（履歴） ----
  let historyStack = [];
  let redoStack = [];
  let suppressHistory = false;

  function serializeState(){
    return {
      canvasW, canvasH,
      selectedIndex: items.findIndex(it => it.id === selectedId),
      drawDataUrl: drawLayer.width>0 ? drawLayer.toDataURL() : null,
      drawLayerVisible,
      hasDrawing,
      items: items.map(it => {
        if(it.type === 'image'){
          return { type:'image', x:it.x, y:it.y, w:it.w, h:it.h, rotation:it.rotation, src: it.img.src };
        }
        if(it.type === 'table'){
          return {
            type:'table', x:it.x, y:it.y, w:it.w, h:it.h, rotation:it.rotation,
            rows: it.rows, cols: it.cols, cells: it.cells.map(row => row.slice()),
            cellImages: it.cellImages.map(row => row.slice()),
            colWidths: it.colWidths.slice(), rowHeights: it.rowHeights.slice()
          };
        }
        if(it.type === 'line'){
          return { type:'line', x:it.x, y:it.y, w:it.w, h:it.h, rotation:it.rotation, color:it.color, strokeWidth:it.strokeWidth };
        }
        if(it.type === 'shape'){
          return {
            type:'shape', x:it.x, y:it.y, w:it.w, h:it.h, rotation:it.rotation,
            shapeType: it.shapeType, fillColor: it.fillColor, strokeColor: it.strokeColor, strokeWidth: it.strokeWidth,
            fillImageSrc: it.fillImage ? it.fillImage.src : null, shapeText: it.shapeText
          };
        }
        return {
          type:'text', x:it.x, y:it.y, w:it.w, h:it.h, rotation:it.rotation,
          text: it.text, fontSize: it.fontSize, fontFamily: it.fontFamily, color: it.color, bgColor: it.bgColor,
          outline: it.outline, outlineColor: it.outlineColor, outlineWidth: it.outlineWidth,
          shadow: it.shadow, italic: it.italic, arc: it.arc, arcEnabled: it.arcEnabled
        };
      })
    };
  }

  function pushHistory(){
    if(suppressHistory) return;
    historyStack.push(serializeState());
    if(historyStack.length > 60) historyStack.shift();
    redoStack = [];
    updateUndoRedoButtons();
  }

  function updateUndoRedoButtons(){
    undoBtn.disabled = historyStack.length < 2;
    redoBtn.disabled = redoStack.length === 0;
  }

  async function restoreState(snapshot){
    suppressHistory = true;
    items.slice().forEach(it => it.el.remove());
    items.length = 0;
    selectedId = null;

    canvasW = snapshot.canvasW; canvasH = snapshot.canvasH;
    canvasDimLabel.textContent = `${canvasW} × ${canvasH} px`;
    presetSelect.value = '';
    customSizeBox.classList.remove('show');
    layoutStage();

    if(snapshot.drawDataUrl){
      const dImg = await new Promise(res => { const im = new Image(); im.onload = () => res(im); im.src = snapshot.drawDataUrl; });
      drawCtx.clearRect(0, 0, drawLayer.width, drawLayer.height);
      drawCtx.drawImage(dImg, 0, 0);
    } else {
      drawCtx.clearRect(0, 0, drawLayer.width, drawLayer.height);
    }
    setDrawLayerVisible(snapshot.drawLayerVisible !== false);
    hasDrawing = !!snapshot.hasDrawing;

    // 画像は先に全部読み込んでから、元の順番どおりに要素を作る（非同期の順序ズレを防ぐ）
    const loaded = await Promise.all(snapshot.items.map(data => {
      if(data.type !== 'image') return Promise.resolve(null);
      return new Promise(res => { const im = new Image(); im.onload = () => res(im); im.src = data.src; });
    }));
    const loadedShapeFills = await Promise.all(snapshot.items.map(data => {
      if(data.type !== 'shape' || !data.fillImageSrc) return Promise.resolve(null);
      return new Promise(res => { const im = new Image(); im.onload = () => res(im); im.src = data.fillImageSrc; });
    }));

    snapshot.items.forEach((data, i) => {
      if(data.type === 'image'){
        createImageItem(loaded[i], data.x, data.y, data.w, data.h, { rotation:data.rotation, autoSelect:false, pushHist:false });
      } else if(data.type === 'table'){
        createTableItem(data.rows, data.cols, data.x, data.y, data.w, data.h, { rotation:data.rotation, cells:data.cells, cellImages:data.cellImages, colWidths:data.colWidths, rowHeights:data.rowHeights, autoSelect:false, pushHist:false });
      } else if(data.type === 'line'){
        createLineItem(data.x, data.y, data.w, data.h, { rotation:data.rotation, color:data.color, strokeWidth:data.strokeWidth, autoSelect:false, pushHist:false });
      } else if(data.type === 'shape'){
        createShapeItem(data.shapeType, data.x, data.y, data.w, data.h, {
          rotation:data.rotation, fillColor:data.fillColor, strokeColor:data.strokeColor, strokeWidth:data.strokeWidth,
          fillImage: loadedShapeFills[i], shapeText: data.shapeText, autoSelect:false, pushHist:false
        });
      } else {
        createTextItem(data.text, data.x, data.y, data.w, data.h, { ...data, autoSelect:false, pushHist:false });
      }
    });

    if(snapshot.selectedIndex != null && snapshot.selectedIndex >= 0 && items[snapshot.selectedIndex]){
      selectItem(items[snapshot.selectedIndex].id);
    } else {
      selectItem(null);
    }
    renderLayerList();
    suppressHistory = false;
  }

  function undo(){
    if(historyStack.length < 2) return;
    const current = historyStack.pop();
    redoStack.push(current);
    restoreState(historyStack[historyStack.length-1]);
    updateUndoRedoButtons();
  }
  function redo(){
    if(redoStack.length === 0) return;
    const next = redoStack.pop();
    historyStack.push(next);
    restoreState(next);
    updateUndoRedoButtons();
  }
  undoBtn.addEventListener('click', undo);
  redoBtn.addEventListener('click', redo);
  window.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    if((e.ctrlKey || e.metaKey) && key === 'z' && !e.shiftKey){ e.preventDefault(); undo(); }
    else if((e.ctrlKey || e.metaKey) && (key === 'y' || (key === 'z' && e.shiftKey))){ e.preventDefault(); redo(); }
    else if((key === 'delete' || key === 'backspace') && selectedId != null){
      const sel = getItem(selectedId);
      // テキスト編集中や、他の入力欄にフォーカスがある時は誤って要素ごと削除しないようにする
      const activeTag = document.activeElement && document.activeElement.tagName;
      const isEditingText = sel && sel.type === 'text' && sel.editing;
      const isTypingElsewhere = activeTag === 'INPUT' || activeTag === 'SELECT' || (document.activeElement && document.activeElement.isContentEditable);
      if(!isEditingText && !isTypingElsewhere){
        e.preventDefault();
        deleteItem(selectedId);
      }
    }
  });

  // ---- 初期化 ----
  setCanvasSize(canvasW, canvasH);
  renderLayerList();
  historyStack.push(serializeState());
  updateUndoRedoButtons();
})();
