<template>
  <div v-if="isLocked && !isUnlocked" class="lock-container">
    <div class="lock-box">
      <h1>访问验证</h1>
      <p class="lock-description">此导航站已开启访问保护</p>
      <form @submit.prevent="handleUnlock">
        <div class="form-group">
          <label for="unlock-password">请输入访问密码</label>
          <input
            id="unlock-password"
            v-model="unlockPassword"
            type="password"
            placeholder="请输入访问密码"
            required
            class="form-input"
          />
        </div>
        <button type="submit" class="unlock-btn" :disabled="unlocking">
          {{ unlocking ? '验证中...' : '进入导航' }}
        </button>
      </form>
      <p v-if="unlockError" class="error-message">
        {{ unlockError }}
      </p>
    </div>
  </div>

  <div v-else class="nav-home">
    <aside class="sidebar">
      <div class="logo-section">
        <img src="/logo.png" alt="logo" class="logo" />
        <h1 class="site-title">{{ title || 'HZ路标' }}</h1>
      </div>

      <nav class="category-nav">
        <h2 class="nav-title">分类导航</h2>
        <ul class="category-list">
          <li
            v-for="category in categories"
            :key="category.id"
            class="category-item"
            @click="scrollToCategory(category.id)"
          >
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-name">{{ category.name }}</span>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <a
          href="https://github.com/maodeyu180/mao_nav"
          target="_blank"
          rel="noopener noreferrer"
          class="github-link"
          title="GitHub"
          aria-label="GitHub"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.373 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9 23.126 9 22.81V20.576C5.662 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.545 16.659 3.717 16.674 3.717 16.674C4.921 16.758 5.556 17.911 5.556 17.911C6.626 19.745 8.363 19.215 9.048 18.908C9.155 18.133 9.466 17.603 9.81 17.304C7.145 16.999 4.343 15.97 4.343 11.373C4.343 10.062 4.812 8.992 5.579 8.152C5.455 7.849 5.044 6.628 5.696 4.976C5.696 4.976 6.704 4.654 8.997 6.206C9.954 5.94 10.98 5.807 12 5.802C13.02 5.807 14.047 5.94 15.003 6.206C17.294 4.654 18.301 4.976 18.301 4.976C18.954 6.629 18.543 7.85 18.419 8.152C19.188 8.992 19.657 10.062 19.657 11.373C19.657 15.982 16.85 16.997 14.177 17.294C14.607 17.666 15 18.396 15 19.516V22.81C15 23.129 15.192 23.506 15.801 23.386C20.566 21.797 24 17.301 24 12C24 5.373 18.627 0 12 0Z" />
          </svg>
        </a>
      </div>
    </aside>

    <main class="main-content">
      <header class="search-header">
        <div class="search-shell">
          <div class="search-container">
            <div class="search-engine-selector">
              <img :src="searchEngines[selectedEngine].icon" :alt="selectedEngine" class="engine-logo" />
              <select v-model="selectedEngine" class="engine-select" aria-label="选择搜索引擎">
                <option value="google">Google</option>
                <option value="baidu">Baidu</option>
                <option value="bing">Bing</option>
                <option value="duckduckgo">DuckDuckGo</option>
              </select>
            </div>

            <div class="search-input-wrapper">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="searchEngines[selectedEngine].placeholder"
                class="search-input"
                @focus="handleSearchFocus"
                @blur="handleSearchBlur"
                @keyup.enter="handleSearch"
              />

              <transition name="search-panel">
                <div v-if="shouldShowLocalResults" class="local-search-results">
                  <template v-if="localSearchResults.length">
                    <button
                      v-for="site in localSearchResults"
                      :key="site.id"
                      type="button"
                      class="local-search-item"
                      @mousedown.prevent="openLocalResult(site)"
                    >
                      <span class="local-search-item-name">{{ site.name }}</span>
                      <span class="local-search-item-meta">
                        {{ site.categoryName }}<span v-if="site.description"> · {{ site.description }}</span>
                      </span>
                    </button>
                  </template>

                  <p v-else class="local-search-empty">
                    未命中站内站点，回车后将使用 {{ searchEngines[selectedEngine].label }} 搜索
                  </p>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <button
          class="theme-toggle-btn"
          :title="themeStore.isDarkMode ? '切换到浅色模式' : '切换到深色模式'"
          @click="themeStore.toggleTheme"
        >
          <svg v-if="!themeStore.isDarkMode" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 18C8.686 18 6 15.314 6 12S8.686 6 12 6S18 8.686 18 12S15.314 18 12 18ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.515 4.929L4.929 3.515L7.05 5.636L5.636 7.05L3.515 4.929ZM16.95 18.364L18.364 16.95L20.485 19.071L19.071 20.485L16.95 18.364ZM19.071 3.515L20.485 4.929L18.364 7.05L16.95 5.636L19.071 3.515ZM5.636 16.95L7.05 18.364L4.929 20.485L3.515 19.071L5.636 16.95ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z" />
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M10 7C10 10.866 13.134 14 17 14C18.958 14 20.729 13.196 22 11.9C22 11.933 22 11.967 22 12C22 17.523 17.523 22 12 22S2 17.523 2 12S6.477 2 12 2C12.033 2 12.067 2 12.101 2C10.804 3.271 10 5.042 10 7ZM4 12C4 16.418 7.582 20 12 20C15.058 20 17.716 18.284 19.062 15.762C18.395 15.919 17.704 16 17 16C12.029 16 8 11.971 8 7C8 6.296 8.081 5.605 8.238 4.938C5.716 6.284 4 8.942 4 12Z" />
          </svg>
        </button>

        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>

        <div class="mobile-menu" :class="{ active: showMobileMenu }">
          <div class="mobile-menu-header">
            <div class="header-left">
              <h3>分类导航</h3>
              <img :src="githubLogo" alt="GitHub" class="header-github-icon" @click="openGitHub" />
            </div>
            <button class="close-btn" @click="closeMobileMenu">×</button>
          </div>

          <ul class="mobile-category-list">
            <li
              v-for="category in categories"
              :key="category.id"
              class="mobile-category-item"
              @click="scrollToCategoryMobile(category.id)"
            >
              <span class="category-icon">{{ category.icon }}</span>
              <span class="category-name">{{ category.name }}</span>
            </li>
          </ul>
        </div>

        <div class="mobile-menu-overlay" :class="{ active: showMobileMenu }" @click="closeMobileMenu"></div>
      </header>

      <div class="content-area">
        <div v-if="loading" class="state-block">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="error" class="state-block">
          <p>{{ error }}</p>
          <button class="retry-btn" @click="fetchCategories">重试</button>
        </div>

        <div v-else class="categories-container">
          <section
            v-for="category in categories"
            :id="`category-${category.id}`"
            :key="category.id"
            class="category-section"
          >
            <h2 class="category-title">
              <span class="category-icon">{{ category.icon }}</span>
              <span class="category-name">{{ category.name }}</span>
            </h2>

            <div class="sites-grid">
              <a
                v-for="site in category.sites"
                :key="site.id"
                :href="site.url"
                target="_blank"
                rel="noopener noreferrer"
                class="site-card"
              >
                <div class="site-icon">
                  <img :src="site.icon" :alt="site.name" @error="handleImageError" />
                </div>
                <div class="site-info">
                  <h3 class="site-name">{{ site.name }}</h3>
                  <p class="site-description">{{ site.description || site.url }}</p>
                </div>
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useNavigation } from '@/apis/useNavigation.js'
import { useThemeStore } from '@/stores/counter.js'
import googleLogo from '@/assets/goolge.png'
import baiduLogo from '@/assets/baidu.png'
import bingLogo from '@/assets/bing.png'
import duckLogo from '@/assets/duck.png'
import githubLogo from '@/assets/github.png'

