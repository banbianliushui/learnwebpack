
const DEFAULT_THEME = '#FF5379'
let STYLE_CONTENT = ''

// 更新样式
function updateStyle(style, oldCluster, newCluster) {
  let newStyle = style
  oldCluster.forEach((color, index) => {
    newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
  })
  return newStyle
}

// 根据主题色获得对应颜色
function getThemeCluster(theme) {
  const tintColor = (color, tint) => {
    let red = parseInt(color.slice(0, 2), 16)
    let green = parseInt(color.slice(2, 4), 16)
    let blue = parseInt(color.slice(4, 6), 16)

    if (tint === 0) { // when primary color is in its rgb space
      return [red, green, blue].join(',')
    } else {
      red += Math.round(tint * (255 - red))
      green += Math.round(tint * (255 - green))
      blue += Math.round(tint * (255 - blue))

      red = red.toString(16)
      green = green.toString(16)
      blue = blue.toString(16)

      return `#${red}${green}${blue}`
    }
  }

  const shadeColor = (color, shade) => {
    let red = parseInt(color.slice(0, 2), 16)
    let green = parseInt(color.slice(2, 4), 16)
    let blue = parseInt(color.slice(4, 6), 16)

    red = Math.round((1 - shade) * red)
    green = Math.round((1 - shade) * green)
    blue = Math.round((1 - shade) * blue)

    red = red.toString(16)
    green = green.toString(16)
    blue = blue.toString(16)

    return `#${red}${green}${blue}`
  }

  const clusters = [theme]
  for (let i = 0; i <= 9; i++) {
    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
  }
  clusters.push(shadeColor(theme, 0.1))
  return clusters
}

export function initTheme(val, oldVal = DEFAULT_THEME) {
  if (typeof val !== 'string') return
  const themeCluster = getThemeCluster(val.replace('#', ''))
  const originalCluster = getThemeCluster(oldVal.replace('#', ''))
  const getHandler = (id) => {
    return () => {
      const originalCluster = getThemeCluster(DEFAULT_THEME.replace('#', ''))
      let newStyle = updateStyle(STYLE_CONTENT, originalCluster, themeCluster)

      let styleTag = document.getElementById(id)
      if (!styleTag) {
        styleTag = document.createElement('style')
        styleTag.setAttribute('id', id)
        styleTag.setAttribute('type', 'text/css')
        document.head.appendChild(styleTag)
      }
      styleTag.innerText = newStyle
    }
  }

  const chalkHandler = getHandler('chalk-style')

  if (STYLE_CONTENT) {
    chalkHandler()
  }

  const styles = [].slice.call(document.querySelectorAll('style'))
    .filter(style => {
      const text = style.innerText
      return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
    })
  styles.forEach(style => {
    const {
      innerText
    } = style
    if (typeof innerText !== 'string') return
    style.innerText = updateStyle(innerText, originalCluster, themeCluster)
  })
}