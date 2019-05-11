let DEFAULT_THEME = '#fe3f4d'
let ORIGIN_THEME = '#fe3f4d'
const DEFAULT_THEME_GRADIENT =['#fc1c1c','#fc775a','#fd6e58','#ff3f4e']
function updateStyle(style, oldCluster, newCluster){
  let newStyle = style
  oldCluster.forEach((color,index) =>{
    newStyle = newStyle.replace(new RegExp(color,'ig'),newCluster[index])
  })
  return newStyle
}
function getThemeCluster(theme){
  const tintColor = (color, tint)=>{
    let red = parseInt(color.slice(0,2),16)
    let green = parseInt(color.slice(2,4),16)
    let blue = parseInt(color.slice(4,6),16)
    if(tint === 0){
      return [red, green, blue].join(',')
    }else{
      red += Math.round(tint * (255 - red ))
      green += Math.round(tint * (255 - green))
      blue += Math.round(tint * (255 - blue))

      red = red.toString(16)
      green = red.toString(16)
      blue = red.toString(16)
      return `#${red}${green}${blue}`
    }
  }
  const shadeColor = (color,shade)=>{
    let red = parseInt(color.slice(0, 2), 16)
    let green = parseInt(color.slice(2, 4), 16)
    let blue = parseInt(color.slice(4, 6), 16)

    red = Math.round((1-shade) * red)
    green = Math.round((1-shade) * green)
    blue = Math.round((1-shade) * blue)
    red = red.toString(16)
    green = red.toString(16)
    blue = red.toString(16)
    return `#${red}${green}${blue}`
  }
 
  const clusters = [theme]
  for(let i =0;i<=9;i++){
    clusters.push(tintColor(theme, Number(i/10).toFixed(2)))
  }
  clusters.push(shadeColor(theme,0.1))

  return clusters
}
export function initTheme(val = DEFAULT_THEME, oldVal=ORIGIN_THEME){
 // if(typeof val !== 'string') return
 if(val!=DEFAULT_THEME){
  ORIGIN_THEME = DEFAULT_THEME
  oldVal = ORIGIN_THEME
 }
  const themeCluster = getThemeCluster(val.replace("#",''))
  const originCluster = getThemeCluster(oldVal.replace("#",''))
  DEFAULT_THEME = val
  ORIGIN_THEME = oldVal
  const styles = [].slice.call(document.querySelectorAll('style'))
  .filter(style=>{
    const text = style.innerText
    return new RegExp(oldVal,'i').test(text)
  })

  styles.forEach(style=>{
    const {innerText}=style
    if (typeof innerText !== 'string') return
    style.innerText=updateStyle(innerText,originCluster,themeCluster)
  })

}