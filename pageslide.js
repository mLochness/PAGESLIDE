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
        console.log("pageDown");
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
        console.log("pageUp");
      }
    }
  }

  $(".page").first().addClass("current");
  $(document).on("keydown wheel touchmove swipe", function (e) {
    if (e.keyCode === 34 || e.keyCode === 40 || e.originalEvent.deltaY > 1) {
      move($(".current"), true);
    }

    if (e.keyCode === 33 || e.keyCode === 38 || e.originalEvent.deltaY < -1) {
      move($(".current"), false);
    }
  });
});

// scroll to top button
$(".backtop-btn").click(function () {
  $(".wrapper").animate({ scrollTop: 0 }, 800);
  $(".page").removeClass("current");
  $(".page").first().addClass("current");
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
    var slink = $("<a class='nav-bull'><span class='slinkdesc'>" + pagename + "</span></a>").attr("href", "#" + pageid);
     $(".slideNav").append(slink);
    
  });  
});


 //current page class --> current bullet class sync
$(document).ready(function () {
  //var currentpageid = $(".current").attr("id");
   
  $(".slideNav a").click(function () {
      var bullhref = $(this).attr("href");
      $(".current").removeClass("current");
      $(bullhref).addClass("current");
      
      console.log(bullhref, "#"+ $(".current").attr("id"));
    });
  
  $(".slideNav a").each(function () {
        var bullhref = $(this).attr("href");
      //if(bullhref === ("#" + currentpageid)) { 
    if(bullhref === "#" + $(".current").attr("id")) {
      $(this).addClass("current-bull");
    } else {
      $(this).removeClass("current-bull");
    }
   });
});