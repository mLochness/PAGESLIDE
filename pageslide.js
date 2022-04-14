//click or touch page to next fullscreen
$(document).ready(function () {
  $(".slideNum").on("click tap touch touchstart", function (event) {
    event.preventDefault();

    if ($(".current").next().length) {
      var nextPage = $(".current").next(),
        section = $(this).closest(".wrapper");
      section.animate(
        {
          scrollTop: section.scrollTop() + nextPage.offset().top
        },
        300
      );
      $(".current").removeClass("current");
      $(nextPage).addClass("current");
      checkcurrent();
    }
  });
});

//upDown bool true = down ... false = up
$(document).ready(function () {
  function move(current, upDown) {
    if (upDown) {
      if ($(current).next().length) {
        var nextPage = $(current).next(),
          section = $(current).closest(".wrapper");
        section.animate(
          { scrollTop: section.scrollTop() + nextPage.offset().top },
          300
        );
        $(current).removeClass("current");
        $(nextPage).addClass("current");
        console.log("pageDown", $(".current").attr("id"));
        checkcurrent();
      }
    } else {
      if ($(current).prev().length) {
        var prevPage = $(current).prev(),
          section = $(current).closest(".wrapper");
        section.animate(
          { scrollTop: section.scrollTop() + prevPage.offset().top },
          300
        );
        $(current).removeClass("current");
        $(prevPage).addClass("current");
        console.log("pageUp", $(".current").attr("id"));
        checkcurrent();
      }
    }
  }

  $(".page").first().addClass("current");
  $(document).on("keydown wheel touchmove swipe", function (e) {
    if (
      e.keyCode === 34 ||
      e.keyCode === 40 ||
      e.originalEvent.deltaY > 1 ||
      e.originalEvent.detail > 1
    ) {
      move($(".current"), true);
      checkcurrent();
    }

    if (
      e.keyCode === 33 ||
      e.keyCode === 38 ||
      e.originalEvent.deltaY < -1 ||
      -e.originalEvent.detail < -1
    ) {
      move($(".current"), false);
      checkcurrent();
    }
  });
});

// scroll to top button
$(document).ready(function () {
  $(".backtop-btn").click(function () {
    $(".wrapper").animate({ scrollTop: 0 }, 800);
    $(".page").removeClass("current");
    $(".page").first().addClass("current");
    checkcurrent();
  });
});

// fired wheel/touchmove or swipe events counter
var triggers = 0;
$(document).on("wheel", function (e) {
  $(".count").text(++triggers);
});

$(document).on("touchmove swipe", function () {
  $(document).trigger("wheel");
});

//page navigation nodes generator
$(document).ready(function () {
  $(".page").each(function () {
    var pageid = $(this).attr("id");
    var pagename = $(this).attr("name");
    var slink = $(
      "<a class='page-nav-bull'><span class='slinkdesc'>" +
        pagename +
        "</span></a>"
    ).attr("href", "#" + pageid);
    $(".pageNav").append(slink);
    $(".pageNav a").first().addClass("current-bull");

  });
});

//assign current class for nav bullets
function checkcurrent() {
  $(".pageNav a").each(function () {
    var bullhref = $(this).attr("href");
    if (bullhref == "#" + $(".current").attr("id")) {
      $(".pageNav a").removeClass("current-bull");
      $(this).addClass("current-bull");
      console.log(
        bullhref,
        "=",
        "#" + $(".current").attr("id"),
        bullhref == "#" + $(".current").attr("id"),
        "checkcurrent fired"
      );
    }
  });
}

//bullet navigation - assign current page class
$(document).ready(function () {
  $(".pageNav a").click(function () {
    var bullhref = $(this).attr("href");
    $(".current").removeClass("current");
    $(bullhref).addClass("current");
    checkcurrent();
  });
});

// slide to side
function slideLeft() {
  var prevSlide = $(".current .curSlide").prev();
  if ($(prevSlide).length) {
    $(".current .slideDiv").animate({ left: "+=100vw" }, 300);
    $(".curSlide").removeClass("curSlide");
    $(prevSlide).addClass("curSlide");
  } else {
    $(".current .curSlide").effect("shake", { times: 1 }, 200);
  }
}

function slideRight() {
  var nextSlide = $(".current .curSlide").next();
  if ($(nextSlide).length) {
    $(".current .slideDiv").animate({ left: "-=100vw" }, 300);
    $(".curSlide").removeClass("curSlide");
    $(nextSlide).addClass("curSlide");
  } else {
    $(".current .curSlide").effect("shake", { times: 1 }, 200);
  }
}

$(document).ready(function () {
  $(".spslide").first().addClass("curSlide");
  $(".slideNavL").click(function () {
    slideLeft();
    console.log("left arrow Nav");
  });
  $(".slideNavR").click(function () {
    slideRight();
    console.log("right arrow Nav");
  });

  $(document).on("keydown touchmove swipe", function (e) {
    if (e.keyCode === 37 || e.originalEvent.deltaX < 1) {
      slideLeft();
      console.log("left arrow key");
    }
  });
  $(document).on("keydown touchmove swipe", function (e) {
    if (e.keyCode === 39 || e.originalEvent.deltaX < -1) {
      slideRight();
      console.log("right arrow key");
    }
  });
});