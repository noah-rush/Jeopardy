// const NBA = require("nba");
const mongoose = require('mongoose');
const moment = require('moment');
const axios = require('axios')
const cheerio = require('cheerio')
// var db = require("./models");



// mongoose.connect('mongodb://localhost/basketball-reference');

// var db = require("./models");



// url = "http://www.j-archive.com/showseason.php?season=35"
// axios.get(url).then(function(data) {
//             const $ = cheerio.load(data.data);
//             $('table td[align="left"]').find("a").each(function() {
                var game = "http://www.j-archive.com/showgame.php?game_id=6368"
                axios.get(game).then(function(gamedata) {
                    const $ = cheerio.load(gamedata.data);
                    $('.category_name').each(function(){
                        console.log($(this).text())
                    })


                    /////Jeopardy Round
                    $('#jeopardy_round tr').each(function(){
                        
                        $(this).find("td").each(function(e){
                            if(e == 0){
                                
                            }
                        })
                    })
                })


        //     })
        // })