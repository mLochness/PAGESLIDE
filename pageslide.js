//click or touch(not working) page to next fullscreen
$(document).ready(function () {
  $(".page").click(function (event) {
    event.preventDefault();
    if ($(this).next().length) {
      var nextPage = $(this).next(),
        section = $(this).closest(".wrapper");
      section.animate(
        {
          scrollTop: section.scrollTop() + nextPage.offset().top
        },
        700
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
          700
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
          700
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
    if (e.keyCode === 34 || e.keyCode === 40 || e.originalEvent.deltaY > 1) {
      move($(".current"), true);
      checkcurrent();
    }

    if (e.keyCode === 33 || e.keyCode === 38 || e.originalEvent.deltaY < -1) {
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

//navigation nodes generator
$(document).ready(function () {
  $(".page").each(function () {
    var pageid = $(this).attr("id");
    var pagename = $(this).attr("name");
    var slink = $(
      "<a class='nav-bull'><span class='slinkdesc'>" + pagename + "</span></a>"
    ).attr("href", "#" + pageid);
    $(".slideNav").append(slink);
  });
});

//assign current class for nav bullets
function checkcurrent() {
  $(".slideNav a").each(function () {
    var bullhref = $(this).attr("href");
    if (bullhref == "#" + $(".current").attr("id")) {
      $(".slideNav a").removeClass("current-bull");
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
  $(".slideNav a").click(function () {
    var bullhref = $(this).attr("href");
    $(".current").removeClass("current");
    $(bullhref).addClass("current");
    checkcurrent();
  });
});