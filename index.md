---
layout: home
title: "HuXin"
permalink: /
# 极简风格首页：移除重复的站点标题，保留简介与文章列表
---

<header class="site-header--minimal" role="banner">
  <div class="site-brand">
    <!-- 不再放 H1，避免与主题自动输出的站点标题重复 -->
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
