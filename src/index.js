import $ from "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";
import Hangman from "./js/hangman.js";

let word;
let dummyArray = [];
let usedLettersArray = [];
let letterArray = [];

function showDummy() {
  $("#dummy-box").show();
  $("ul#dummy-array").empty();
  for (let i = 0; i < letterArray.length; i++) {
    if (dummyArray[i] === undefined) {
      $("ul#dummy-array").append("<li> </li>");
    } else {
      $("ul#dummy-array").append(`<li>${dummyArray[i]}</li>`);
    }
  }
}

function changeClass(className) {
  let id = parseInt(className.substr(3)) + 1;
  className = className.substr(0, 3) + id;
  return className;
}

function endGame() {
  let win = true;
  for (let i = 0; i < letterArray.length; i++) {
    if (dummyArray[i] !== letterArray[i]) {
      win = false;
    }
  }

  if (win) {
    $(".endgame").html("You won!");
    setTimeout(function () {
      startOver();
      $("#play-box").hide();
    }, 3000);
  }

  if (usedLettersArray.length == 10) {
    $(".endgame").html("You lost!");
    $("#word-box").show();
    setTimeout(function () {
      startOver();
      $("#play-box").hide();
    }, 3000);
  }
}

function checkLetter(inputLetter) {
  if (word.includes(inputLetter)) {
    for (let i = 0; i < letterArray.length; i++) {
      if (inputLetter === letterArray[i]) {
        dummyArray[i] = inputLetter;
        showDummy();
      }
    }
  } else if (usedLettersArray.includes(inputLetter)) {
    $(".showErrors").text("You have already tried that letter");
  } else {
    let imgClass = $("#hangman").attr("class");
    $("#hangman").removeClass(imgClass);
    $("#hangman").addClass(changeClass(imgClass));
    usedLettersArray.push(inputLetter);
    $("#used-letters-box").show();
    $("#used-letters").append(`<li>${inputLetter}</li>`);
  }
  endGame();
}

function startOver() {
  dummyArray = [];
  usedLettersArray = [];
  letterArray = [];
  word = "";
  $("#word-box").hide();
  $("#used-letters-box").hide();
  $("#used-letters").empty();
  $(".endgame").empty();
  $("#hangman").attr("class", "");
  $("#hangman").addClass("man0");
  $("#dummy-box").hide();
  $("#dummy-array").empty();
  $("#play-box").show();
}

$(document).ready(function () {
  $("#play").click(function () {
    startOver();

    let promise = Hangman.getDino();

    promise.then(
      function (response) {
        word = response.replace(/[^A-Za-z']/g, "").toLowerCase();
        $("word-box").show();
        $("#word").html(word);
        letterArray = word.split("");
        showDummy();
      },
      function (error) {
        $(".showErrors").text(`There was an error processing your request: ${error}`);
      }
    );
  });

  $("#submit").click(function () {
    $(".showErrors").empty();
    const letter = $("input#letter").val().toLowerCase();
    $("input#letter").val("");
    checkLetter(letter);
  });
});
