function timeOut(resolve, func, ms){
    // console.log("resolved: ", resolve)
    return setTimeout(()=>{
        func();
        resolve();
    },ms)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
Object.values = Object.values || function(o){return Object.keys(o).map(function(k){return o[k]})};
class LesCanvasItem{
    constructor(canvas){
        this.canvas = canvas;
        this._2d_context = canvas._2d_context;
    }

    delete(){
        let index = this.canvas.registered_items.indexOf(this);
        this.canvas.registered_items.splice(index, 1);
        this.canvas.draw_items();
    }

    add(){
        this.canvas.registered_items.push(this);
        this.canvas.draw_items();
    }
}

class LesCanvasFillText extends LesCanvasItem{
    constructor(canvas, x, y, _text, {font="30px Arial", color="black"} = {}){
        super(canvas);
        [this.x, this.y, this._text, this.font, this.color] = [x, y, _text, font, color];
        // console.log(color)
    }

    draw(){
        this._2d_context.font = this.font;
        this._2d_context.fillStyle = this.color;
        this._2d_context.fillText(this._text, this.x, this.y)
    }

    get text(){
        return this._text;
    }

    set text(new_value){
        this._text = new_value;
        this.canvas.draw_items();
    }
}


class LesCanvasLine extends LesCanvasItem{
    constructor(canvas, x1, y1, x2, y2, {color="black", width="1"}={}){
        super(canvas);
        [this.x1, this.y1, this.x2, this.y2] = [x1, y1, x2, y2];
        [this.color, this.width] = [color, width];
    };

    draw(){
        this._2d_context.beginPath();
        this._2d_context.strokeStyle = this.color;
        this._2d_context.lineWidth = this.width;
        this._2d_context.moveTo(this.x1, this.y1);
        this._2d_context.lineTo(this.x2, this.y2);
        this._2d_context.stroke()
    }
}

class LesCanvasRectangle extends LesCanvasItem{
    constructor(canvas, x, y, width, height, {color="black"}={}){
        super(canvas);
        this.x = x; this.y = y;
        this.width = width; this.height = height;
        this.color = color;
    }
}

class LesCanvasStrokeRectangle extends LesCanvasRectangle{
    constructor(canvas, x, y, width, height, {color="black", stroke_width=1}={}){
        super(canvas, x, y, width, height, color)
        this.stroke_width = stroke_width;
    }

    draw(){
        this._2d_context.lineWidth = this.stroke_width;
        this._2d_context.strokeStyle = this.color;
        this._2d_context.strokeRect(this.x, this.y, this.width, this.height);
    }
}
class LesCanvasFillRectangle extends LesCanvasRectangle{

    draw(){
        this._2d_context.fillStyle = this.color;
        this._2d_context.fillRect(this.x, this.y, this.width, this.height);
    }
}
class LesCanvas{
    constructor(id){
        this.canvas = document.getElementById(id);
        this._2d_context = this.canvas.getContext("2d");

        this._2d_context.textAlign = 'center';
        
        this.registered_items = [];
    }

    get width(){
        return this.canvas.width;
    }

    set width(new_value){
        this.canvas.width = new_value;
    }

    get height(){
        return this.canvas.height;
    }

    set height(new_value){
        this.canvas.height = new_value;
    }

    createItem(Item, ...args){
        let item = new Item(this, ...args);
        // console.log("item added: ", item)
        item.add();
        return item;
    }

    fillRect(...args){
        return this.createItem(LesCanvasFillRectangle, ...args);
    }
    
    strokeRect(...args){
        return this.createItem(LesCanvasStrokeRectangle, ...args);
    }

    line(...args){
        return this.createItem(LesCanvasLine, ...args);
    }

    fillText(...args){
        return this.createItem(LesCanvasFillText, ...args);
    }

    draw_items(){
        this._2d_context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let item of this.registered_items){
            item.draw();
        }
    }

    get bounding_box(){
        return this.canvas.getBoundingClientRect();
    }

    get borderWidth(){
        return parseInt(window.getComputedStyle(this.canvas).borderWidth)
    }

    get scales(){
        let rect = this.canvas.getBoundingClientRect();
        // let border_width = this.borderWidth;
        let scaleX = (this.canvas.width ) / (this.canvas.clientWidth);  
        let scaleY = (this.canvas.height ) / (this.canvas.clientHeight);
        return [scaleX, scaleY]
    }

    get_mouse_position(event){
        let rect = this.canvas.getBoundingClientRect();
        let [scaleX, scaleY] = this.scales;
        // console.log(this.canvas, border_width*scaleX)
        // console.log("bbox", rect.width*scaleX, rect.height*scaleY)
        let x = ~~((event.clientX - rect.left - this.borderWidth)*scaleX);
        let y = ~~((event.clientY - rect.top - this.borderWidth)*scaleY);
        return [x, y];
        
        
        
        // let [scaleX, scaleY] = this.scales;
        // var stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(this.canvas, undefined)['paddingLeft'], 10) || 0;
        // var stylePaddingTop = parseInt(document.defaultView.getComputedStyle(this.canvas, undefined)['paddingTop'], 10) || 0;
        // var styleBorderLeft = parseInt(document.defaultView.getComputedStyle(this.canvas, undefined)['borderLeftWidth'], 10) || 0;
        // var styleBorderTop = parseInt(document.defaultView.getComputedStyle(this.canvas, undefined)['borderTopWidth'], 10) || 0;
        // var html = document.body.parentNode;
        // var htmlTop = html.offsetTop;
        // var htmlLeft = html.offsetLeft;


        // var element = this.canvas,
        // offsetX = 0,
        // offsetY = 0,
        // mx, my;


        // // Compute the total offset
        // if (element.offsetParent !== undefined) {
        //     do {
        //         offsetX += element.offsetLeft;
        //         offsetY += element.offsetTop;
        //     } while ((element = element.offsetParent));
        // }

        // // Add padding and border style widths to offset
        // // Also add the <html> offsets in case there's a position:fixed bar
        // offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
        // offsetY += stylePaddingTop + styleBorderTop + htmlTop;

        // mx = ~~((event.pageX - offsetX)*scaleX);
        // my = ~~((event.pageY - offsetY)*scaleY);

        // // We return a simple javascript object (a hash) with x and y defined
        // return [mx, my];
    }
}

