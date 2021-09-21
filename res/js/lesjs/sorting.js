imports = ["raws/_visual_array", "raws/_algorithm_pauser"]

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
