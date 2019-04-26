//顶点着色器程序 GLSL语言，指定顶点位置和点的尺寸
var VSHADER_SOURCE = 'void main() {\n'+
' gl_Position = vec4(0.0, 0.0, 0.0,1.0); \n'
+' gl_PointSize = 10.0; \n'
+'} \n';

//片元着色器程序,指定片元颜色RGBA
var FSHADER_SOURCE = ' void main() {\n'
+'gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n'
+'}\n';

function main(){
  var canvas = document.getElementById('webgl');
  var gl = canvas.getContext('webgl')
  if(!gl){
    return;
  }
//初始化着色器(将字符串形式的着色器代码从js传给webgl系统)
//
if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
  return;
}
  gl.clearColor(0.0,0.0,0.0,1.0)//设置canvas 背景色
  gl.clear(gl.COLOR_BUFFER_BIT)//清空 canvas
  gl.drawArrays(gl.POINTS,0,1)//绘制
}

function initShaders(gl,vs,fs){}