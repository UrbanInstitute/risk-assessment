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

                d3.select("#resultsMen").style("display", "block")
                d3.select("#resultsWomen").style("display", "none")
            }
            else {
                d3.select(".selectSex.checkbox.male").classed("active", false);
                d3.select(".selectSex.checkbox.female").classed("active", true);

                d3.select("#resultsMen").style("display", "none")
                d3.select("#resultsWomen").style("display", "block")

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
                .html(function(d){ return populatePointValues(d, gender); });

            showScore()

            d3.select(".quizBody").classed("hidden", false);
        })


    d3.select("#mobileHide").on("click", function(){
        if(d3.select(this).classed("arrow")){
            d3.select(this).classed("arrow", false)

            var hOrig = d3.select("#scoreText").attr("data-height")
            d3.select("#scoreText")
                .transition()
                    .style("height",hOrig + "px")
        }else{
            d3.select(this).classed("arrow", true)
            var h = d3.select("#scoreText").node().getBoundingClientRect().height
            console.log(h)

            d3.select("#scoreText")
                .attr("data-height",h)
                .transition()
                    .style("height","94px")
        }
    })
    // d3.select("#calculate")
        // .on("click", showScore)
}

function showScore(){

    var qs = d3.selectAll(".question:not(.hide)")
    qs.classed("error", function(){
        return (d3.select(this).selectAll(".checkbox.active").nodes().length == 0)
    })

    if(d3.selectAll(".question.error").nodes().length == 0){
        var generalScore = 0,
            violentScore = 0,
            gender = (d3.select(".selectSexButtons .option.active").classed("male")) ? "male" : "female";

        qs.each(function(){
            // console.log(d)
            var datum = d3.select(d3.select(this).select(".checkbox.active").node().parentNode).datum()
            generalScore += datum[gender]["general"],
            violentScore += datum[gender]["violent"]
        })

        // console.log(score)
        var generalCategory = determineRiskCategory(gender, "general", generalScore);
        var violentCategory = determineRiskCategory(gender, "violent", violentScore);

        // d3.select("#scoreText .patternResults .gender").text(gender);
        d3.select("#scoreText .generalRiskScore .riskScore").text(generalScore);
        d3.select("#scoreText .generalRiskScore .riskCategory").text(generalCategory);
        d3.select("#scoreText .violentRiskScore .riskScore").text(violentScore);
        d3.select("#scoreText .violentRiskScore .riskCategory").text(violentCategory);
        // d3.select("#scoreText .earlyReleaseEligibility .gender").text(gender === "male" ? "he" : "she");

        var isEligible = false;
        if(generalCategory === "Minimum" && violentCategory === "Minimum") isEligible = true;
        else if(generalCategory === "Low" && violentCategory === "Low") isEligible = true;
        else if((generalCategory === "Minimum" && violentCategory === "Low") || (generalCategory === "Low" && violentCategory === "Minimum")) isEligible = true;

        d3.select("#scoreText .earlyReleaseEligibility .eligibility").classed("hide", isEligible ? true : false);
    } else {
        // ????
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

    prompt.append("div")
        .attr("class", "desc")
        .html(function(d) { return d.desc; })

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
        .html(function(d) { return populatePointValues(d, "male"); });
}

function populatePointValues(data, gender) {
    var option = data.option,
        generalPoints = data[gender]["general"],
        violentPoints = data[gender]["violent"],
        generalPointsText = "General: " + generalPoints + " " + ((generalPoints === 1 || generalPoints === -1) ? "point" : "points") + "; ",
        violentPointsText = "Violent: " + violentPoints + " " + ((violentPoints === 1 || violentPoints === -1) ? "point" : "points");

    if(generalPoints === null) {
        generalPointsText = "General: N/A; ";
    }

    if(violentPoints === null) {
        violentPointsText = "Violent: N/A";
    }

    return option + " <span class='pointsLabel'>(" + generalPointsText + violentPointsText + ")</span>";
}

function determineRiskCategory(gender, model, score) {
    var cutPoints = {
        "male": {
            "general": {
                "minimum" : 10, "low": 30, "medium": 43
            },
            "violent": {
                "minimum": 6, "low": 24, "medium": 30
            }
        },
        "female": {
            "general": {
                "minimum": 5, "low": 31, "medium": 49
            },
            "violent": {
                "minimum": 2, "low": 19, "medium": 25
            }
        }
    }

    if(cutPoints[gender][model]["minimum"] >= score) return "Minimum"
    else if(cutPoints[gender][model]["low"] >= score && cutPoints[gender][model]["minimum"] < score) return "Low"
    else if(cutPoints[gender][model]["medium"] >= score && cutPoints[gender][model]["low"] < score) return "Medium"
    else return "High"
}
init()