const { categories, title, defaultSearchEngine, loading, error, fetchCategories } = useNavigation()
const themeStore = useThemeStore()

const searchQuery = ref('')
const selectedEngine = ref('bing')
const showMobileMenu = ref(false)
const isLocked = ref(false)
const isUnlocked = ref(false)
const unlockPassword = ref('')
const unlocking = ref(false)
const unlockError = ref('')
const isSearchFocused = ref(false)

let searchBlurTimer = null

const searchEngines = {
  google: {
    label: 'Google',
    url: 'https://www.google.com/search?q=',
    icon: googleLogo,
    placeholder: '输入站点名，优先搜索本站内容',
  },
  baidu: {
    label: 'Baidu',
    url: 'https://www.baidu.com/s?wd=',
    icon: baiduLogo,
    placeholder: '输入站点名，优先搜索本站内容',
  },
  bing: {
    label: 'Bing',
    url: 'https://www.bing.com/search?q=',
    icon: bingLogo,
    placeholder: '输入站点名，优先搜索本站内容',
  },
  duckduckgo: {
    label: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=',
    icon: duckLogo,
    placeholder: '输入站点名，优先搜索本站内容',
  },
}

const normalizeText = (value = '') => String(value).trim().toLowerCase()

const getSiteKeywords = (site) => {
  if (Array.isArray(site.keywords)) {
    return site.keywords
  }

  if (typeof site.keywords === 'string') {
    return site.keywords
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

const getLocalMatchScore = (site, rawQuery) => {
  const query = normalizeText(rawQuery)
  if (!query) return 0

  const name = normalizeText(site.name)
  const description = normalizeText(site.description)
  const url = normalizeText(site.url)
  const keywords = getSiteKeywords(site).map(normalizeText)

  let score = 0

  if (name === query) score += 1000
  else if (name.startsWith(query)) score += 800
  else if (name.includes(query)) score += 600

  for (const keyword of keywords) {
    if (keyword === query) score += 500
    else if (keyword.startsWith(query)) score += 350
    else if (keyword.includes(query)) score += 250
  }

  if (description.includes(query)) score += 120
  if (url.includes(query)) score += 80

  return score
}

const localSiteIndex = computed(() =>
  categories.value.flatMap((category) =>
    (category.sites || []).map((site) => ({
      ...site,
      categoryId: category.id,
      categoryName: category.name,
    })),
  ),
)

const localSearchResults = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return []

  return localSiteIndex.value
    .map((site) => ({
      ...site,
      score: getLocalMatchScore(site, query),
    }))
    .filter((site) => site.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score
      return left.name.length - right.name.length
    })
    .slice(0, 8)
})

