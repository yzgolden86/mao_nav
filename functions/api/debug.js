// 临时调试接口，确认环境变量是否正确配置，排查完成后请删除此文件
export async function onRequestGet(context) {
  const { env } = context

  const token = env.GITHUB_TOKEN || ''
  const password = env.ADMIN_PASSWORD || ''

  return new Response(
    JSON.stringify({
      ADMIN_PASSWORD: password ? `已配置 (长度: ${password.length})` : '未配置',
      GITHUB_TOKEN: token
        ? `已配置 (长度: ${token.length}, 前缀: ${token.substring(0, 15)}..., 末尾: ...${token.slice(-5)}, 有空白符: ${token !== token.trim()})`
        : '未配置',
    }, null, 2),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  )
}
