document.addEventListener('DOMContentLoaded', () => {
  // 1. 主题切换 明暗模式
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;
  // 读取本地存储
  const darkMode = localStorage.getItem('darkMode');
  if(darkMode === 'on') html.classList.add('dark');
  themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    if(html.classList.contains('dark')) {
      localStorage.setItem('darkMode','on');
    } else {
      localStorage.setItem('darkMode','off');
    }
  })

  // 2. 移动端抽屉菜单
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.drawer-close');
  const mask = document.querySelector('.drawer-mask');
  function openMenu(){
    drawer.classList.add('open');
    mask.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu(){
    drawer.classList.remove('open');
    mask.classList.remove('open');
    document.body.style.overflow = '';
  }
  menuBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  mask.addEventListener('click', closeMenu);

  // 3. 搜索弹窗
  const searchBtn = document.querySelector('.search-btn');
  const searchPopup = document.querySelector('.search-popup');
  searchBtn.addEventListener('click', (e)=>{
    e.stopPropagation();
    searchPopup.classList.toggle('show');
  })
  document.addEventListener('click', (e)=>{
    if(!searchPopup.contains(e.target) && e.target !== searchBtn){
      searchPopup.classList.remove('show');
    }
  })
  // 搜索提交简易逻辑
  const searchSubmit = document.querySelector('.search-submit');
  const searchInput = document.querySelector('.search-input');
  searchSubmit.addEventListener('click', ()=>{
    const val = searchInput.value.trim();
    if(val) alert(`正在搜索：${val}`);
  })

  // 4. 返回顶部按钮
  const backTop = document.querySelector('.back-top-btn');
  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 500){
      backTop.style.display = 'block';
    }else{
      backTop.style.display = 'none';
    }
  })
  backTop.addEventListener('click', ()=>{
    window.scrollTo({top:0, behavior:'smooth'});
  })

  // 5. 分享弹窗 + 复制链接
  const shareBtn = document.querySelector('.share-btn');
  const sharePopup = document.querySelector('.share-popup');
  const copyLink = document.querySelector('.copy-link');
  shareBtn.addEventListener('click', (e)=>{
    e.stopPropagation();
    sharePopup.classList.toggle('show');
  })
  document.addEventListener('click', (e)=>{
    if(!sharePopup.contains(e.target) && e.target !== shareBtn){
      sharePopup.classList.remove('show');
    }
  })
  copyLink.addEventListener('click', async ()=>{
    await navigator.clipboard.writeText(window.location.href);
    alert('链接已复制！');
  })

  // 6. 导航当前页面高亮
  const navLinks = document.querySelectorAll('.nav-item');
  const pageName = window.location.pathname.split('/').pop();
  navLinks.forEach(link=>{
    const href = link.getAttribute('href');
    if(href === pageName) link.classList.add('active');
  })
})

// ========== 背景音乐自动播放优化 ==========
document.addEventListener('DOMContentLoaded', () => {
  const musicBtn = document.getElementById('musicBtn');
  const bgMusic = document.getElementById('bgMusic');
  bgMusic.volume = 0.6;
  let isPlaying = false;
  let autoPlayTriggered = false;

  // 点击按钮切换播放/暂停
  musicBtn.addEventListener('click', () => {
    toggleMusic();
  })

  // 页面任意点击触发自动播放（绕过浏览器限制）
  document.addEventListener('click', () => {
    if(!autoPlayTriggered){
      autoPlayTriggered = true;
      bgMusic.play().then(()=>{
        isPlaying = true;
        musicBtn.classList.add('playing');
        musicBtn.querySelector('.music-icon').textContent = '⏸️';
      }).catch(e=>{
        console.log("音频播放失败：",e);
      })
    }
  },{once:true}) // 只触发一次

  // 封装播放切换函数
  function toggleMusic(){
    if(isPlaying) {
      bgMusic.pause();
      musicBtn.classList.remove('playing');
      musicBtn.querySelector('.music-icon').textContent = '🎵';
    } else {
      bgMusic.play();
      musicBtn.classList.add('playing');
      musicBtn.querySelector('.music-icon').textContent = '⏸️';
    }
    isPlaying = !isPlaying;
  }
})