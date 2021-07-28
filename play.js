// const NBA = require("nba");
require('dotenv').config(); // Allows use of environmental variables from the .env file

const mongoose = require('mongoose');
const moment = require('moment');
const axios = require('axios')
const cheerio = require('cheerio')
const inquirer = require('inquirer');

// var db = require("./models");
const uri =  process.env.MONGODB_URI;

mongoose.connect(uri);
var doubleJeopardyFlag = false;
var db = require("./models");
var categories = [];
var userScore = 0;
// var wager = 0;
db.Categories.count({ type: "Jeopardy" }).then(function(count) {
    // console.log(count)
    for (var i = 0; i < 6; i++) {
        let counter = i;
        let skipRand = Math.floor(Math.random() * count);
        db.Categories.findOne({ type: "Jeopardy" }).skip(skipRand).populate('questions').limit(1).then(function(result) {
            // console.log(result)
            categories.push(result)
            if (counter == 5) {
                beginGame();
            }
        })
    }
})

function doubleJeopardy() {
    doubleJeopardyFlag = true;
    categories = [];
    db.Categories.count({ type: "Double Jeopardy" }).then(function(count) {
        // console.log(count)
        for (var i = 0; i < 6; i++) {
            let counter = i;
            let skipRand = Math.floor(Math.random() * count);
            db.Categories.findOne({ type: "Double Jeopardy" }).skip(skipRand).populate('questions').limit(1).then(function(result) {
                // console.log(result)
                categories.push(result)
                if (counter == 5) {
                    console.log("Welcome to Double Jeopardy")
                    nextQuestion();
                }
            })
        }
    })
}

function finalJeopardy() {
    // doubleJeopardyFlag = true;
    categories = [];
    // let skipRand = Math.floor(Math.random() * count);
    db.Categories.count({ type: "Double Jeopardy" }).then(function(count) {
        // console.log(count)
        let skipRand = Math.floor(Math.random() * count);
        db.Categories.findOne({ type: "Double Jeopardy" }).skip(skipRand).populate('questions').limit(1).then(function(result) {



            inquirer
                .prompt([{
                    type: 'number',
                    name: 'wager',
                    message: "The Category is " + result.name + "\nEnter your wager:"

                }, {
                    type: 'input',
                    name: 'answer',
                    message: result.questions[0].question
                }]).then(function(answer) {
                    if (answer.answer.toLowerCase() == result.questions[0].answer.toLowerCase()) {
                        console.log("Correct")
                        userScore = userScore + answer.wager
                    } else {
                        userScore = userScore - answer.wager

                    }
                    console.log("Thanks For Playing Jeopardy")
                    console.log("Final Score: " + userScore)
                })
        })


    })
}

function nextQuestion() {
    let category;
    let question;
    console.log("$" + userScore)
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
            let answerVal = answer.value.replace('$', '');

            if (answer.answer.toLowerCase() == correctAnswer.toLowerCase()) {
                console.log("Correct")
                userScore = userScore + parseInt(answerVal)
            } else {
                console.log(correctAnswer)
                userScore = userScore - parseInt(answerVal)

            }
            // category = category[0].questions÷÷.filter((x) => answer.value != x.value)
            categories = categories.map(function(x) {
                if (x.name == answer.category) {
                    x.questions = x.questions.filter((x) => x.value != answer.value)
                    if (x.questions.length == 0) {
                        return false
                    }
                }
                return x

            })
            categories = categories.filter((x) => x);
            // console.log(categories)
            if (categories.length != 0) {
                nextQuestion();
            } else {
                if (!doubleJeopardyFlag) {
                    doubleJeopardy();
                } else {
                    finalJeopardy();
                }
            }

        })
}

function beginGame() {
    // finalJeopardy()
    console.log("welcome to jeopardy")
    // console.log(categories);

    nextQuestion();


}