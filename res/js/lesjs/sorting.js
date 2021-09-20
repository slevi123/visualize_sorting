imports = ["raws/_visual_array", "raws/_algorithm_pauser"]

function generate_array(visual_array, array_size_dom){
    size = parseInt(array_size_dom.value);
    visual_array.length = size;
    f_min = 20;
    f_max = 50;
    for (let i=0; i<size; i++){
        visual_array[i] = ~~(Math.random() * (f_max+1)) + f_min
    }
}


window.onload = function(){
    algorithms = {
        "bubble sort": async function(){ 
            // console.log(this)
            let i, j,
                arr = this.state.array,
                n = arr.length;
            for (i = 0; i < n-1; i++)     
                // Last i elements are already in place 
                for (j = 0; j < n-i-1 && this.started; j++) 
                    if (arr[j] > arr[j+1]){
                        [ arr[j], arr[j+1] ] = [  arr[j+1], arr[j] ]; 
                        await this.next();
                    }
        } 
    }
    console.log("betoltve")

    let canvas = new LesCanvas("array-canvas");

    let visual_array = VisualArray.new(canvas);

    let array_size_dom = document.getElementById("array-size-input"),
        algorithm_pauser = new AlgorithmPauser();

    algorithm_pauser.algorithm = algorithms["bubble sort"]
    algorithm_pauser.state = {array: visual_array}

    document.getElementById("generate").addEventListener("click", ()=>generate_array(visual_array, array_size_dom) )

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
