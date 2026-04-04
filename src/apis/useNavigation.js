import { ref } from 'vue'
import { mockData } from '../mock/mock_data.js'

const SEARCH_ENGINES = ['google', 'baidu', 'bing', 'duckduckgo']

function cacheSiteTitle(siteTitle) {
  try {
    localStorage.setItem('site_title', siteTitle)
  } catch (error) {
    console.warn('Failed to cache site title.', error)
  }
}

function resolveSearchEngine(searchEngine) {
  return SEARCH_ENGINES.includes(searchEngine) ? searchEngine : 'bing'
}

export function useNavigation() {
  const categories = ref([])
  const title = ref('')
  const defaultSearchEngine = ref('bing')
  const loading = ref(false)
  const error = ref(null)

  const fetchCategories = async () => {
    loading.value = true
    error.value = null

    try {
      categories.value = mockData.categories
      title.value = mockData.title
      defaultSearchEngine.value = resolveSearchEngine(mockData.search)

      cacheSiteTitle(title.value)
      document.title = title.value
    } catch (err) {
      error.value = err.message
      console.error('Error fetching categories:', err)

      categories.value = mockData.categories
      title.value = mockData.title
      defaultSearchEngine.value = resolveSearchEngine(mockData.search)

      cacheSiteTitle(title.value)
      document.title = title.value
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    title,
    defaultSearchEngine,
    loading,
    error,
    fetchCategories,
  }
}