const shouldShowLocalResults = computed(
  () => isSearchFocused.value && searchQuery.value.trim().length > 0,
)

const smoothScrollTo = (container, targetTop, duration = 520) => {
  const startTop = container.scrollTop
  const distance = targetTop - startTop
  let startTime = null

  const animateScroll = (currentTime) => {
    if (startTime === null) startTime = currentTime
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)

    container.scrollTop = startTop + distance * eased

    if (progress < 1) {
      requestAnimationFrame(animateScroll)
    }
  }

  requestAnimationFrame(animateScroll)
}

const scrollToCategory = (categoryId) => {
  const element = document.getElementById(`category-${categoryId}`)
  const container = document.querySelector('.content-area')

  if (!element || !container) return

  const isMobile = window.innerWidth <= 768
  const offset = isMobile ? 92 : 28
  smoothScrollTo(container, Math.max(0, element.offsetTop - offset))
}

const checkLockStatus = () => {
  const openLock = import.meta.env.VITE_OPEN_LOCK

  if (openLock && openLock.trim() !== '') {
    isLocked.value = true
    isUnlocked.value = localStorage.getItem('nav_unlocked') === 'true'
    return
  }

  isLocked.value = false
  isUnlocked.value = true
}

const handleUnlock = async () => {
  unlocking.value = true
  unlockError.value = ''

  try {
    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: unlockPassword.value }),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || '访问密码错误，请重新输入')
    }

    isUnlocked.value = true
    localStorage.setItem('nav_unlocked', 'true')
    unlockPassword.value = ''
  } catch (currentError) {
    unlockError.value = currentError instanceof Error ? currentError.message : '解锁失败，请稍后重试'
  } finally {
    unlocking.value = false
  }
}

const runWebSearch = (query) => {
  const engine = searchEngines[selectedEngine.value]
  const url = engine.url + encodeURIComponent(query)
  window.open(url, '_blank')
}

const openLocalResult = (site) => {
  window.open(site.url, '_blank')
  searchQuery.value = ''
  isSearchFocused.value = false
}

const handleSearchFocus = () => {
  if (searchBlurTimer) {
    clearTimeout(searchBlurTimer)
    searchBlurTimer = null
  }

  isSearchFocused.value = true
}

const handleSearchBlur = () => {
  searchBlurTimer = window.setTimeout(() => {
    isSearchFocused.value = false
    searchBlurTimer = null
  }, 120)
}

const handleSearch = () => {
  const query = searchQuery.value.trim()
  if (!query) return

  const [firstMatch] = localSearchResults.value
  if (firstMatch) {
    openLocalResult(firstMatch)
    return
  }

  runWebSearch(query)
}

