// const NBA = require("nba");
const mongoose = require('mongoose');
const moment = require('moment');
const axios = require('axios')
const cheerio = require('cheerio')
// var db = require("./models");



mongoose.connect('mongodb://localhost/jeopardy');

var db = require("./models");



url = "http://www.j-archive.com/showseason.php?season=35"
axios.get(url).then(function(data) {
    const $ = cheerio.load(data.data);
    $('table td[align="left"]').find("a").each(function() {
        var game = $(this).attr("href")
        // var game = 'http://www.j-archive.com/showgame.php?game_id=6464'
        axios.get(game).then(function(gamedata) {
            const $ = cheerio.load(gamedata.data);
            // $('.category_name').each(function(){
            //     console.log($(this).text())
            // })


            /////Jeopardy Round
            for (var i = 0; i < 6; i++) {
                let category = {};
                category.type = "Jeopardy"
                category.questions = [];

                $('#jeopardy_round > .round > tbody > tr > td').each(function(e) {
                    if (e % 6 == i) {
                        if ($(this).hasClass("category")) {
                            category.name = $(this).find('.category_name').text()
                        }
                        if ($(this).hasClass("clue")) {
                            var clue = {}
                            clue.question = $(this).find('.clue_text').text()
                            clue.value = $(this).find('.clue_value').text()
                            // clue.answer = $(this).find('.clue_value').text()
                            if (clue.value.indexOf("$") < 0) {
                                clue.value = "daily double"
                                if (e < 12) {
                                    clue.value = "$200"
                                } else if (e < 18) {
                                    clue.value = "$400"
                                } else if (e < 24) {
                                    clue.value = "$600"
                                } else if (e < 30) {
                                    clue.value = "$800"
                                } else {
                                    clue.value = "$1000"

                                }

                            }
                            // console.log(clue.value)
                            // clue.answer = $(this).find('.clue_value').text()
                            var rawAnswer = $(this).find('div').attr("onmouseover");
                            // console.log(rawAnswer)
                            if (rawAnswer) {
                                var answer = rawAnswer.substring(rawAnswer.indexOf('<em'), rawAnswer.indexOf('</em>'))
                                answer = answer.substring(answer.indexOf('>') + 1)
                                answer = answer.replace(/<[^>]*>?/gm, '');
                                clue.answer = answer
                                category.questions.push(clue)
                            }

                        }
                    }

                })
                db.Questions.insertMany(category.questions).then(function(data) {
                    category.questions = data.map(x => x._id);
                    // console.log(category.questions)
                    // console.log(category)
                    db.Categories.insertMany(category).then(function(data) {
                        // console.log(data)
                    })
                })
            }
            for (var i = 0; i < 6; i++) {
                let category = {};
                category.type = "Double Jeopardy"
                category.questions = [];


                $('#double_jeopardy_round > .round > tbody > tr > td').each(function(e) {
                    if (e % 6 == i) {
                        if ($(this).hasClass("category")) {
                            category.name = $(this).find('.category_name').text()
                        }
                        if ($(this).hasClass("clue")) {
                            var clue = {}
                            clue.question = $(this).find('.clue_text').text()
                            clue.value = $(this).find('.clue_value').text()
                            // clue.answer = $(this).find('.clue_value').text()
                            if (clue.value.indexOf("$") < 0) {
                                if (e < 12) {
                                    clue.value = "$400"
                                } else if (e < 18) {
                                    clue.value = "$800"
                                } else if (e < 24) {
                                    clue.value = "$1200"
                                } else if (e < 30) {
                                    clue.value = "$1600"
                                } else {
                                    clue.value = "$2000"

                                }
                            }
                            // console.log(clue.value)
                            var rawAnswer = $(this).find('div').attr("onmouseover");
                            // console.log(rawAnswer)
                            if (rawAnswer) {
                                var answer = rawAnswer.substring(rawAnswer.indexOf('<em'), rawAnswer.indexOf('</em>'))
                                answer = answer.substring(answer.indexOf('>') + 1)
                                answer = answer.replace(/<[^>]*>?/gm, '');
                                clue.answer = answer
                                category.questions.push(clue)
                            }

                        }
                    }

                })
                db.Questions.insertMany(category.questions).then(function(data) {
                    category.questions = data.map(x => x._id);
                    // console.log(category.questions)
                    // console.log(category)
                    db.Categories.insertMany(category).then(function(data) {
                        // console.log(data)
                    })
                })
            }

            let category = {};
            category.type = "Final Jeopardy"
            category.questions = [];


            $('#final_jeopardy_round > .final_round > tbody > tr > td').each(function(e) {
                    var clue = {}
                
                if ($(this).hasClass("category")) {
                    category.name = $(this).find('.category_name').text()
                     var rawAnswer = $(this).find('div').attr("onmouseover");
                    // console.log(rawAnswer)
                    if (rawAnswer) {
                        var answer = rawAnswer.substring(rawAnswer.indexOf('<em'), rawAnswer.indexOf('</em>'))
                        answer = answer.substring(answer.indexOf('>') + 1)
                        answer = answer.replace(/<[^>]*>?/gm, '');
                        clue.answer = answer
                        category.questions.push(clue)
                    }
                }
                if ($(this).hasClass("clue")) {
                    // var clue = {}
                    clue.question = $(this).find('.clue_text').text()
                }


            })
            db.Questions.insertMany(category.questions).then(function(data) {
                category.questions = data.map(x => x._id);
                // console.log(category.questions)
                // console.log(category)
                db.Categories.insertMany(category).then(function(data) {
                    console.log(data)
                })
            })





        })


    })
})