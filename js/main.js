function init() {
    d3.json("data/questions.json").then(function(questions){
        buildQuestions(questions)
        initControls(questions)
    });
}
 
function initControls(questions){
    d3.selectAll(".button")
        .on("click", function(){
            d3.selectAll(".button").classed("active", false);
            d3.select(this).classed("active", true);

            d3.select("#calculate").classed("disabled", false)

            var gender = (d3.select(this).classed("male")) ? "male" : "female";

            var question = d3.selectAll(".question")
            
            question.classed("hide", function(d){
                    return (d.options.filter(function(o){ return o[gender] === false }).length != 0)
                })
                .classed("disabled", false)

            var num = 0;

            question.select(".qNum")
                .text(function(d, i){
                    if(d.options.filter(function(o){ return o[gender] === false }).length == 0){
                        num += 1
                        return num
                    }
                })

            showScore()
                

        })

    d3.select("#calculate")
        .on("click", showScore)
}

function showScore(){
    var qs = d3.selectAll(".question:not(.hide)")
    qs.classed("error", function(){
        return (d3.select(this).selectAll(".checkbox.active").nodes().length == 0)
    })

    if(d3.selectAll(".question.error").nodes().length == 0){
        var score = 0,
            gender = (d3.select(".button.active").classed("male")) ? "male" : "female";

        qs.each(function(){
            // console.log(d)
            var datum = d3.select(d3.select(this).select(".checkbox.active").node().parentNode).datum()
            score += datum[gender]

        })
        console.log(score)
        d3.select("#scoreText").text(["Score of", score].join(" "))


    }else{

    }

}

function buildQuestions(questions){
    var question = d3.select("#questions")
        .selectAll(".question")
        .data(questions)
        .enter()
        .append("div")
        .attr("class", "question disabled")

    var prompt = question.append("div")
        .attr("class", "promptRow")
        .attr("id", function(d,i){
            return "p" + i;
        })
    
    prompt.append("div")
        .attr("class", "qNum")
        .text(function(d, i){ return (i+1) })

    prompt.append("div")
        .attr("class", "prompt")
        .text(function(d){
            return d.question
        })

    prompt.append("div")
        .attr("class", "errorMark")
        .text("*")

    var option = question.append("div")
        .selectAll(".option")
        .data(function(d){ return d.options })
        .enter()
        .append("div")
        .attr("class", "option")
        .on("click", function(d){
            d3.select(this.parentNode.parentNode).classed("error", false)

            d3.select(this.parentNode).selectAll(".checkbox").classed("active", false)
            d3.select(this).select(".checkbox").classed("active", true)

            showScore()

        })

    option.append("div")
        .attr("class", "checkbox")
        //to be removed
        .classed("active", function(d,i){
            return i == 0
        })

    option.append("div")
        .attr("class", "optVal")
        .text(function(d){ return d.option })
}

init()