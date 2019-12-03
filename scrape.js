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
                        console.log(data)
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
                        console.log(data)
                    })
                })
            }
        })


    })
})