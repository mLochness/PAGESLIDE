$(document).ready(function () {
 
  //prep for drag or touch move firing scroll to next/prev page/slide
  $('.wrapper').draggable({axis: "y", revert: true});
  $('.slideDiv').draggable({axis: "x", revert: true});
  
 //click or touch element to next fullscreen
  $(".slideNum")
  .on("click", function () {
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


 //mobile touchmove Y  
  var lastY;
$(document).on('touchmove', function (e){
  //e.preventDefault();
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
     var currentY = e.originalEvent.touches[0].clientY;
     if(currentY > lastY+60){
         move($(".current"), true);
       console.log("touchDown");
     }else if(currentY < lastY-60){
         move($(".current"), false);
       console.log("touchUp");
     }
     lastY = currentY;
    }
});

//mobile touchmove X
  var lastX;
$(document).on('touchmove', function (e){
  e.preventDefault();
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
     var currentX = e.originalEvent.touches[0].clientX;
     if(currentX > lastX+60){
         slideRight();
       console.log("swipeRight");
     }else if(currentX < lastX-60){
         slideLeft();
       console.log("swipeLeft");
     }
     lastX = currentX;
    }
});

  //upDown bool true = down ... false = up
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
  $(document).on("keydown", function (e) {
    if (
      e.keyCode === 34 || e.keyCode === 40 
    ) {
      move($(".current"), true);
    }

    if (
      e.keyCode === 33 || e.keyCode === 38
    ) {
      move($(".current"), false);
    }
  });
 
  // scroll to next button
  $(".next-btn").click(function (e) {
    e.preventDefault(); 
    if($(".current").next().length) {
    var nextPage = $(".current").next(),
        section = $(".current").closest(".wrapper");
    section.animate({scrollTop: section.scrollTop() + nextPage.offset().top }, 300);
      $(".current").removeClass("current");
      $(nextPage).addClass("current");
      checkcurrent();
      console.log("next Button");
   }
  });
  // scroll to top button
  $(".backtop-btn").click(function () {
    $(".wrapper").animate({ scrollTop: 0 }, 800);
    $(".page").removeClass("current");
    $(".page").first().addClass("current");
    checkcurrent();
  });

  //page navigation nodes generator
  $(".page").each(function () {
    var pageid = $(this).attr("id");
    var pagename = $(this).attr("name");
    var plink = $(
      "<a class='page-nav-bull'><span class='plinkdesc'>" +
        pagename +
        "</span></a>"
    ).attr("href", "#" + pageid);
    $(".pageNav").append(plink);
    $(".pageNav a").first().addClass("current-bull");

  });

  //assign current class for page nav bullets
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
  $(".pageNav a").click(function () {
    var bullhref = $(this).attr("href");
   $(".current").removeClass("current");
    $(bullhref).addClass("current");
    checkcurrent();
    console.log(bullhref);
  });

  // slide to side
  function slideLeft() {
    var prevSlide = $(".current .curSlide").prev();
    if ($(prevSlide).length) {
      //$(".current .slideDiv").animate({ left: "+=100vw" }, 300);
      $(".current .slideDiv").animate({ "left": "+=100vw" }, 300);
      $(".current .curSlide").removeClass("curSlide");
      $(prevSlide).addClass("curSlide");
      checkCurBul();
    } else {
      $(".current .curSlide").effect("shake", { times: 1 }, 200);
    }
  }

  function slideRight() {
    var nextSlide = $(".current .curSlide").next();
    if ($(nextSlide).length) {
      //$(".current .slideDiv").animate({ left: "-=100vw" }, 300);
      $(".current .slideDiv").animate({ "left": "-=100vw" }, 300);
      $(".current .curSlide").removeClass("curSlide");
      $(nextSlide).addClass("curSlide");
      checkCurBul();
    } else {
      $(".current .curSlide").effect("shake", { times: 1 }, 200);
    }
  }

  //get slideDiv width from No. of slides
  $(".slideDiv").each(function () {
    //var slideCount = $(".spslide").length;
    var slideCount = $(this).children().length;
    var autoWidth = $(this);
    autoWidth.css({ width: autoWidth.width() * slideCount });
    console.log($(this).parent().attr("id"),"slides:", slideCount);
  });
   
  //get offset +100vw for each slide from index
  $(".spslide").each(function () {
    var slideIndex = $(this).index();
    $(this).css({"left" : (100*slideIndex) +"vw"});
  });
  
  $(".slideDiv").each(function () {
    $(this).find(".spslide").first().addClass("curSlide");
  });
  $(".slideNavL").click(function () {
    slideLeft();
    console.log("left arrow Nav");
  });
  $(".slideNavR").click(function () {
    slideRight();
    console.log("right arrow Nav");
  });

  //wheel for mouse with X-axis scrolling
  $(document).on("keydown wheel", function (e) {
    if (e.keyCode === 37 || e.originalEvent.deltaX > 1 && triggers > 5) {
      slideLeft();
      triggers = 0;
      console.log("left arrow key");
    }
  });
  $(document).on("keydown wheel", function (e) {
    if (e.keyCode === 39 || e.originalEvent.deltaX < -1 && triggers > 5) {
      slideRight();
      triggers = 0;
      console.log("right arrow key");
    }
  });
  
    //slide navigation nodes generator
     $(".spslide").each(function() {
    var slideid = $(this).attr("id");
    var slidename = $(this).attr("name");
 
     //add name attribute to bullet:
    var slink = $("<a class='slide-nav-bull'><span class='slinkdesc'>" + slidename + "</span></a>" ).attr("name", slideid);
    $(this).closest(".page").find(".slideBul").append(slink);
    $(this).closest(".page").find(".slideBul a").first().addClass("current-bull");
      });
  
    //assign current class for slide nav bullets
    function checkCurBul() {
    $(".slideBul a").each(function () {
      var bullhref = $(this).attr("name");
      if (bullhref == $(".current .curSlide").attr("id")) {
        $(".current .slideBul a").removeClass("current-bull");
        $(this).addClass("current-bull");
        console.log( bullhref, "=", $(".current .curSlide").attr("id"), "checkCurBul fired");
      }
    });
  }
  

  //slide bullet click function
    $(".slideBul a").each(function(){
      var sBulIndex = $(this).index();
      var slideOffset = (sBulIndex*-100)+"vw";
        $(this).click(function(){
        $(".current .slideDiv").animate({ "left": slideOffset }, 300);
        $(".current .curSlide").removeClass("curSlide");
        $(".current .spslide:eq("+sBulIndex+")").addClass("curSlide");
        console.log("sBulIndex =", sBulIndex, "slideOffset =", slideOffset);
        checkCurBul();
     });
   });
  
  
   // fired wheel/touchmove or swipe events counter
   // limit multiple wheel triggers to one move - not solved yet
  var triggers = 0;
  $(document).on("wheel touchmove", function (e) {
   $(".count").text(++triggers);
    if (
     e.originalEvent.deltaY > 1 && triggers > 25
    ) {
      move($(".current"), true);
      triggers = 0;
    }
    if (
     e.originalEvent.deltaY < -1 && triggers > 25
    ) {
      move($(".current"), false);
      triggers = 0;
    }
  });
  
    
});