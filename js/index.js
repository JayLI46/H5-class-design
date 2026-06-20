document.addEventListener('DOMContentLoaded', () => {
  // ========== 1. Banner 原生视差滚动 ==========
  const layers = document.querySelectorAll('.parallax-layer');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    layers.forEach((layer, idx) => {
      const speed = (idx + 1) * 0.18;
      layer.style.transform = `translateY(${scrollY * speed}px)`;
    })
  })

  // ========== 2. 核心：CoverFlow 3D立体三张轮播（自动右滑、中间放大前置遮挡两侧） ==========
  new Swiper('.intangible-swiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    coverflowEffect: {
      rotate: 25,       // 两侧图片旋转角度，立体蒙版
      stretch: -60,     // 两侧收缩，被中间遮挡
      depth: 120,       // 景深，中间图片前置
      modifier: 1,
      slideShadows: true, // 图片阴影增强立体蒙版
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    }
  })

  // 文创简易横向轮播
  new Swiper('.youth-swiper', {
    slidesPerView: 1,
    loop: true,
    autoplay: { delay: 2500 },
  })

// ========== 3. 地标标签切换逻辑 ==========
  const tabs = document.querySelectorAll('.tab-item');
  const ancient = document.querySelector('.ancient-list');
  const newcity = document.querySelector('.newcity-list');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const type = tab.dataset.type;
      if(type === 'ancient') {
        ancient.style.display = 'grid';
        newcity.style.display = 'none';
      } else {
        ancient.style.display = 'none';
        newcity.style.display = 'grid';
      }
    })
  })
  
  // ========== 5. 数据卡片立体按压效果 ==========
  const dataCards = document.querySelectorAll('.data-card');
  const MAX_ROTATE = 8; // 最大倾斜角度（度）
  
  dataCards.forEach(card => {
    // 鼠标移动时计算倾斜
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      // 计算鼠标相对于卡片中心的偏移比例（-0.5 ~ 0.5）
      const x = (e.clientX - rect.left) / rect.width - 0.5;   // 横向
      const y = (e.clientY - rect.top) / rect.height - 0.5;    // 纵向
  
      // 根据偏移量计算旋转角度（负值：上/左倾斜，正值：下/右倾斜）
      // 注意：rotateX 绕X轴旋转，正值使卡片上边沿向后（向下倾斜），负值向上倾斜
      // 为了产生“按压”凹陷感，鼠标位置应该向内陷，即卡片表面朝向鼠标方向倾斜
      // 所以当鼠标在下方时，卡片应向前倾斜（底部翘起），即 rotateX 为负？通常逻辑：
      // 鼠标在左边 → 绕Y轴负方向旋转（左边向后），看起来左边被按压
      // 更直观：鼠标移动方向，卡片对应边沿向鼠标方向下沉
      // 常见效果：rotateX( (y) * 角度 )，鼠标在上方，卡片上边沿下沉（rotateX负值？）
      // 我们采用常规：鼠标在上方，卡片上方远离，下方靠近——即 rotateX 为负（上边沿向后）
      // 但是用户要求"向内倾斜塌陷"，即卡片表面向鼠标位置凹陷，意味着鼠标位置作为凹陷中心，
      // 应该让卡片以鼠标位置为支点，周边翘起。但实际3D变换无法做到局部凹陷，只能整体倾斜。
      // 折中方案：使卡片整体倾斜，让鼠标位置看起来是"按压"的中心，倾斜方向使中心区域相对突出？
      // 更常见的"跟随鼠标3D翻转"效果：卡片跟随鼠标旋转，使得鼠标位置始终正对视线。
      // 这样看上去就像卡片被按压向鼠标方向。所以我们采用标准跟随翻转：
      // 当鼠标在卡片上半部分，卡片上边沿向后（rotateX负），使上半部分远离观察者，看起来被按下。
      // 我们使用：rotateX = -y * MAX_ROTATE， rotateY = x * MAX_ROTATE
      // 这样鼠标位置会显得"凹陷"，因为该区域被压向屏幕内。
      const rotateX = -y * MAX_ROTATE;
      const rotateY = x * MAX_ROTATE;
      this.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      // 动态阴影（可选）：根据倾斜程度增加阴影偏移
      const shadowX = x * 6; // 阴影水平偏移跟随鼠标
      const shadowY = y * 6;
      this.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(0,0,0,0.4)`;
    });
  
    // 鼠标离开时恢复平坦
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'rotateX(0deg) rotateY(0deg)';
      this.style.boxShadow = ''; // 恢复默认
    });
  });
  
})

// 放在index.js地标标签切换逻辑后面
// 随机倾斜角度，范围-2.5度到+2.5度
document.querySelectorAll('.scenic-card').forEach(card => {
  const randomRotate = (Math.random() - 0.5) * 5;
  card.style.transform = `rotate(${randomRotate}deg)`;
})

// ========== 4. 美食卡片随机形状+随机跳动 ==========
document.addEventListener('DOMContentLoaded', () => {
  const foodCards = document.querySelectorAll('.food-card');
  const shapes = ['shape-1', 'shape-2', 'shape-3', 'shape-4', 'shape-5', 'shape-6'];

  foodCards.forEach((card, index) => {
    // 随机分配形状
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    card.classList.add(randomShape);

    // 随机跳动参数：时长1.8-2.5秒，延迟0-1秒
    const randomDuration = 1.8 + Math.random() * 0.7;
    const randomDelay = index * 0.2 + Math.random() * 0.5;

    // 用CSS变量设置，不影响hover效果
    card.style.setProperty('--bounce-duration', `${randomDuration}s`);
    card.style.setProperty('--bounce-delay', `${randomDelay}s`);
  });
})