canvas = document.getElementById("visualizerCanvas");
var ctx = canvas.getContext("2d");

ctx.font = "30px Arial";
ctx.textAlign = "center";

class Visualizer{
    constructor(){

        this.max = 50;
        this.min = 0;
        this.array_size = 10;
        this.speed = 500;

        this.array = [];
        this.display_colors = {}

        window.addEventListener("resize", () => this.onResize());
        document.getElementById("generate").addEventListener("click", () => this.generateArray());
        document.getElementById("algo-select").addEventListener("change", (event) => this.onAlgorithmSelect());
        document.getElementById("sort-button").addEventListener("click", () => this.startSorting(false));  // TODO: check if theres an array
        document.getElementById("next-button").addEventListener("click", () => this.currentSort());  // TODO: check if ended
        let speed_selector = document.getElementById("speed-selector")
        speed_selector.addEventListener("change", (event) => this.speed = parseInt(speed_selector.value) );
        document.getElementById("autosort-button").addEventListener("click", () => this.startSorting(true));
        document.getElementById("continue-button").addEventListener("click", () => this.addNewInterval());
        document.getElementById("stop-button").addEventListener("click", () => window.clearInterval(this.interval));

        this.onAlgorithmSelect()
        this.onResize();

    }

    generateArray(){
        this.arrayParamterChange();
        this.sorting = false
        window.clearInterval(this.interval)
        this.array = [];
        for (var i = 0; i < this.array_size; i++) {
            let number = Math.floor(Math.random() * (this.max+1)) + this.min;
            this.array.push(number);
        }
        this.display_colors = {}
        this.displayArray();
        console.log(this.array);
    }

    onAlgorithmSelect(){
         this.currentSortStr = document.getElementById("algo-select").value
    }

    drawRectangle(x, y, w, h, color="green"){
        ctx.beginPath();
        // ctx.lineWidth = "6";
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
        ctx.stroke();
    }

    displayArray(){
        this.drawRectangle(0, 0, this.width, this.height, "white");
        this.array.forEach((value, index) => {
                let start_pos = this.margin + (index) * (this.spacing + this.num_width);
                let bottom_y = Math.floor(value*this.vertical_unit)
                this.drawRectangle(start_pos, 0, this.num_width, bottom_y, this.display_colors[index]);
                ctx.textAlign = "center";
                ctx.fillText(value, start_pos+Math.floor(this.num_width/2), bottom_y+10);
            }
        )
        // this.drawRectangle(10, 10, 10, 10, "red");
        console.log("ArrayDisplayed")
    }

    startSorting(auto_sort=false){
        this.display_colors = {}

        switch(this.currentSortStr) {
            case "bubble":
                this.sorting_state = {
                    i : 0,
                    j : 0
                }
                this.currentSort = this.bubbleSort;
                break;
            case "selection":
                // code block
                this.display_colors[0] = "yellow"
                this.sorting_state = {
                    i : 0,
                    j : 1,
                    min_index : 0
                }
                this.currentSort = this.selectionSort;
                break;
            default:
              // code block
          }

        this.paused = false;


        this.sorting = true;

        if (auto_sort) this.autoSort()
        else {this.currentSort()
            console.log("not auto, manual")
        };
    }

    autoSort(){
        this.currentSort()
        this.addNewInterval()
        
    }

    visualizedSwap(index1, index2){
        // this.display_colors = {};
        this.display_colors[index1] = 'red';
        this.display_colors[index2] = 'yellow';

        let temp = this.array[index1];
        this.array[index1] = this.array[index2];
        this.array[index2] = temp;
        // this.swap(this.array[index1], this.array[index2])
        console.log("swapped");
    }

    addNewInterval(){
        window.clearInterval(this.interval)
        window.setInterval(this.interval = window.setInterval( () => this.currentSort(), this.speed))
    }


    bubbleSort() {
        console.log("bubble sort")
        this.paused = false;
        this.sorting = false;
        while (this.sorting_state.i < this.array_size-1 && !this.paused){
            this.sorting = true;
            while (this.sorting_state.j < this.array_size - this.sorting_state.i - 1 && !this.paused){
                if(this.array[this.sorting_state.j] > this.array[this.sorting_state.j+1]){
                    this.visualizedSwap(this.sorting_state.j, this.sorting_state.j+1)
                } else {
                    // this.display_colors = {}
                    this.display_colors[this.sorting_state.j] = "blue";
                    this.display_colors[this.sorting_state.j+1] = "#4287f5";
                }
                
                this.paused = true;
                this.displayArray();
                console.log(this.sorting_state )

                this.sorting_state.j++;
            }
            if (this.sorting_state.j >= this.array_size - this.sorting_state.i - 1) {
                this.sorting_state.j = 0;

                this.display_colors = {};

                for (let i=this.array_size - 1 - this.sorting_state.i; i<this.array_size; i++) this.display_colors[i] = "red"

                this.sorting_state.i++;
            }
        }
        // console.log(this.sorting, 'imma')
        if (!this.sorting) window.clearInterval(this.interval)
    }

    selectionSort(){
        this.paused = false;
        this.sorting = false;

        console.log("selection sort", this.array)
        while (this.sorting_state.i < this.array_size && !this.paused){
            this.sorting = true;
            while(this.sorting_state.j < this.array_size && !this.paused){
                console.log("still running")
                console.log("comparing: ", this.array[this.sorting_state.j], this.sorting_state.min_index)
                if (this.array[this.sorting_state.j] < this.array[this.sorting_state.min_index]){
                    this.display_colors[this.sorting_state.min_index] = "blue"
                    this.sorting_state.min_index = this.sorting_state.j;
                    this.display_colors[this.sorting_state.min_index] = "yellow"
                } else {
                    this.display_colors[this.sorting_state.j] = "blue"
                }

                this.sorting_state.j ++;

                this.paused = true;
                this.displayArray();
                console.log(this.sorting_state )
            }

            if (this.sorting_state.j >= this.array_size){
                this.visualizedSwap(this.sorting_state.i, this.sorting_state.min_index);

                this.display_colors = {};
                for (let i=0; i<=this.sorting_state.i; i++) this.display_colors[i] = "red"

                this.sorting_state.i ++;

                this.sorting_state.min_index = this.sorting_state.i;
                this.display_colors[this.sorting_state.min_index] = "yellow"
                this.sorting_state.j = this.sorting_state.i + 1;
            }
        }
        if (!this.sorting) {
            window.clearInterval(this.interval);
            this.displayArray();
        }
    }

    arrayParamterChange(){
        this.array_size = document.getElementById("array-size-input").value;

        this.onParameterChange();
    }

    onParameterChange(){
        //  visual parameters
        this.num_width = Math.floor((this.width - (this.array_size-1)*5) / this.array_size);
        if (this.num_width > 60) {this.num_width = 60   } 
        // this.spacing = Math.floor((this.width - this.num_width*this.array_size)/(this.array_size-1));
        this.spacing = 5;
        this.margin = Math.floor((this.width - ((this.array_size-1)*this.spacing + this.array_size*this.num_width)) / 2)
        // this.vertical_unit = this.height/Math.max(this.array)
        this.vertical_unit = 5;
        console.log("parameterChanged")
    }

    onResize(){
        // getting the sizes of the viewport
        let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        // console.log(vw, vh)
        this.width = vw-20;
        this.height = vh-70;
        // TODO: create this.sizes!
        canvas.width = this.width;
        canvas.height = this.height;
        console.log("resized");

        this.onParameterChange()
        this.displayArray()
    }
}

new Visualizer()