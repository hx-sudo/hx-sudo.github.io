---
layout: home
title: "HuXin"
permalink: /
# 极简风格首页：左上站点名 + 简短副标题，保持大量留白
---

<header class="site-header--minimal" role="banner">
  <div class="site-brand">
    <h1 class="site-title">HuXin</h1>
    <p class="site-subtitle">Welcome to my blog</p>
    <p class="site-link"><a href="https://github.com/hx-sudo" target="_blank">View My GitHub Profile</a></p>
  </div>

  <div class="site-topcenter">
    Hello, this is my site.
  </div>
</header>

<main class="site-main--minimal" role="main">
  <!-- 保留文章列表区，使用 minimal-mistakes 提供的片段渲染 -->
  <section class="home-cards">
    <h2>文章</h2>
    {% include home/featured-posts.html %}
  </section>
</main>

<footer class="site-footer--minimal" role="contentinfo">
  <small>Hosted on GitHub Pages — Theme by orderedlist</small>
</footer>
