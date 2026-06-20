document.addEventListener('DOMContentLoaded', function() {

  // ============================================================
  // 1. 墨滴粒子画布
  // ============================================================
  const canvas = document.getElementById('inkCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    const particles = [];
    const PARTICLE_COUNT = 48;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width || window.innerWidth;
      height = canvas.height = rect.height || window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class InkParticle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height * 0.2;
        this.size = 2 + Math.random() * 6;
        this.speed = 0.3 + Math.random() * 0.6;
        this.opacity = 0.1 + Math.random() * 0.3;
        this.drift = (Math.random() - 0.5) * 0.3;
        this.phase = Math.random() * Math.PI * 2;
      }
      update() {
        this.y += this.speed;
        this.x += Math.sin(this.phase + this.y * 0.005) * this.drift;
        this.phase += 0.01;
        if (this.y > height + 20) { this.reset(); this.y = -10; }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          this.x - this.size * 0.2, this.y - this.size * 0.2, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, 'rgba(196,30,58,' + (this.opacity * 0.6) + ')');
        gradient.addColorStop(0.5, 'rgba(196,30,58,' + (this.opacity * 0.3) + ')');
        gradient.addColorStop(1, 'rgba(196,30,58,0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new InkParticle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    var mouseX = width / 2;
    var mouseY = height / 2;
    document.addEventListener('mousemove', function(e) {
      var rect = canvas.parentElement.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var dx = p.x - mouseX;
        var dy = p.y - mouseY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          var force = (150 - dist) / 150 * 0.3;
          p.x += dx * force * 0.02;
          p.y += dy * force * 0.02;
        }
      }
    });
  }

  // ============================================================
  // 2. 时间轴滑条
  // ============================================================
  var track = document.getElementById('timelineTrack');
  var prevBtn = document.querySelector('.tl-prev');
  var nextBtn = document.querySelector('.tl-next');
  var dots = document.getElementById('tlDots');
  var currentSlide = 0;
  var totalSlides = 0;

  if (track) {
    var items = track.querySelectorAll('.timeline-item');
    totalSlides = items.length;

    if (dots) {
      dots.innerHTML = '';
      for (var i = 0; i < totalSlides; i++) {
        var dot = document.createElement('span');
        dot.className = 'tl-dot' + (i === 0 ? ' active' : '');
        dot.dataset.index = i;
        dot.addEventListener('click', function() {
          goToSlide(parseInt(this.dataset.index));
        });
        dots.appendChild(dot);
      }
    }

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentSlide = index;
      var itemWidth = items[0] ? items[0].offsetWidth : 170;
      var gap = 20;
      var offset = currentSlide * (itemWidth + gap);
      track.style.transform = 'translateX(-' + offset + 'px)';

      for (var i = 0; i < items.length; i++) {
        items[i].classList.toggle('active', i === currentSlide);
      }
      if (dots) {
        var dotEls = dots.querySelectorAll('.tl-dot');
        for (var j = 0; j < dotEls.length; j++) {
          dotEls[j].classList.toggle('active', j === currentSlide);
        }
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', function() { goToSlide(currentSlide - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { goToSlide(currentSlide + 1); });

    var touchStartX = 0;
    var touchEndX = 0;
    var slider = document.querySelector('.timeline-slider');
    if (slider) {
      slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      slider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) goToSlide(currentSlide + 1);
          else goToSlide(currentSlide - 1);
        }
      }, { passive: true });
    }

    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() { goToSlide(currentSlide); }, 200);
    });

    setTimeout(function() { goToSlide(0); }, 100);
  }

  // ============================================================
  // 3. 探访工坊按钮
  // ============================================================
  var workshopData = [
    { title: '南昌瓷板画', desc: '南昌瓷板画始于清末，以瓷为纸、以颜料为墨，经 1200°C 高温烧制而成。色彩经久不褪，历百年而如新。2008 年入选国家级非物质文化遗产名录。' },
    { title: '进贤文港毛笔', desc: '文港毛笔制作技艺已有 1600 余年历史。选料考究——以山羊、黄鼠狼、野兔等动物毫毛为材，经选料、水盆、修笔、刻字等 128 道工序精制而成。' },
    { title: '安义木雕', desc: '安义木雕源自唐宋，盛于明清。以樟木、楠木为主材，融合浮雕、透雕、圆雕等多种技法。图案多为龙凤呈祥、花鸟人物、戏曲故事。' },
    { title: '西山万寿宫庙会', desc: '西山万寿宫庙会源于东晋，为纪念许真君而设。每年农历八月初一至十五，数十万信众从四面八方汇聚西山，形成"朝仙"盛景。' },
    { title: '赣剧', desc: '赣剧由弋阳腔演变而来，是江西最具代表性的地方戏曲。唱腔高亢激越，表演粗犷豪放，素有"南戏活化石"之誉。' },
    { title: '南昌采茶戏', desc: '南昌采茶戏源自民间茶歌、灯彩，形成于清代。唱腔清亮婉转，表演生动诙谐，极富赣地乡土气息。' }
  ];

  var workshopBtns = document.querySelectorAll('.btn-workshop');
  for (var i = 0; i < workshopBtns.length; i++) {
    workshopBtns[i].addEventListener('click', function(e) {
      e.stopPropagation();
      var index = parseInt(this.dataset.index);
      var data = workshopData[index];
      if (!data) return;
      alert('🏮 ' + data.title + '\n\n' + data.desc + '\n\n（提示：此处可替换为 Lightbox 弹窗，展示高清组图与完整介绍）');
    });
  }

  // ============================================================
  // 4. 非遗小考
  // ============================================================
  var quizData = [
    {
      question: '南昌瓷板画是在什么材质上作画的？',
      options: ['A. 宣纸', 'B. 瓷板', 'C. 绢布', 'D. 木板'],
      correct: 1,
      feedback: '✅ 没错！南昌瓷板画以瓷板为"纸"，经高温烧制，色彩永不褪色。'
    },
    {
      question: '进贤文港镇被誉为"华夏笔都"，全国约多少比例的毛笔产自文港？',
      options: ['A. 30%', 'B. 50%', 'C. 70%', 'D. 90%'],
      correct: 2,
      feedback: '✅ 正确！文港毛笔占全国 70% 市场份额，年产量约 7 亿支。'
    },
    {
      question: '赣剧是由哪种声腔演变而来的？',
      options: ['A. 昆腔', 'B. 弋阳腔', 'C. 皮黄腔', 'D. 梆子腔'],
      correct: 1,
      feedback: '✅ 对的！赣剧由弋阳腔演变而来，被誉为"南戏活化石"。'
    }
  ];

  var container = document.getElementById('quizContainer');
  var resultDiv = document.getElementById('quizResult');
  var scoreSpan = document.getElementById('scoreNum');
  var resultMsg = document.getElementById('resultMsg');

  var quizAnswered = 0;
  var quizCorrect = 0;
  var quizLocked = false;

  function renderQuiz() {
    container.innerHTML = '';
    quizAnswered = 0;
    quizCorrect = 0;
    quizLocked = false;
    resultDiv.style.display = 'none';

    for (var i = 0; i < quizData.length; i++) {
      var q = quizData[i];
      var item = document.createElement('div');
      item.className = 'quiz-item';
      item.dataset.index = i;

      var question = document.createElement('div');
      question.className = 'quiz-question';
      question.textContent = (i + 1) + '. ' + q.question;

      var optionsDiv = document.createElement('div');
      optionsDiv.className = 'quiz-options';

      for (var j = 0; j < q.options.length; j++) {
        var optBtn = document.createElement('div');
        optBtn.className = 'quiz-option';
        optBtn.textContent = q.options[j];
        optBtn.dataset.optIndex = j;
        optBtn.addEventListener('click', function() {
          var qIdx = parseInt(this.closest('.quiz-item').dataset.index);
          var oIdx = parseInt(this.dataset.optIndex);
          handleAnswer(qIdx, oIdx, this);
        });
        optionsDiv.appendChild(optBtn);
      }

      var feedback = document.createElement('div');
      feedback.className = 'quiz-feedback';
      feedback.id = 'fb-' + i;

      item.appendChild(question);
      item.appendChild(optionsDiv);
      item.appendChild(feedback);
      container.appendChild(item);
    }
  }

  function handleAnswer(qIndex, selected, element) {
    if (quizLocked) return;
    var q = quizData[qIndex];
    var items = container.querySelectorAll('.quiz-item');
    var item = items[qIndex];
    var options = item.querySelectorAll('.quiz-option');
    var feedback = document.getElementById('fb-' + qIndex);

    if (options[0].classList.contains('disabled')) return;

    var isCorrect = selected === q.correct;

    for (var i = 0; i < options.length; i++) {
      options[i].classList.add('disabled');
    }

    if (isCorrect) {
      element.classList.add('selected-correct');
      item.classList.add('correct');
      quizCorrect++;
    } else {
      element.classList.add('selected-wrong');
      item.classList.add('wrong');
      options[q.correct].classList.add('show-correct');
    }

    feedback.textContent = q.feedback;
    feedback.className = 'quiz-feedback show ' + (isCorrect ? 'fb-correct' : 'fb-wrong');

    quizAnswered++;

    if (quizAnswered === quizData.length) {
      quizLocked = true;
      setTimeout(showResult, 600);
    }
  }

  function showResult() {
    resultDiv.style.display = 'block';
    scoreSpan.textContent = quizCorrect;

    var total = quizData.length;
    var ratio = quizCorrect / total;
    if (ratio === 1) {
      resultMsg.textContent = '🏆 满分！你是当之无愧的匠心传承人！';
    } else if (ratio >= 0.66) {
      resultMsg.textContent = '🌟 优秀！你对南昌非遗了解很深！';
    } else if (ratio >= 0.33) {
      resultMsg.textContent = '📖 不错！继续探索，你会了解更多！';
    } else {
      resultMsg.textContent = '💪 别灰心，非遗世界很大，慢慢探索吧！';
    }
  }

  document.getElementById('quizReset').addEventListener('click', renderQuiz);
  renderQuiz();

  // ============================================================
  // 5. 滚动时节点高亮
  // ============================================================
  var observer = new IntersectionObserver(function(entries) {
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      if (entry.isIntersecting) {
        var bead = entry.target.querySelector('.node-bead');
        if (bead) {
          bead.style.transition = 'all 0.6s ease';
          bead.style.boxShadow = '0 0 50px rgba(212, 175, 55, 0.6)';
          setTimeout(function() {
            bead.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.2)';
          }, 800);
        }
      }
    }
  }, { threshold: 0.3 });

  var nodes = document.querySelectorAll('.scroll-node');
  for (var k = 0; k < nodes.length; k++) {
    observer.observe(nodes[k]);
  }

});