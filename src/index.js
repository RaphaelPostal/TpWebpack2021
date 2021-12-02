import css from './css/style.css';

require ('jquery')

$(function(){

})

var mem = {
    // (A) PROPERTIES
    // (A1) HTML ELEMENTS
    hWrap : null, // HTML game wrapper
    hCards : null, // HTML cards
    // (A2) GAME SETTINGS
    sets : 6, // Total number of cards to match
    hint : 600, // How long to show mismatched cards
    url : "", // Optional, URL to images
    // (A3) FLAGS
    loaded : 0, // Total number of assets loaded
    time : 0,
    moves : 0, // Total number of moves
    last : null, // Last opened card
    grid : null, // Current play grid
    matches : null, // Current matched cards
    locked : null, // 2 cards chosen did not match

    // (B) PRELOAD
    preload : function () {
        // (B1) GET HTML GAME WRAPPER
        mem.hWrap = document.getElementById("mem-game");

        // (B2) PRELOAD IMAGES
        for (let i=0; i<=mem.sets; i++) {
            let img = document.createElement("img");
            img.onload = function(){
                mem.loaded++;
                if (mem.loaded == mem.sets+1) { mem.init(); }
            };
            img.src = '../src/images/'+mem.url+"smiley-"+i+".png";
        }
    },

    // (C) INIT GAME
    init : function () {
        // (C1) RESET
        if (mem.locked != null) {
            clearTimeout(mem.locked);
            mem.locked = null;
        }
        mem.time = 0;
        mem.hCards = [];
        mem.grid = [];
        mem.matches = [],
            mem.moves = 0;
        mem.last = null;
        mem.locked = null;
        mem.hWrap.innerHTML = "";

        // (C2) RANDOM RESHUFFLE CARDS
        // Credits : https://gomakethings.com/how-to-shuffle-an-array-with-vanilla-js/
        let current = mem.sets * 2, temp, random;
        for (var i=1; i<=mem.sets; i++) {
            mem.grid.push(i);
            mem.grid.push(i);
        }
        while (0 !== current) {
            random = Math.floor(Math.random() * current);
            current -= 1;
            temp = mem.grid[current];
            mem.grid[current] = mem.grid[random];
            mem.grid[random] = temp;
        }

        // (C3) CREATE HTML CARDS
        for (let i=0; i<mem.sets * 2; i++) {
            let card = document.createElement("div");
            card.className = "mem-card";
            card.innerHTML = `<img src='../src/images/${mem.url}smiley-0.png'/>`;
            card.dataset.idx = i;
            card.onclick = mem.open;
            mem.hWrap.appendChild(card);
            mem.hCards.push(card);
        }
    },

    // (D) OPEN CARD
    open : function () { if (mem.locked == null) {
        if (mem.time == 0){
            setInterval(function(){
           mem.time++

            }, 100)
        }
        
        // (D1) OPEN SELECTED CARD
        mem.moves++;
        let idx = this.dataset.idx;
        this.innerHTML = `<img src='../src/images/${mem.url}smiley-${mem.grid[idx]}.png'/>`;
        this.onclick = "";
        this.classList.add("open");

        // (D2) NO PREVIOUS GUESS - JUST RECORD AS OPENED
        if (mem.last == null) { mem.last = idx; }

        else {
            // (D3) MATCHED AGAINST PREVIOUS GUESS
            if (mem.grid[idx] == mem.grid[mem.last]) {
                mem.matches.push(mem.last);
                mem.matches.push(idx);
                mem.hCards[mem.last].classList.remove("open");
                mem.hCards[idx].classList.remove("open");
                mem.hCards[mem.last].classList.add("right");
                mem.hCards[idx].classList.add("right");
                mem.last = null;
                if (mem.matches.length == mem.sets * 2) {
                    setTimeout(function(){
                        alert("C'EST LA WIN !"+"\r\n"+"MOUVEMENTS : " + mem.moves+ "\r\n"+"TEMPS : "+(mem.time/10)+" s.");
                        mem.init();
                    }, 100)
                    
                }
            }

            // (D4) NOT MATCHED - CLOSE BOTH CARDS ONLY AFTER A WHILE
            else {
                mem.hCards[mem.last].classList.add("wrong");
                mem.hCards[idx].classList.add("wrong");
                mem.locked = setTimeout(function(){
                    mem.close(idx, mem.last);
                }, mem.hint);
            }
        }
    }},

    // (E) CLOSE PREVIOUSLY MIS-MATCHED CARDS
    close : function (aa, bb) {
        aa = mem.hCards[aa];
        bb = mem.hCards[bb];
        aa.classList.remove("wrong");
        bb.classList.remove("wrong");
        aa.classList.remove("open");
        bb.classList.remove("open");
        aa.innerHTML = `<img src='../src/images/${mem.url}smiley-0.png'/>`;
        bb.innerHTML = `<img src='../src/images/${mem.url}smiley-0.png'/>`;
        aa.onclick = mem.open;
        bb.onclick = mem.open;
        mem.locked = null;
        mem.last = null;
    }
};

// (F) INIT GAME
window.addEventListener("DOMContentLoaded", mem.preload);