const handleImageError = (event) => {
  event.target.src = '/favicon.ico'
  event.target.onerror = null
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  document.body.style.overflow = showMobileMenu.value ? 'hidden' : ''
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
  document.body.style.overflow = ''
}

const scrollToCategoryMobile = (categoryId) => {
  closeMobileMenu()
  setTimeout(() => scrollToCategory(categoryId), 180)
}

const openGitHub = () => {
  window.open('https://github.com/maodeyu180/mao_nav', '_blank')
}

onMounted(async () => {
  checkLockStatus()
  await fetchCategories()
  selectedEngine.value = defaultSearchEngine.value
})

onUnmounted(() => {
  document.body.style.overflow = ''

  if (searchBlurTimer) {
    clearTimeout(searchBlurTimer)
  }
})
</script>

<style scoped>
.nav-home {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(34, 197, 94, 0.08), transparent 30%),
    linear-gradient(180deg, #f7fafc 0%, #eef3f8 100%);
}

.sidebar {
  width: 280px;
  height: 100vh;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  overflow: hidden;
  background: linear-gradient(180deg, #213043 0%, #182334 100%);
  color: #fff;
  box-shadow: 2px 0 18px rgba(15, 23, 42, 0.12);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 20px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.24);
}

.site-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.category-nav {
  flex: 1;
  overflow: hidden;
  padding: 20px 0;
}

.nav-title {
  margin: 0 20px 14px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.category-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.category-item,
.mobile-category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.category-item {
  padding: 12px 20px;
  transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.category-item:hover {
  background: rgba(255, 255, 255, 0.08);
  box-shadow: inset 3px 0 0 #5eead4;
  transform: translateX(2px);
}

.sidebar-footer {
  padding: 18px 20px 22px;
  display: flex;
  justify-content: center;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.github-link {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
  background: rgba(255, 255, 255, 0.06);
  transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.github-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.main-content {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 24px;
  background: rgba(247, 250, 252, 0.88);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
}

.search-shell {
  flex: 1;
  display: flex;
  justify-content: center;
}

.search-container {
  position: relative;
  width: min(760px, 100%);
  display: flex;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  transition: box-shadow 0.24s ease, transform 0.24s ease, background-color 0.24s ease;
}

.search-container:hover,
.search-container:focus-within {
  transform: translateY(-1px);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
}

.search-engine-selector {
  position: relative;
  width: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-right: 1px solid #e2e8f0;
  background: rgba(248, 250, 252, 0.9);
  border-radius: 16px 0 0 16px;
}

.engine-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
  border-radius: 6px;
}

.engine-select {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
}

.search-input {
  width: 100%;
  border: none;
  padding: 15px 18px;
  border-radius: 0 16px 16px 0;
  background: transparent;
  color: #0f172a;
  font-size: 16px;
  outline: none;
}

.search-input::placeholder {
  color: #94a3b8;
  transition: color 0.2s ease;
}

.search-container:focus-within .search-input::placeholder {
  color: #64748b;
}

.local-search-results {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  padding: 10px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.14);
  backdrop-filter: blur(12px);
}

.search-panel-enter-active,
.search-panel-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.search-panel-enter-from,
.search-panel-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.local-search-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 11px 12px;
  border: none;
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.18s ease, transform 0.18s ease;
}

.local-search-item:hover {
  background: #f8fafc;
  transform: translateX(2px);
}

.local-search-item-name {
  color: #0f172a;
  font-size: 14px;
  font-weight: 600;
}

.local-search-item-meta,
.local-search-empty {
  color: #64748b;
  font-size: 12px;
  line-height: 1.5;
}

.local-search-empty {
  margin: 0;
  padding: 12px;
}

.theme-toggle-btn,
.mobile-menu-btn {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.96);
  color: #213043;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.theme-toggle-btn:hover,
.mobile-menu-btn:hover {
  transform: translateY(-1px);
  background: #fff;
  box-shadow: 0 14px 26px rgba(15, 23, 42, 0.12);
}

.mobile-menu-btn {
  display: none;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 260px;
  height: 100vh;
  z-index: 1001;
  background: #fff;
  box-shadow: -12px 0 32px rgba(15, 23, 42, 0.16);
  transition: right 0.24s ease;
}

.mobile-menu.active {
  right: 0;
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  color: #fff;
  background: #213043;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h3 {
  margin: 0;
  font-size: 18px;
}

.header-github-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
}

.close-btn {
  border: none;
  background: transparent;
  color: #fff;
  font-size: 26px;
  cursor: pointer;
}