window.onload = function bind(){
    var canvas = new LesCanvas("testcanvas");
    // let zold = canvas.fillRect(400, 200, 300, 150, color="green");
    // zold.delete();
    // canvas.fillRect(0, 10, 30, 15, color="red");
    // canvas._2d_context.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
    // canvas.rect(0, 100, 300, 15, fill="yellow");
    var button = document.getElementById("test_button");
    var hossz = 0;
    button.addEventListener("click", (event)=>{ hossz+=100;canvas.fillRect(hossz, 10, 30, 15, fill="red")})
    gm = new GridManager(canvas, {cell_size: 30, grid_color: "red", show_grid:true});
    // gm.fillCell(GridCell.get_cell(1,1));
    gm.onCellClick(GridManager.alternateFillRect);
    let texts = {font: "60px Arial"}

    // canvas.fillText(100, 700, `border: ${canvas.borderWidth}`, texts);
    clienttext = canvas.fillText(100, 100, "calc", texts);
    // pagetext = canvas.fillText(100, 300, "page", texts);
    // sitetext = canvas.fillText(100, 600, "site", texts);


    canvas.canvas.addEventListener("mousemove", (event)=>{
        // console.log('.')
        let [relX, relY] = canvas.get_mouse_position(event);
        clienttext.text = `calc: ${relX}, ${relY}`;
    });
}
class CanvasManager{
    constructor(canvas){
        this.canvas = canvas;
    }
}
class ArrayDrawing{
    constructor(index, value, manager){

        let spacing_before = manager.spacing*(index);
        let x1 = index*manager.item_width+spacing_before+manager.padding,
        height = value*manager.value_height;
        // console.log("draw valuw:  ", spacing_before, this.padding)
        // console.log("draw value:  ", x1+spacing_before+this.padding, this.item_width, height)
        let color = manager.draw_color;

        // drawing value rect
        this.value = 
            manager.canvas.fillRect(x1, 0, manager.item_width, height, {color: color});

        // text
        this.text = 
            manager.canvas.fillText(x1+~~(manager.item_width/2), height+manager.text_offset, value, {font:`${manager.font_size}px Arial`, color: color})

        //flag for eliminating double deletes
        this._drawn = true;
    }

    delete(){
        if (this._drawn){
            this.text.delete()
            this.value.delete()
            this._drawn = false;
        }
    }
}


class ArrayManager extends CanvasManager{
    constructor(canvas,   {array_size=10,
        spacing_ratio = 0.4, value_height = 30, min_padding=200,
        default_cell_color="black",
        //   separator_color="black",
    }={}){
        
        super(canvas);
        // [this.start_width, this.start_height] = [this.canvas.width, this.canvas.height];
        
        this.min_padding = min_padding;
        [this.spacing_ratio, this.value_height] = [spacing_ratio, value_height];
        [this.text_offset, this.font_size] = [100, 110];
        
        this.drawings = [];
        // this.relative_resize()
        
        // this._separatorlines = [];
        this._2d_context = canvas._2d_context;
        // this.calculate_sizes(array_size);
        this.array_size = array_size;

        this._upcoming_colors = []
        this._draw_color = "green";
    }

