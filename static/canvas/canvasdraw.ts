//https://www.tslang.cn/docs/handbook/typescript-in-5-minutes.html
//https://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
class CanvasDraw {
  private cache:Object;
  private ctx:Object;
  private data:Object;
  constructor(public paint: Object){
    this.data={
      showCanvas: false,
      width: 100,
      height: 100,
      // bgShape: null, //roundRect  round,
      // bgStrokeStyle: null,
      // bgFillStyle: null,
      // bgRadius: 5,
      index: 0,
      //imageList: [],
      tempFileList: [],//缓存图片
      //tempImagesList: {},
      tempBlockPositionRange: {}, //{1:{LTx:1,LTy:1,LBx:1,LBy:1,1:{...},2:{..}}}, //(LTx,LTy)匿名行左上角坐标，(LBx,LBy)匿名行左下角坐标
      isPainting: false
    };
    if(paint){

    }

  }
  initCanvas(painting: Object){
   // paint.dom
   this.data.width = painting.width;
   this.data.height = painting.height;

   this.data.views = painting.views;
   this.data.options = painting;
  }
  initViews(){
    const views = this.data.views;

  }
  getImageInfo(imgsrc:String){
    const img =  new Image();
    img.onload = (res)=>{
      console.log(res)
    }
    img.onerror= (res) =>{

    };
    img.src=imgsrc;
  }

}