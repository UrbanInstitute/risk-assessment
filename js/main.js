function init() {
    d3.json("data/questions.json", function(error, questions){
        buildQuestions(questions)
        initControls(questions)
    });
}

function initControls(questions){
    d3.selectAll(".selectSexButtons .option")
        .on("click", function(){
            d3.selectAll(".selectSexButtons .option").classed("active", false);
            d3.select(this).classed("active", true);

            d3.select("#calculate").classed("disabled", false)

            var gender = (d3.select(this).classed("male")) ? "male" : "female";

            if(gender === "male") {
                d3.select(".selectSex.checkbox.male").classed("active", true);
                d3.select(".selectSex.checkbox.female").classed("active", false);
            }
            else {
                d3.select(".selectSex.checkbox.male").classed("active", false);
                d3.select(".selectSex.checkbox.female").classed("active", true);
            }

            var question = d3.selectAll(".question")

            question.classed("hide", function(d){
                    return (d.options.filter(function(o){ return o[gender] === false }).length != 0)
                })
                .classed("disabled", false)

            var staticQnum = 0;

            question.select("#staticQuestions .qNum")
                .text(function(d, i){
                    if(d.options.filter(function(o){ return o[gender] === false }).length == 0){
                        staticQnum += 1
                        return staticQnum;
                    }
                })

            var dynamicQnum = 0;

            question.select("#dynamicQuestions .qNum")
                .text(function(d, i){
                    if(d.options.filter(function(o){ return o[gender] === false }).length == 0){
                        dynamicQnum += 1
                        return dynamicQnum;
                    }
                })

            var answerOptions = d3.selectAll(".option");
            // answerOptions.select(".pointVal").text(function(d) { return d[gender]; });

            answerOptions.selectAll(".optVal")
                .html(function(d){ return d.option + " <span class='pointsLabel'>(<span class='pointVal'>" + d[gender] + "</span> " + ((d[gender] === 1 || d[gender] === -1) ? "point" : "points") + ")</span>"; })

            showScore()

            d3.select(".quizBody").classed("hidden", false);
        })

    // d3.select("#calculate")
        // .on("click", showScore)
}

function showScore(){
    var cutPoints = {
        "male": {"minimum" : 10, "low": 33, "medium": 45 },
        "female": {"minimum": 9, "low": 29, "medium": 45 }
    }
    var qs = d3.selectAll(".question:not(.hide)")
    qs.classed("error", function(){
        return (d3.select(this).selectAll(".checkbox.active").nodes().length == 0)
    })

    if(d3.selectAll(".question.error").nodes().length == 0){
        var score = 0,
            gender = (d3.select(".selectSexButtons .option.active").classed("male")) ? "male" : "female";

        qs.each(function(){
            // console.log(d)
            var datum = d3.select(d3.select(this).select(".checkbox.active").node().parentNode).datum()
            score += datum[gender]

        })
        // console.log(score)
        var category;
        if(cutPoints[gender]["minimum"] >= score) category = "Minimum"
        else if(cutPoints[gender]["low"] >= score && cutPoints[gender]["minimum"] < score) category = "Low"
        else if(cutPoints[gender]["medium"] >= score && cutPoints[gender]["low"] < score) category = "Medium"
        else category = "High"

        // d3.select("#scoreText .patternResults .gender").text(gender);
        d3.select("#scoreText .overallRiskScore .riskScore").text(score);
        d3.select("#scoreText .overallRiskScore .riskCategory").text(category);
        d3.select("#scoreText .earlyReleaseEligibility .gender").text(gender === "male" ? "he" : "she");
        d3.select("#scoreText .earlyReleaseEligibility .eligibility").text((category === "Minimum" || category === "Low") ? "eligible" : "ineligible");

    }else{

    }

}

function buildQuestions(questions){
    var staticQuestions = d3.select("#staticQuestions")
        .selectAll(".question")
        .data(questions.filter(function(d) { return d.type === "static"; }))
        .enter()
        .append("div")
        .attr("class", "question disabled");
        // .attr("class", "question")

    populateQuestions(staticQuestions);

    var dynamicQuestions = d3.select("#dynamicQuestions")
        .selectAll(".question")
        .data(questions.filter(function(d) { return d.type === "dynamic"; }))
        .enter()
        .append("div")
        .attr("class", "question disabled");

    populateQuestions(dynamicQuestions);
}

function populateQuestions(questionDiv) {
    var prompt = questionDiv.append("div")
        .attr("class", "promptRow")
        .attr("id", function(d,i){
            return "p" + i;
        })

    prompt.append("div")
        .attr("class", "prompt")
        .html(function(d, i){ return "<span class='qNum'>" + (i + 1) + "</span>. " + d.question; })

    // prompt.append("div")
    //     .attr("class", "errorMark")
    //     .text("*")

    var option = questionDiv.append("div")
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
        .classed("active", function(d,i){ return i == 0; })

    option.append("div")
        .attr("class", "optVal")
        .html(function(d){ return d.option + " <span class='pointsLabel'>(<span class='pointVal'>" + d.male + "</span> " + ((d.male === 1 || d.male === -1) ? "point" : "points") + ")</span>"; })
}

init()