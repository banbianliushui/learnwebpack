//https://www.tslang.cn/docs/handbook/typescript-in-5-minutes.html
//https://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
class CanvasDraw {
  cache = {};
  ctx = null;
  data = {
    defaultFontSize: 12,
    showCanvas: false,
    width: 100,
    height: 100,
    index: 0,
    tempFileList: [], //缓存图片
    tempBlockPositionRange: {}, //{1:{LTx:1,LTy:1,LBx:1,LBy:1,1:{...},2:{..}}}, //(LTx,LTy)匿名行左上角坐标，(LBx,LBy)匿名行左下角坐标
    isPainting: false,
    options: null,
    views: [],
    domId: null
  };
  constructor(options) {
    if (options != null) {
      this.data = Object.assign({}, this.data, options);
      this.data.options = options;
    }
    let canvas = null;
    if (options && options.domId == null) {
      options.domId = 'canvas__' + new Date().getTime();
      options.domId && (this.data.domId = options.domId);
      canvas = document.createElement('canvas');
      document.body.appendChild(canvas);
    }
    canvas = document.getElementById(this.data.domId);
    this.ctx = canvas.getContext('2d');
    this.initViews();
  }

  initViews() {
    this.initImageInfo();
  }
  initImageInfo() {
    const views = this.data.views;
    let promissList = [];
    for (let i = 0; i < views.length; i++) {
      if (views[i].type == 'image') {
        promissList.push(this.cacheImageInfo(views[i].url));
      }
    }

    Promise.all(promissList)
      .then(res => {
        this.startPaint();
      })
      .catch(error => {
        console.log(error);
      });
  }
  startPaint() {
    const views = this.data.views;
    for (let i = 0; i < views.length; i++) {
      if (views[i].type == 'image') {
        this.drawImage(views[i]);
      } else if (views[i].type == 'text') {
        this.drawText(views[i]);
      } else if (views[i].type == 'roundRect') {
        this.drawRoundRect(views[i]);
      } else if (views[i].type === 'msgRect') {
        this.drawMsgRoundRect(views[i]);
      }
    }
  }
  //{textDecoration:{type:'',color:''},font|fontSize|fontWeight|textOverflow,color,content,fontSize,
  //top,left,lineHeight,textAlign,width,indent,maxLineCount}
  drawText(params) {
    let {
      maxLineCount = null,
      //breakWord = null,
      textOverflow = 'ellipsis',
      color = '#000000',
      content = null,
      fontSize = 12,
      top = 0,
      left = 0,
      lineHeight = 12,
      textAlign = 'left',
      width = null,
      fontWeight = null,
      textDecoration = null,
      fontFamliy = null,
      // type = null,
      // icon = null,
      indent = null,

      range = null,
      font = null
    } = params;

    let tempRange = this.data.tempBlockPositionRange;

    let adjustobj = this.adjustLeftTop({ range: range, left, top });
    left = adjustobj.left;
    top = adjustobj.top;
    //换行，首行缩进，
    this.ctx.save();
    this.ctx.textBaseline = 'top';
    this.ctx.textAlign = textAlign;
    this.ctx.fillStyle = color;
    let totalHeight = fontSize;
    let maxLineWidth = (this.ctx.measureText(content).width > width ? width : this.ctx.measureText(content).width);
    if (!font) {
      font = fontSize + 'px ' + (fontWeight ? ' ' + fontWeight : '') + (fontFamliy ? ' ' + fontFamliy : '');
    }
    let newIndent = indent === null ? 0 : indent;
    if (indent) {
      if (typeof indent != 'number') {
        let font = '';
        if (indent.font) {
          font = indent.font;
        } else {
          font = indent.fontSize ? indent.fontSize + 'px' : this.data.defaultFontSize + 'px';
        }
        newIndent = this.ctx.measureText(indent.content);
        newIndent = newIndent + (indent.otherWidth ? indent.otherWidth : 0);
      }
    }
    let lineNum = 1;
    let fillTop = top;
    let fillText = '';
    this.ctx.font = font;

    if (width == null) {
      //自动扩展
      this.ctx.fillText(content, left + newIndent, fillTop);
      //underline line-through
      this.drawTextDecoration({
        left: left + newIndent,
        top: fillTop,
        textDecoration,
        color,
        fontSize,
        content
      });
    } else {
      let ellipsisStr = '...';
      let ellipsisWidth = this.ctx.measureText(ellipsisStr).width;

      for (let i = 0; i < content.length; i++) {
        fillText += content[i];
        if (this.isEmojiCharacter(content, i)) {
          continue;
        }
        if (
          (lineNum == 1 ? this.ctx.measureText(fillText).width + newIndent : this.ctx.measureText(fillText).width) >
          width
        ) {
          if (lineNum == maxLineCount) {
            //f (textOverflow == 'ellipsis') {
            let newFillText = fillText;
            for (let j = fillText.length - 1; j >= 0; j--) {
              newFillText = fillText.substring(0, j) + (textOverflow == 'ellipsis' ? ellipsisStr : '');
              if (
                (lineNum == 1
                  ? this.ctx.measureText(newFillText).width + newIndent
                  : this.ctx.measureText(newFillText).width) <= width
              ) {
                this.ctx.fillText(newFillText, lineNum == 1 ? left + newIndent : left, fillTop);
                //underline line-through
                this.drawTextDecoration({
                  left: lineNum == 1 ? left + newIndent : left,
                  top: fillTop,
                  textDecoration,
                  color,
                  fontSize,
                  content: newFillText
                });
                fillText = '';
                break;
              }
            }
            //  }
          }
          this.ctx.fillText(fillText, lineNum == 1 ? left + newIndent : left, fillTop);
          this.drawTextDecoration({
            left: lineNum == 1 ? left + newIndent : left,
            top: fillTop,
            textDecoration,
            color,
            fontSize,
            content: fillText
          });
          fillText = '';
          fillTop += lineHeight;
          lineNum++;
        }
      }

      this.ctx.fillText(fillText, left, fillTop);
      this.drawTextDecoration({
        left: lineNum == 1 ? left + newIndent : left,
        top: fillTop,
        textDecoration,
        color,
        fontSize,
        content: fillText
      });
      totalHeight = fillTop + lineHeight - top;
    }

    if (params.range) {
      this.adjustElemRange({
        range: params.range,
        left: left,
        top: top,
        width: maxLineWidth,
        height: totalHeight
      });
    }
    this.ctx.restore();
  }

