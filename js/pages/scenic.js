document.addEventListener('DOMContentLoaded', function() {

  // ============================================================
  // 集章数据
  // ============================================================
  var total = 6;
  var discovered = [];

  // ============================================================
  // DOM 引用
  // ============================================================
  var pins = document.querySelectorAll('.map-pin');
  var stampFill = document.getElementById('stampFill');
  var stampCount = document.getElementById('stampCount');
  var stampIcons = document.getElementById('stampIcons');
  var popupCard = document.getElementById('popupCard');
  var popupOverlay = document.getElementById('popupOverlay');
  var popupSlides = document.querySelectorAll('.popup-slide');
  var closeButtons = document.querySelectorAll('.popup-close');

  // ============================================================
  // 集章系统
  // ============================================================
  function updateStampUI() {
    var count = discovered.length;
    var percent = (count / total) * 100;
    stampFill.style.width = percent + '%';
    stampCount.textContent = '已探索 ' + count + ' / ' + total;

    var slots = stampIcons.querySelectorAll('.stamp-slot');
    slots.forEach(function(slot, i) {
      if (discovered.includes(i)) {
        slot.textContent = '✅';
        slot.classList.add('collected');
      } else {
        slot.textContent = '⬜';
        slot.classList.remove('collected');
      }
    });

    pins.forEach(function(pin, i) {
      if (discovered.includes(i)) {
        pin.classList.add('discovered');
      } else {
        pin.classList.remove('discovered');
      }
    });
  }

  function discoverLandmark(index) {
    if (discovered.includes(index)) return;
    discovered.push(index);
    updateStampUI();

    var slot = stampIcons.querySelectorAll('.stamp-slot')[index];
    if (slot) {
      slot.style.animation = 'none';
      setTimeout(function() {
        slot.style.animation = 'stampPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards';
      }, 10);
    }
  }

  // ============================================================
  // 弹出卡片控制（切换显示预置卡片）
  // ============================================================
  function openPopup(index) {
    // 集章
    discoverLandmark(index);

    // 隐藏所有卡片
    popupSlides.forEach(function(slide) {
      slide.style.display = 'none';
    });

    // 显示对应卡片
    var target = document.querySelector('.popup-slide[data-index="' + index + '"]');
    if (target) {
      target.style.display = 'block';
    }

    // 更新该卡片的印章状态
    var badge = document.getElementById('stamp' + index);
    if (badge) {
      if (discovered.includes(index)) {
        badge.textContent = '🏮 已集章 · ' + discovered.length + '/' + total;
        badge.className = 'stamp-badge collected';
      } else {
        badge.textContent = '⬜ 未探索';
        badge.className = 'stamp-badge';
      }
    }

    popupCard.classList.add('show');
    popupOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    popupCard.classList.remove('show');
    popupOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  // ============================================================
  // 事件绑定
  // ============================================================
  pins.forEach(function(pin, index) {
    pin.addEventListener('click', function(e) {
      e.stopPropagation();
      openPopup(index);
    });
  });

  closeButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      closePopup();
    });
  });

  popupOverlay.addEventListener('click', closePopup);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closePopup();
  });

  // ============================================================
  // 地图缩放与拖拽
  // ============================================================
  var mapCanvas = document.getElementById('mapCanvas');
  var currentZoom = 1;
  var zoomIn = document.getElementById('zoomIn');
  var zoomOut = document.getElementById('zoomOut');
  var zoomReset = document.getElementById('zoomReset');

  function setZoom(level) {
    currentZoom = Math.max(0.6, Math.min(1.4, level));
    mapCanvas.style.transform = 'scale(' + currentZoom + ')';
    mapCanvas.style.transformOrigin = 'center center';
  }

  if (zoomIn) {
    zoomIn.addEventListener('click', function(e) {
      e.stopPropagation();
      setZoom(currentZoom + 0.1);
    });
  }
  if (zoomOut) {
    zoomOut.addEventListener('click', function(e) {
      e.stopPropagation();
      setZoom(currentZoom - 0.1);
    });
  }
  if (zoomReset) {
    zoomReset.addEventListener('click', function(e) {
      e.stopPropagation();
      setZoom(1);
    });
  }

  mapCanvas.addEventListener('wheel', function(e) {
    e.preventDefault();
    var delta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoom(currentZoom + delta);
  }, { passive: false });

  // 拖拽
  var isPanning = false;
  var startX, startY;
  var translateX = 0, translateY = 0;

  mapCanvas.addEventListener('mousedown', function(e) {
    if (e.target.closest('.map-pin') || e.target.closest('.map-controls')) return;
    isPanning = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    mapCanvas.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', function(e) {
    if (!isPanning) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    mapCanvas.style.transform = 'scale(' + currentZoom + ') translate(' + (translateX / currentZoom) + 'px, ' + (translateY / currentZoom) + 'px)';
  });

  document.addEventListener('mouseup', function() {
    isPanning = false;
    mapCanvas.style.cursor = 'default';
  });

  // 触摸拖拽
  var touchStartX = 0, touchStartY = 0;
  var touchTranslateX = 0, touchTranslateY = 0;
  var isTouching = false;

  mapCanvas.addEventListener('touchstart', function(e) {
    if (e.target.closest('.map-pin') || e.target.closest('.map-controls')) return;
    var touch = e.touches[0];
    isTouching = true;
    touchStartX = touch.clientX - touchTranslateX;
    touchStartY = touch.clientY - touchTranslateY;
  }, { passive: true });

  mapCanvas.addEventListener('touchmove', function(e) {
    if (!isTouching) return;
    var touch = e.touches[0];
    touchTranslateX = touch.clientX - touchStartX;
    touchTranslateY = touch.clientY - touchStartY;
    mapCanvas.style.transform = 'scale(' + currentZoom + ') translate(' + (touchTranslateX / currentZoom) + 'px, ' + (touchTranslateY / currentZoom) + 'px)';
  }, { passive: true });

  mapCanvas.addEventListener('touchend', function() {
    isTouching = false;
  }, { passive: true });

  // ============================================================
  // 初始化
  // ============================================================
  updateStampUI();
  var randomIndex = Math.floor(Math.random() * total);
  discoverLandmark(randomIndex);

  console.log('🗺️ 城市拼图已加载！');
  console.log('💡 点击地图上的发光点位探索地标，收集印章！');
  console.log('🔍 已发现 ' + discovered.length + ' / ' + total + ' 个地标');
});