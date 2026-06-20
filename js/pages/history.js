document.addEventListener('DOMContentLoaded', () => {

  // ===== 1. 四朝屏风手风琴交互 =====
  const panels = document.querySelectorAll('.dynasty-panel');
  const accordion = document.getElementById('dynastyAccordion');

  // 默认激活第一个（汉）
  if (panels.length) {
    panels[0].classList.add('active');
  }

  panels.forEach(panel => {
    // 悬停切换（桌面端）
    panel.addEventListener('mouseenter', function() {
      panels.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      // 更新背景色氛围（根据朝代）
      const era = this.dataset.era;
      document.querySelector('.dynasty-accordion-wrap').style.background = 
        era === 'han' ? '#1a1410' :
        era === 'tang' ? '#2c1810' :
        era === 'ming' ? '#1a1a2e' :
        '#2a1a1a';
    });

    // 点击“探秘”按钮：弹出 Lightbox（模拟轻提示）
    const exploreBtn = panel.querySelector('.btn-explore');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // 阻止冒泡，避免触发面板切换
        const era = this.dataset.era;
        const eraMap = {
          'han': '大汉豫章 · 海昏侯国遗址出土金器万余件，为汉代诸侯王墓之最。',
          'tang': '盛唐滕王阁 · 王勃即席赋《滕王阁序》，成千古绝唱。',
          'ming': '大明洪都 · 万寿宫为江右商帮精神灯塔，见证赣地百年繁华。',
          'modern': '八一南昌起义 · 1927年8月1日，人民军队在此诞生，星火燎原。'
        };
        alert(`📜 ${eraMap[era] || '探索千年豫章故事'}`);
        
        // 这里可以替换为调用 Lightbox 弹窗（assets/lib/lightbox/）
        // 例如：lightbox.open(`详细内容...`);
      });
    }
  });

  // ===== 2. 海昏侯 CoverFlow 轮播 =====
  new Swiper('.exhibition-swiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    loop: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    coverflowEffect: {
      rotate: 30,
      stretch: -80,
      depth: 150,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 'auto',
        coverflowEffect: { rotate: 25, stretch: -60, depth: 120 }
      },
      480: {
        slidesPerView: 1,
        coverflowEffect: { rotate: 0, stretch: 0, depth: 80 }
      }
    }
  });

  // ===== 3. Chart.js 国潮诗词图表 =====
  const ctx = document.getElementById('historyChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['汉', '唐', '宋', '明', '近代'],
        datasets: [{
          label: '咏南昌诗词数量',
          data: [8, 42, 26, 31, 15],
          borderColor: '#D4AF37',
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: '#C41E3A',
          pointBorderColor: '#D4AF37',
          pointBorderWidth: 2,
          pointRadius: 7,
          pointHoverRadius: 10,
          fill: true,
          tension: 0.3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: {
              color: '#D4AF37',
              font: { size: 14, family: 'Microsoft YaHei' },
              boxWidth: 12,
              padding: 20,
            }
          },
          tooltip: {
            backgroundColor: 'rgba(26, 20, 16, 0.9)',
            titleColor: '#D4AF37',
            bodyColor: '#fff',
            borderColor: '#D4AF37',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#b8a68b',
              font: { size: 14, family: '华文楷体, KaiTi, serif' },
            }
          },
          y: {
            grid: {
              color: 'rgba(212, 175, 55, 0.1)',
              drawBorder: false,
            },
            ticks: {
              color: '#b8a68b',
              stepSize: 10,
              font: { size: 12 },
            },
            beginAtZero: true,
          }
        },
        elements: {
          line: { borderJoinStyle: 'round' },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        }
      }
    });
  }

  // ===== 4. 滚动动态激活面板（增强体验：滚动到可见区域时自动激活对应的朝代） =====
  // 利用 Intersection Observer 在滚动到屏风区域时，根据视口位置自动激活最近的面板
  // 但为了不干扰用户手动悬停，仅在未悬停时生效，这里做简化：当屏风区域进入视口时激活第一个
  // 更复杂的逻辑可后续迭代

  // ===== 5. 给面板增加点击触控支持（移动端） =====
  if ('ontouchstart' in window) {
    panels.forEach(panel => {
      panel.addEventListener('click', function(e) {
        // 如果点击的是按钮，不触发切换（已在按钮事件中阻止冒泡）
        if (e.target.closest('.btn-explore')) return;
        panels.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

});