    get draw_color(){
        if (this._upcoming_colors.length) return this._upcoming_colors.pop();
        return this._draw_color;
    }

    set draw_color(new_value){
        this._draw_color = new_value;
    }

    enroll_colors(...colors){
        if (colors) this._upcoming_colors.push(...colors)
        else this._upcoming_colors = [];
    }
    
    set array_size(new_value){
        this.delete_all();
        this._array_size = new_value;
        this.calculate_sizes();
    }
    
    delete_all(){
        for (let drawing of this.drawings){
            drawing?.delete();
        }
    }

    calculate_sizes(){
        // console.log("calcs:  ", this.canvas.width, this._array_size);
        const spacing_units = this.spacing_ratio*(this._array_size-1);
        this.item_width = ~~((this.canvas.width-2*this.min_padding)/(this._array_size+spacing_units));
        this.spacing = ~~(this.spacing_ratio*this.item_width);
        const content_width = this.item_width*this._array_size + this.spacing*(this._array_size-1)
        this.padding = ~~((this.canvas.width - content_width)/2);
        // this.canvas.fillRect(0, 600, this.padding, 700, "yellow")
        // this.canvas.fillRect(0, 500, this.min_padding/2, 500, "blue")
        // console.log("calcs:  ", this.spacing, this.item_width, this.padding)
        // console.log("calcs:  ", )

        this.font_size = ~~(this.item_width / 1.5);
        this.text_offset = this.font_size + 10;

        // console.log(this.font_size, this.item_width)
        
        // this.fix_sizes();
    }
    
    draw_value(index, value){
        this.drawings[index]?.delete();
        this.drawings[index] = new ArrayDrawing(index, value, this);
    }
    
    
}
class VisualArray{
    constructor(canvas,{minimum_item_width=5, manager_options={}}={}){
        this.canvas = canvas;
        this.array_manager = new ArrayManager(canvas, {array_size: 10, ...manager_options},)

        this.minimum_item_width = this.minimum_item_width;

        // canvas.fillRect(0,0, 100, 100)

        this.target = [];
        this.proxy = new Proxy(this.target, {
            set: (target, prop, new_value) => this.set_item(target, prop, new_value)
        })

        this.target.redraw = (...args) => this.redraw(...args);
        this.target.recolor = (...args) => this.recolor(...args);
        this.target.enroll_colors = (...colors) => this.array_manager.enroll_colors(...colors);


    }

    static new(...args){
        return new this(...args).proxy;
    }

    set_item(target, prop, new_value){
        if (prop == "length") {
            this.target.length = new_value;
            this.array_manager.array_size = new_value
            // console.log("length", prop, new_value)
        }
        else if (prop == "draw_color"){
            this.array_manager.draw_color = new_value;
        }
        else {
            Reflect.set(target, prop, new_value);
            this.array_manager.draw_value(prop, new_value);
            // console.log("aalllitva", target[prop])
        }
    }
    
    redraw(i){
        console.log("redraw", i)
        this.array_manager.draw_value(i, this.target[i]);
    }

    recolor(i, color){

        this.array_manager.enroll_colors(color);
        this.array_manager.draw_value(i, this.target[i]);
    }

    get maximum_item_count(){
        return ~~(this.canvas.width/this.minimum_item_width);
    }

}

// window.onload = function(){
//     // let canvas = this.canvas = document.getElementById("testcanvas");
//     // console.log(canvas.getContext("2d"))
//     let canvas = new LesCanvas("testcanvas");
//     // console.log(canvas.canvas)
//     let va = VisualArray.new(canvas);
//     // va[3] = 40;
//     // va[9] = 20;
//     // va[0] =10;
//     for (let i =1; i<=10;i++){
//         va[i-1] = i*5;
//     }
//     let testing = 2
//     document.getElementById("test_button").addEventListener("click", () => {
//         if (va[testing]) va[testing] = 0
//         else va[testing] = 60;
//     })
//     // console.log(va[3]);
// }
class AlgorithmPauser{
    constructor(mode="auto-sort"){
        this.next = this.sleeping; //or next_step
        this.mode = mode;

        this.wait_time = 300; 

        this.started = false;
        this.paused = false;
        this.initialized = true;

        this.stepping = false;
    }

    get mode(){
        return this._mode;
    }

    set mode(new_mode){
        // console.log(new_mode)
        this._mode = new_mode;
        if (new_mode == "auto-sort") {
            this.next = this.sleeping;
            this.stepping = true;
        }
        else this.next = this.next_step;
        // console.log(this.next)
    }

