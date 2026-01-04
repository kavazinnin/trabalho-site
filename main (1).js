// Interações principais: nav toggle, preencher anos e carregar notícias
(function(){
  // DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function(){
    const year = new Date().getFullYear();
    ['year','yearAbout','yearCourses','yearNews','yearContact'].forEach(id=>{
      const el = document.getElementById(id); if(el) el.textContent = year;
    });

    // Nav toggle
    const navToggle = document.getElementById('navToggle') || document.querySelector('.nav-toggle');
    const mainNav = document.getElementById('mainNav');
    if(navToggle){
      navToggle.addEventListener('click', function(){
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        if(mainNav) mainNav.classList.toggle('show');
      });
    }

    // Fecha nav ao clicar fora (mobile)
    document.addEventListener('click', function(e){
      if(window.innerWidth < 900){
        if(mainNav && !mainNav.contains(e.target) && !navToggle.contains(e.target)){
          mainNav.classList.remove('show');
          if(navToggle) navToggle.setAttribute('aria-expanded','false');
        }
      }
    });

    // Carrega notícias (data/news.json)
    fetch('data/news.json')
      .then(r=> r.ok ? r.json() : Promise.reject(r.statusText))
      .then(data=>{
        const preview = document.getElementById('newsPreview');
        const list = document.getElementById('newsList');
        const target = preview || list;
        if(!target) return;
        target.innerHTML = '';
        (data.articles || data).slice(0,6).forEach(item=>{
          const el = document.createElement('article');
          el.className = 'card news-card';
          const date = item.date ? `<p class="meta">${item.date}</p>` : '';
          el.innerHTML = `<h3>${item.title}</h3>${date}<p>${item.summary || item.text || ''}</p><p><a href="${item.url||'#'}" class="link">Leia mais</a></p>`;
          target.appendChild(el);
        });
      })
      .catch(err=>{
        console.warn('Não foi possível carregar notícias:', err);
        const target = document.getElementById('newsPreview') || document.getElementById('newsList');
        if(target) target.innerHTML = '<p>Não foi possível carregar as notícias no momento.</p>';
      });
  });
})();