  drawTextDecoration({ left = 0, top = 0, textDecoration = null, color = null, fontSize = 12, content = null } = {}) {
    let decoration = textDecoration;
    if (textDecoration != null && typeof textDecoration == 'object') {
      decoration = textDecoration.type;
      textDecoration.color != null && (color = textDecoration.color);
    }

    if (decoration === 'underline') {
      this.drawRect({
        background: color,
        top: top + fontSize * 1.2,
        left: left - 1,
        width: this.ctx.measureText(content).width + 3,
        height: 1
      });
    } else if (decoration === 'line-through') {
      this.drawRect({
        background: color,
        top: top + fontSize * 0.6,
        left: left - 1,
        width: this.ctx.measureText(content).width + 3,
        height: 1
      });
    }
  }
  drawRect({ background, top = 0, left = 0, width = 0, height = 0 } = {}) {
    this.ctx.save();
    background && (this.ctx.fillStyle = background);
    this.ctx.fillRect(left, top, width, height);
    this.ctx.restore();
  }
  drawMsgRoundRect(params) {
    let {
      left = 0,
      top = 0,
      width = 0,
      height = 0,
      triangleTop = 0,
      triangleWidth = 12,
      radius = 5,
      fillStyle = '#ffffff',
      strokeStyle = '#000000',
      shadowOffsetX = 0,
      shadowOffsetY = 0,
      blur = 0,
      shadowColor = 'black',
      measure = null,
      range = {}
    } = params;
    let adjustobj = this.adjustLeftTop({
      range: range,
      left,
      top
    });
    left = adjustobj.left;
    top = adjustobj.top;
    let tempRange = this.data.tempBlockPositionRange;
    let x = left;
    let y = top;
    let w = width;
    let h = height;
    if (h == 0 && measure != null) {
      let result = this.computeTextLine(measure.content, null, measure.width, 0, measure.fontSize);
      if (result.strArr.length > measure.MaxLineNumber) {
        h = measure.MaxLineNumber * measure.lineHeight + measure.otherHeight;
      } else {
        h = (result.strArr.length == 0 ? 1 : result.strArr.length) * measure.lineHeight + measure.otherHeight;
      }
    }

    strokeStyle != null && this.ctx.setStrokeStyle(strokeStyle);
    fillStyle != null && this.ctx.setFillStyle(fillStyle);

    this.ctx.save(); // 先保存状态 已便于画完圆再用
    this.ctx.beginPath();
    this.ctx.arc(x + radius, y + radius, radius, 1 * Math.PI, 1.5 * Math.PI, false);
    this.ctx.lineTo(x + w - 1 * radius, y);
    this.ctx.arc(x + w - 1 * radius, radius + y, radius, 1.5 * Math.PI, 2 * Math.PI, false);
    this.ctx.lineTo(x + w, y + h - 1 * radius);
    this.ctx.arc(x + w - 1 * radius, y + h - 1 * radius, radius, 0, 0.5 * Math.PI, false);
    this.ctx.lineTo(x + radius, y + h);
    this.ctx.arc(x + radius, y + h - radius, radius, 0.5 * Math.PI, 1 * Math.PI, false);

    this.ctx.lineTo(x, y + radius + triangleWidth + triangleTop);
    this.ctx.lineTo(x + triangleWidth * Math.cos((2 * Math.PI * 1) / 3), y + radius + triangleWidth / 2 + triangleTop);
    this.ctx.lineTo(x, y + radius + triangleTop);
    this.ctx.lineTo(x, y + radius);
    this.ctx.setShadow(shadowOffsetX, shadowOffsetY, blur, shadowColor);
    this.ctx.fill();

    if (params.range) {
      this.adjustElemRange({
        range: params.range,
        left: x,
        top: y,
        width: w,
        height: h
      });
    }
  }
  drawRoundRect(params) {
    const { left, top, width, height, radius, fillStyle, strokeStyle } = params;
    let x = left;
    let y = top;
    let w = width;
    let h = height;
    strokeStyle != null && this.ctx.setStrokeStyle(strokeStyle);
    fillStyle != null && this.ctx.setFillStyle(fillStyle);
    let radiuslist = [];
    if (typeof radius == 'number') {
      radiuslist = [radius, radius, radius, radius];
    } else if (Array.isArray(radius)) {
      radiuslist = radius;
      [radius, radius, radius, radius];
    }
    this.ctx.save(); // 先保存状态 已便于画完圆再用
    this.ctx.beginPath();
    this.ctx.arc(x + radiuslist[0], y + radiuslist[0], radiuslist[0], 1 * Math.PI, 1.5 * Math.PI, false);
    this.ctx.lineTo(x + w - 1 * radiuslist[1], y);
    this.ctx.arc(x + w - 1 * radiuslist[1], radiuslist[1] + y, radiuslist[1], 1.5 * Math.PI, 2 * Math.PI, false);
    this.ctx.lineTo(x + w, y + h - 1 * radiuslist[2]);
    this.ctx.arc(x + w - 1 * radiuslist[2], y + h - 1 * radiuslist[2], radiuslist[2], 0, 0.5 * Math.PI, false);
    this.ctx.lineTo(x + radiuslist[3], y + h);
    this.ctx.arc(x + radiuslist[3], y + h - radiuslist[3], radiuslist[3], 0.5 * Math.PI, 1 * Math.PI, false);
    this.ctx.lineTo(x, y + radiuslist[0]);
    this.ctx.fill();
  }
  drawImage(params) {
    this.ctx.save();
    let {
      url,
      originWidth,
      originHeight,
      top = 0,
      left = 0,
      width = 0,
      height = 0,
      radius = null,
      mode = null,
      bgShape = null,
      range = null
    } = params;
    let info = this.data.tempFileList[this.cache[url]];

    let sWidth = info.width; //图片宽度
    let sHeight = info.height; //图片高度
    let sx = 0;
    let sy = 0;
    let adjustobj = this.adjustLeftTop({
      range: range,
      left,
      top
    });
    left = adjustobj.left;
    top = adjustobj.top;
    let tempRange = this.data.tempBlockPositionRange;

    if (mode && mode == 'aspectFill') {
      //短边展示
      if (height != 0 && width / height > originWidth / originHeight) {
        //originHeight需截高度中间部分
        // (sWidth < width) && (sWidth = width);
        sHeight = (sWidth * height) / width; //要展示的高度，高度需要调整
        sy = (originHeight - sHeight) / 2;
      } else if (height != 0 && width / height < originWidth / originHeight) {
        //需截的是宽度
        // (sHeight < height) && (sHeight = height);
        sWidth = (sHeight * width) / height; //
        sx = (originWidth - sWidth) / 2;
      }
    } else if (mode && mode == 'aspectFit') {
      //长边自适应，按比例整个展示出来
      if (height != 0 && width / height > originWidth / originHeight) {
        //originHeight需截高度中间部分
        // (sWidth < width) && (sWidth = width);
        sHeight = (sWidth * height) / width;
        sy = (height - sHeight) / 2;
      } else if (height != 0 && width / height < originWidth / originHeight) {
        // (sHeight < height) && (sHeight = height);
        sWidth = (sHeight * width) / height;
        sx = (width - sWidth) / 2;
      }
    }

    // if (bgShape && bgShape == 'round') {
    //   this.drawCircle(left + width / 2, top + width / 2, width / 2);
    //   this.ctx.clip();
    // } else if (bgShape && bgShape == 'roundRect') {
    // }
    if (radius != null) {
      this.drawRoundRect({ left, top, width, height, radius });
      this.ctx.clip();
    }
    //radius
    //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

    this.ctx.drawImage(info.image, sx, sy, sWidth, sHeight, left, top, width, height);
    if (params.range) {
      this.adjustElemRange({ range: params.range, left: left, top: top, width: width, height: height });
    }
    this.ctx.restore();
  }
  drawCircle(x, y, radius) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  }
  //range:{row,col,referRow|referCol|referAlign}
  adjustLeftTop(params) {
    let { range = null, left = 0, top = 0 } = params;
    let tempRange = this.data.tempBlockPositionRange;
    if (range && (range.referRow || range.referCol)) {
      if (range.referRow && !range.referCol) {
        //距离参照行
        if (!range.referAlign || range.referAlign === 'leftBottom') {
          left = left + tempRange[range.referRow]['LBx'];
          top = top + tempRange[range.referRow]['LBy'];
        } else if (range.referAlign === 'leftTop') {
          left = left + tempRange[range.referRow]['LTx'];
          top = top + tempRange[range.referRow]['LTy'];
        } else if (!range.referAlign || range.referAlign === 'rightTop') {
          left = left + tempRange[range.referRow]['RTx'];
          top = top + tempRange[range.referRow]['RTy'];
        } else if (!range.referAlign || range.referAlign === 'rightBottom') {
          left = left + tempRange[range.referRow]['RBx'];
          top = top + tempRange[range.referRow]['RBy'];
        }
      }

      if (range.referRow && range.referCol) {
        if (!range.referAlign || range.referAlign === 'rightTop') {
          left = left + tempRange[range.referRow][range.referCol]['RTx'];
          top = top + tempRange[range.referRow][range.referCol]['RTy'];
        } else if (range.referAlign === 'leftTop') {
          left = left + tempRange[range.referRow][range.referCol]['LTx'];
          top = top + tempRange[range.referRow][range.referCol]['LTy'];
        } else if (range.referAlign === 'leftBottom') {
          left = left + tempRange[range.referRow][range.referCol]['LBx'];
          top = top + tempRange[range.referRow][range.referCol]['LBy'];
        } else if (!range.referAlign || range.referAlign === 'rightBottom') {
          left = left + tempRange[range.referRow][range.referCol]['RBx'];
          top = top + tempRange[range.referRow][range.referCol]['RBy'];
        }
      }
    }
    return {
      left: left,
      top: top
    };
  }
  adjustElemRange(params) {
    let tempRange = this.data.tempBlockPositionRange;
    let { range = null, left = 0, top = 0, width = 0, height = 0 } = params;
    if (range != null) {
      //LTx LTy  LBx LBy RTx RTy  RBx RBy
      if (range.col == null) {
        range.col = 1;
      }
      if (tempRange[range.row] == null) tempRange[range.row] = {};
      if (tempRange[range.row][range.col] == null) tempRange[range.row][range.col] = {};
      tempRange[range.row][range.col]['LTx'] = left;
      tempRange[range.row][range.col]['LTy'] = top;
      tempRange[range.row][range.col]['LBx'] = left;
      tempRange[range.row][range.col]['LBy'] = top + height;
      tempRange[range.row][range.col]['RTx'] = left + width;
      tempRange[range.row][range.col]['RTy'] = top;
      tempRange[range.row][range.col]['RBx'] = left + width;
      tempRange[range.row][range.col]['RBy'] = top + height;
      if (range.col == 1) {
        tempRange[range.row]['LTx'] = left;
        tempRange[range.row]['LTy'] = top;
        tempRange[range.row]['LBx'] = left;
        tempRange[range.row]['LBy'] = top + height;
        tempRange[range.row]['RTx'] = left + width;
        tempRange[range.row]['RTy'] = top;
        tempRange[range.row]['RBx'] = left + width;
        tempRange[range.row]['RBy'] = top + height;
      } else {
        if (left + width > tempRange[range.row]['RTx']) {
          tempRange[range.row]['RTx'] = left + width;
          tempRange[range.row]['RBx'] = left + width;
        }
        if (top + height > tempRange[range.row]['RBy']) {
          tempRange[range.row]['RBy'] = top + height;
        }
        if (top > tempRange[range.row]['RTy']) {
          tempRange[range.row]['RTy'] = top;
        }
      }
      this.data.tempBlockPositionRange = tempRange;
    }
  }
  cacheImageInfo(imgsrc) {
    console.log('cacheImageInfo+1');
    return Promise.resolve().then(() => {
      console.log(44);

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = res => {
          console.log(res);
          let target = res.target;
          this.cache[target.src] = this.data.tempFileList.length;
          this.data.tempFileList.push({
            width: target.width,
            height: target.height,
            path: target.src,
            image: img
          });
          resolve();
        };
        img.onerror = res => {
          reject();
        };
        img.src = imgsrc;
      });
    });
  }
  //https://blog.csdn.net/dksy891028/article/details/52212417#
  isEmojiCharacter(strs, i) {
    //字符串中的第一个字符是否是emoji
    //for (let i = index; i < strs.length; i++) {
    let currentCode = strs.charCodeAt(i);
    if (0xd800 <= currentCode && currentCode <= 0xdbff) {
      var afterCode = strs.charCodeAt(i + 1);
      var uc = (currentCode - 0xd800) * 0x400 + (afterCode - 0xdc00) + 0x10000;
      if (0x1d000 <= uc && uc <= 0x1f77f) {
        return true;
      }
    } else if (i + 1 < strs.length) {
      var afterCode = strs.charCodeAt(i + 1);
      if (afterCode == 0x20e3) {
        return true;
      }
    }
    if (0x2100 <= currentCode && currentCode <= 0x27ff) {
      return true;
    } else if (0x2b05 <= currentCode && currentCode <= 0x2b07) {
      return true;
    } else if (0x2934 <= currentCode && currentCode <= 0x2935) {
      return true;
    } else if (0x3297 <= currentCode && currentCode <= 0x3299) {
      return true;
    } else if (
      currentCode == 0xa9 ||
      currentCode == 0xae ||
      currentCode == 0x303d ||
      currentCode == 0x3030 ||
      currentCode == 0x2b55 ||
      currentCode == 0x2b1c ||
      currentCode == 0x2b1b ||
      currentCode == 0x2b50
    ) {
      return true;
    }
    //  }
    return false;
  }
  clear() {
    if (this.ctx) {
      // let ctx = document.getElementById(this.data.domId).getContext('2d');
      //ctx.height = c.height;
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }
}

// emoji判断
