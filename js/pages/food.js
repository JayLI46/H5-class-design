document.addEventListener('DOMContentLoaded', function() {

  // ============================================================
  // 菜品数据
  // ============================================================
  var dishes = [
    { id: 0, name: '南昌拌粉', sub: '南昌人的早餐灵魂', icon: '🍜' },
    { id: 1, name: '瓦罐汤', sub: '慢火煨出的赣味精华', icon: '🥣' },
    { id: 2, name: '藜蒿炒腊肉', sub: '春天的味道，赣菜经典', icon: '🥬' },
    { id: 3, name: '白糖糕', sub: '外酥里嫩的老南昌记忆', icon: '🍬' },
    { id: 4, name: '糊羹', sub: '浓稠暖胃的冬日宝藏', icon: '🥄' },
    { id: 5, name: '辣椒炒肉', sub: '赣菜之魂，下饭神器', icon: '🔥' },
    { id: 6, name: '三杯鸡', sub: '一杯一乾坤，赣菜名品', icon: '🐔' },
    { id: 7, name: '南昌炒粉', sub: '夜宵江湖的绝对主角', icon: '🍜' }
  ];

  var total = dishes.length;
  var currentIndex = 0;
  var isAnimating = false;

  // ============================================================
  // DOM 引用
  // ============================================================
  var track = document.getElementById('streetTrack');
  var scene = document.getElementById('streetScene');
  var dotsContainer = document.getElementById('streetDots');
  var countDisplay = document.getElementById('streetCount');
  var prevBtn = document.getElementById('streetPrev');
  var nextBtn = document.getElementById('streetNext');

  var detailCard = document.getElementById('detailCard');
  var detailOverlay = document.getElementById('detailOverlay');
  var detailSlides = document.querySelectorAll('.detail-slide');
  var closeButtons = document.querySelectorAll('.detail-close');

  // ============================================================
  // 渲染店铺（卡片图片直接引用HTML）
  // ============================================================
  function renderShops() {
    track.innerHTML = '';
    dotsContainer.innerHTML = '';

    dishes.forEach(function(dish, i) {
      var shop = document.createElement('div');
      shop.className = 'shop-item' + (i === 0 ? ' active' : '');
      shop.dataset.index = i;

      var inner = document.createElement('div');
      inner.className = 'shop-inner';

      // 图片（直接使用img标签）
      var imgWrap = document.createElement('div');
      imgWrap.className = 'shop-image';
      var img = document.createElement('img');
      img.src = '../assets/img/food/' + dish.name + '.jpg';
      img.alt = dish.name;
      img.onerror = function() {
        this.style.display = 'none';
        var noImg = document.createElement('div');
        noImg.className = 'no-img';
        noImg.textContent = dish.icon || '🍽️';
        imgWrap.appendChild(noImg);
      };
      imgWrap.appendChild(img);
      inner.appendChild(imgWrap);

      // 招牌
      var sign = document.createElement('div');
      sign.className = 'shop-sign';
      var signText = document.createElement('span');
      signText.className = 'shop-sign-text';
      signText.textContent = '『 ' + dish.name + ' 』';
      sign.appendChild(signText);
      inner.appendChild(sign);

      // 红灯笼
      var lan1 = document.createElement('span');
      lan1.className = 'shop-lantern left';
      lan1.textContent = '🏮';
      var lan2 = document.createElement('span');
      lan2.className = 'shop-lantern right';
      lan2.textContent = '🏮';
      inner.appendChild(lan1);
      inner.appendChild(lan2);

      // 蒸汽
      var steam = document.createElement('div');
      steam.className = 'shop-steam';
      for (var s = 0; s < 5; s++) {
        var p = document.createElement('div');
        p.className = 'steam-p';
        steam.appendChild(p);
      }
      inner.appendChild(steam);

      // 信息
      var info = document.createElement('div');
      info.className = 'shop-info';
      var name = document.createElement('div');
      name.className = 'shop-name';
      name.textContent = dish.name;
      var sub = document.createElement('div');
      sub.className = 'shop-sub';
      sub.textContent = dish.sub;
      info.appendChild(name);
      info.appendChild(sub);
      inner.appendChild(info);

      shop.appendChild(inner);
      track.appendChild(shop);

      shop.addEventListener('click', function(e) {
        e.stopPropagation();
        var idx = parseInt(this.dataset.index);
        selectShop(idx);
      });

      var dot = document.createElement('span');
      dot.className = 'street-dot' + (i === 0 ? ' active' : '');
      dot.dataset.index = i;
      dotsContainer.appendChild(dot);
    });

    updateUI(0);
  }

  // ============================================================
  // 更新 UI
  // ============================================================
  function updateUI(index) {
    var items = track.querySelectorAll('.shop-item');
    var dots = dotsContainer.querySelectorAll('.street-dot');

    items.forEach(function(item, i) {
      item.classList.toggle('active', i === index);
    });
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === index);
    });

    countDisplay.textContent = (index + 1) + ' / ' + total;
    currentIndex = index;
    scrollToShop(index);
  }

  // ============================================================
  // 滚动到指定店铺
  // ============================================================
  function scrollToShop(index) {
    if (isAnimating) return;
    var items = track.querySelectorAll('.shop-item');
    if (!items[index]) return;

    var itemWidth = items[index].offsetWidth + 20;
    var trackWidth = track.scrollWidth;
    var containerWidth = scene.offsetWidth;

    var targetScroll = index * itemWidth - (containerWidth - itemWidth) / 2;
    targetScroll = Math.max(0, Math.min(trackWidth - containerWidth, targetScroll));

    isAnimating = true;
    track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    track.style.transform = 'translateX(-' + targetScroll + 'px)';

    setTimeout(function() {
      isAnimating = false;
    }, 600);
  }

  // ============================================================
  // 选择店铺（切换预置卡片）
  // ============================================================
  function selectShop(index) {
    if (index === currentIndex) {
      openDetail(index);
      return;
    }
    updateUI(index);
    setTimeout(function() {
      openDetail(index);
    }, 600);
  }

  // ============================================================
  // 详情弹窗 - 切换预置卡片
  // ============================================================
  function openDetail(index) {
    // 隐藏所有卡片
    detailSlides.forEach(function(slide) {
      slide.style.display = 'none';
      slide.classList.remove('active');
    });

    // 显示对应卡片
    var target = document.querySelector('.detail-slide[data-index="' + index + '"]');
    if (target) {
      target.style.display = 'block';
      target.classList.add('active');
    }

    detailCard.classList.add('show');
    detailOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeDetail() {
    detailCard.classList.remove('show');
    detailOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  // 关闭按钮
  closeButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeDetail();
    });
  });

  detailOverlay.addEventListener('click', closeDetail);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeDetail();
  });

  // ============================================================
  // 拖拽滚动
  // ============================================================
  var isDraggingScene = false;
  var dragStartX = 0;
  var dragStartTransform = 0;

  scene.addEventListener('mousedown', function(e) {
    if (e.target.closest('.shop-item')) return;
    isDraggingScene = true;
    dragStartX = e.clientX;
    var match = track.style.transform.match(/translateX\(-([\d.]+)px\)/);
    dragStartTransform = match ? parseFloat(match[1]) : 0;
    track.style.transition = 'none';
    scene.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDraggingScene) return;
    var dx = (dragStartX - e.clientX);
    var newTransform = Math.max(0, dragStartTransform + dx);
    track.style.transform = 'translateX(-' + newTransform + 'px)';
  });

  document.addEventListener('mouseup', function() {
    if (isDraggingScene) {
      isDraggingScene = false;
      scene.style.cursor = 'default';
      track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      snapToNearest();
    }
  });

  scene.addEventListener('touchstart', function(e) {
    if (e.target.closest('.shop-item')) return;
    var touch = e.touches[0];
    isDraggingScene = true;
    dragStartX = touch.clientX;
    var match = track.style.transform.match(/translateX\(-([\d.]+)px\)/);
    dragStartTransform = match ? parseFloat(match[1]) : 0;
    track.style.transition = 'none';
  }, { passive: true });

  document.addEventListener('touchmove', function(e) {
    if (!isDraggingScene) return;
    var touch = e.touches[0];
    var dx = (dragStartX - touch.clientX);
    var newTransform = Math.max(0, dragStartTransform + dx);
    track.style.transform = 'translateX(-' + newTransform + 'px)';
  }, { passive: true });

  document.addEventListener('touchend', function() {
    if (isDraggingScene) {
      isDraggingScene = false;
      track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      snapToNearest();
    }
  }, { passive: true });

  // ============================================================
  // 吸附最近店铺
  // ============================================================
  function snapToNearest() {
    var items = track.querySelectorAll('.shop-item');
    if (!items.length) return;

    var containerWidth = scene.offsetWidth;
    var itemWidth = items[0].offsetWidth + 20;
    var match = track.style.transform.match(/translateX\(-([\d.]+)px\)/);
    var currentOffset = match ? parseFloat(match[1]) : 0;

    var nearestIndex = Math.round((currentOffset + containerWidth / 2 - itemWidth / 2) / itemWidth);
    nearestIndex = Math.max(0, Math.min(items.length - 1, nearestIndex));

    updateUI(nearestIndex);
  }

  // ============================================================
  // 按钮控制
  // ============================================================
  prevBtn.addEventListener('click', function() {
    var prev = (currentIndex - 1 + total) % total;
    selectShop(prev);
  });

  nextBtn.addEventListener('click', function() {
    var next = (currentIndex + 1) % total;
    selectShop(next);
  });

  // ============================================================
  // 键盘控制
  // ============================================================
  document.addEventListener('keydown', function(e) {
    if (detailCard.classList.contains('show')) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      var prev = (currentIndex - 1 + total) % total;
      selectShop(prev);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      var next = (currentIndex + 1) % total;
      selectShop(next);
    }
  });

  // ============================================================
  // 窗口变化重置
  // ============================================================
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      scrollToShop(currentIndex);
    }, 300);
  });

  // ============================================================
  // 初始化
  // ============================================================
  renderShops();

  console.log('🏮 烟火食集已加载！');
  console.log('💡 拖拽漫步长街 · 点击店铺品尝详情');
  console.log('⌨️ 键盘 ← → 切换店铺');
});