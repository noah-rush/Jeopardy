// const NBA = require("nba");
const mongoose = require('mongoose');
const moment = require('moment');
const axios = require('axios')
const cheerio = require('cheerio')
const inquirer = require('inquirer');

// var db = require("./models");

mongoose.connect('mongodb://localhost/jeopardy');

var db = require("./models");
var categories = [];
db.Categories.count({type:"Jeopardy"}).then(function(count) {
    // console.log(count)
    for (var i = 0; i < 6; i++) {
        let counter = i;
        let skipRand = Math.floor(Math.random() * count);
        db.Categories.findOne({type:"Jeopardy"}).skip(skipRand).populate('questions').limit(1).then(function(result) {
            // console.log(result)
            categories.push(result)
            if (counter == 5) {
                beginGame();
            }
        })
    }
})

function nextQuestion() {
    let category;
    let question;
    inquirer
        .prompt([{
                type: 'list',
                name: 'category',
                message: 'Pick an Category',
                choices: categories.filter((x) => x.name),
            },
            {
                type: 'list',
                name: 'value',
                message: 'Pick an Question',
                choices: function(answers) {
                    category = categories.filter((x) => answers.category == x.name);
                    // console.log(currentCat)
                    return category[0].questions.filter((x) => x.value);
                }
            },
            {
                type: 'input',
                name: 'answer',
                message: function(answers) {
                    // let currentCat = categories.filter((x) => answers.category == x.name);
                    // console.log(currentCat)
                    question = category[0].questions.filter((x) => answers.value == x.value);
                    return question[0].question
                }

            },
        ])
        .then(function(answer) {
            // console.log(answer)
            let correctAnswer = question[0].answer
            console.log(correctAnswer)
            nextQuestion();

        })
}

function beginGame() {
    console.log("welcome to jeopardy")
    // console.log(categories);

    nextQuestion();


}