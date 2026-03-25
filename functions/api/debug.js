// 临时调试接口，排查完成后请删除此文件
export async function onRequestGet(context) {
  const { env } = context

  const token = (env.GITHUB_TOKEN || '').trim()
  const owner = 'maodeyu180'
  const repo = 'mao_nav'

  const result = {
    env: {
      ADMIN_PASSWORD: env.ADMIN_PASSWORD ? `已配置 (长度: ${env.ADMIN_PASSWORD.length})` : '未配置',
      GITHUB_TOKEN: token
        ? `已配置 (长度: ${token.length}, 前缀: ${token.substring(0, 15)}...)`
        : '未配置',
    },
    githubTest: {},
  }

  // 直接测试 GitHub API 调用
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'mao-nav-cf-function',
      },
    })

    const body = await response.text()
    let parsed
    try { parsed = JSON.parse(body) } catch { parsed = body }

    result.githubTest = {
      status: response.status,
      statusText: response.statusText,
      message: parsed.message || null,
      repoName: parsed.full_name || null,
    }
  } catch (error) {
    result.githubTest = {
      error: error.message,
    }
  }

  return new Response(JSON.stringify(result, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  })
}