.mobile-category-list {
  list-style: none;
  margin: 0;
  padding: 10px 0 24px;
}

.mobile-category-item {
  padding: 14px 20px;
  color: #0f172a;
  transition: background-color 0.18s ease;
}

.mobile-category-item:hover {
  background: #f8fafc;
}

.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.42);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.24s ease, visibility 0.24s ease;
}

.mobile-menu-overlay.active {
  opacity: 1;
  visibility: visible;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 28px 24px 48px;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.state-block {
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: #64748b;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #22c55e;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

.retry-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  background: #22c55e;
  color: #fff;
  cursor: pointer;
}

.categories-container {
  max-width: 1240px;
  margin: 0 auto;
}

.category-section + .category-section {
  margin-top: 42px;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 18px;
  color: #233142;
  font-size: 28px;
}

.sites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}

.site-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(255, 255, 255, 0.92);
  color: inherit;
  text-decoration: none;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.03);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.site-card:hover {
  transform: translateY(-3px);
  border-color: #c7d2fe;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.1);
}

.site-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #f8fafc;
  overflow: hidden;
}

.site-icon img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.site-info {
  min-width: 0;
}

.site-name {
  margin: 0 0 6px;
  color: #0f172a;
  font-size: 18px;
}

.site-description {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lock-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(180deg, #1f2f42 0%, #16202f 100%);
}

.lock-box {
  width: min(420px, 100%);
  padding: 36px;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
}

.lock-box h1 {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 28px;
}

.lock-description {
  margin: 0 0 28px;
  color: #64748b;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.form-group label {
  color: #334155;
  font-size: 14px;
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
}

.form-input:focus {
  border-color: #38bdf8;
}

.unlock-btn {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #38bdf8 0%, #22c55e 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.unlock-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.error-message {
  margin: 14px 0 0;
  color: #dc2626;
  font-size: 14px;
}

.dark .nav-home {
  background:
    radial-gradient(circle at top left, rgba(94, 234, 212, 0.08), transparent 30%),
    linear-gradient(180deg, #0f172a 0%, #111827 100%);
}

.dark .sidebar {
  background: linear-gradient(180deg, #0f172a 0%, #0b1220 100%);
}

.dark .search-header {
  background: rgba(15, 23, 42, 0.84);
  border-bottom-color: rgba(148, 163, 184, 0.08);
}

.dark .search-container,
.dark .theme-toggle-btn,
.dark .mobile-menu-btn,
.dark .mobile-menu,
.dark .local-search-results {
  background: rgba(30, 41, 59, 0.96);
  color: #e2e8f0;
}

.dark .search-engine-selector,
.dark .site-icon {
  background: #334155;
  border-color: #475569;
}

.dark .search-input {
  color: #e2e8f0;
}

.dark .search-input::placeholder,
.dark .local-search-item-meta,
.dark .local-search-empty,
.dark .site-description,
.dark .state-block {
  color: #94a3b8;
}

.dark .local-search-item-name,
.dark .category-title,
.dark .site-name,
.dark .mobile-category-item,
.dark .theme-toggle-btn,
.dark .mobile-menu-btn {
  color: #e2e8f0;
}

.dark .local-search-item:hover,
.dark .mobile-category-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.dark .site-card {
  border-color: #334155;
  background: rgba(30, 41, 59, 0.92);
}

.dark .site-card:hover {
  border-color: #475569;
}

.dark .mobile-menu-header {
  background: #0f172a;
}

.dark .lock-container {
  background: linear-gradient(180deg, #020617 0%, #0f172a 100%);
}

.dark .lock-box {
  background: #1e293b;
}

.dark .lock-box h1,
.dark .form-group label,
.dark .form-input {
  color: #e2e8f0;
}

.dark .lock-description {
  color: #94a3b8;
}

.dark .form-input {
  background: #334155;
  border-color: #475569;
}

@media (max-width: 768px) {
  .nav-home {
    height: 100svh;
  }

  .sidebar {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .search-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 200;
    padding: 14px 16px;
  }

  .content-area {
    padding: 94px 16px 34px;
  }

  .sites-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .site-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
    padding: 14px;
  }

  .site-description {
    white-space: normal;
  }

  .category-title {
    font-size: 22px;
  }
}

@media (max-width: 520px) {
  .search-header {
    gap: 10px;
  }

  .theme-toggle-btn,
  .mobile-menu-btn {
    width: 38px;
    height: 38px;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