    async next_step(){
        while (true){
            if (this.started){
                if (this.stepping && this.initialized) {
                    this.stepping = false;
                    break;
                }
                await sleep(200);
            } else return false;
        }
        return true;
    }

    async sleeping(){
        await sleep(this.wait_time)
        while (true){
            if (this.started){
                if (!this.paused && this.initialized) break;
                await sleep(200);
            } else return false;
        }
        return true;

        // todo: consider returning bool value or not?
    }

    start(){
        if (!this.started){
            console.log("start")
            this.initialized = false;
            this.started = true;
            this.paused = false;

            this.stepping = false;
            // this.reset_data();

            // this.state = {}; TODO: reset array
            
            this.initialized = true;
            this.algorithm().then( () => this.started=false );
        }
    }

    // reset_data(){

    // }

    async algorithm(){
        for (let i=1; i<200 && this.started; i++){
            console.log(i);
            await this.next();
       }

    }

    pause_resume(){
        this.paused = !this.paused;
    }

    stop(){
        this.started = false;
    }

    step(){
        this.stepping = true;
    }


}

// window.onload = function (){
//     let at = new AlgorithmPauser()
//     document.getElementById("start").addEventListener("click", () => at.start())
//     document.getElementById("pause_resume").addEventListener("click", () => at.pause_resume())
//     document.getElementById("stop").addEventListener("click", () => at.stop())
//     let checkbox_dom = document.getElementById("auto-sort");
//     checkbox_dom.addEventListener("change", () => {
//         if (checkbox_dom.checked) at.mode = "auto-sort"
//         else at.mode = "stepper";
//     })

//     let speed_select_dom = document.getElementById("speed");
//     speed_select_dom.addEventListener("change", () => at.wait_time = parseInt(speed_select_dom.value))
    
//     document.getElementById("step").addEventListener("click", () => at.step())
// }
function generate_array(visual_array, array_size_dom){
    
    size = parseInt(array_size_dom.value);
    visual_array.length = size;
    f_min = 20;
    f_max = 850;
    for (let i=0; i<size; i++){
        visual_array[i] = ~~(Math.random() * (f_max+1)) + f_min
    }
    
    // visual_array.recolor(5, "yellow");
}


window.onload = function(){
    algorithms = {
        "bubble sort": async function(){
            // console.log(this)
            let i, j,
            arr = this.state.array,
            n = arr.length;
                        
            for (i = 0; i < n-1 && this.started; i++){    
                // Last i elements are already in place 
                // console.log("ciklus")
                for (j = 0; j < n-i-1 && this.started; j++){
                    arr.recolor(j, "#0b3be6");
                    arr.recolor(j+1, "#0390fc");
                    await this.next();
                    if (arr[j] > arr[j+1]){
                        // console.log("csere")
                        arr.enroll_colors("#db0bc3", "#db0d1e");
                        [ arr[j], arr[j+1] ] = [  arr[j+1], arr[j] ]; 
                        // console.log(arr)
                    } else arr.recolor(j, "#c4edbe");    // halvanysarga "#f2dd7e");
                    await this.next();
                }
                arr.recolor(n-i-1, "#1bde0d");
            }
            if (this.started) arr.recolor(0, "#1bde0d");
            
        } 
    }
    console.log("betoltve")
    
    let canvas = new LesCanvas("array-canvas");
    
    let visual_array = VisualArray.new(canvas, {
        manager_options: {value_height: 2}
    });

    visual_array.draw_color = "#f2d40f";

    
    let array_size_dom = document.getElementById("array-size-input"),
    algorithm_pauser = new AlgorithmPauser();
    
    algorithm_pauser.algorithm = algorithms["bubble sort"]
    algorithm_pauser.state = {array: visual_array}
    
    document.getElementById("generate").addEventListener("click", ()=>{
        algorithm_pauser.stop();
        generate_array(visual_array, array_size_dom); 
    })
    
    document.getElementById("start").addEventListener("click", ()=>algorithm_pauser.start() )
    document.getElementById("pause_resume").addEventListener("click", ()=>algorithm_pauser.pause_resume())
    document.getElementById("stop").addEventListener("click", ()=>algorithm_pauser.stop())
    let checkbox_dom = document.getElementById("auto-sort");
    checkbox_dom.addEventListener("change", () => {
        if (checkbox_dom.checked) algorithm_pauser.mode = "auto-sort"
        else algorithm_pauser.mode = "stepper";
    })

    let speed_select_dom = document.getElementById("speed-selector");
    speed_select_dom.addEventListener("change", () => algorithm_pauser.wait_time = parseInt(speed_select_dom.value))
    
    document.getElementById("step").addEventListener("click", () => algorithm_pauser.step())
}
