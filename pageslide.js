$(document).ready(function () {

  var vHeight;
  var vWidth;

  getWindowSize();
  pagesLayout();

  function getWindowSize() {
    vHeight = document.documentElement.clientHeight;
    document.documentElement.style.setProperty('--vHeight', `${vHeight}px`);
    vWidth = document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--vWidth', `${vWidth}px`);
  }

  //get offset 1 window height for each page from index
  function pagesLayout() {
    $(".page").each(function () {
      var pageIndex = $(this).index();
      $(this).css({ "top": (vHeight * pageIndex) + "px" });
    });
  }

  $(".page").first().addClass("current");

  slidesContainerWidth();
  slidesLayout();

  function slidesContainerWidth() {
    //get each slideDiv's width from No. of slides 
    $(".slideDiv").each(function () {
      var slideCount = $(this).children().length;
      $(this).css({ width: vWidth * slideCount + "px" });
    });
  }

  function slidesLayout() {
    //get offset +1 screen width for each slide
    $(".spslide").each(function () {
      var slideIndex = $(this).index();
      $(this).css({ "left": (vWidth * slideIndex) + "px" });
    });
  }

  function asyncProxy(fn, options, ctx) {
    // fix for page freezing on window resize 
    //  Author: yanick.rochon@gmail.com  //  License: MIT
    var timer = null;
    var counter = 0;
    var _call = function (args) {
      counter = 0;

      fn.apply(ctx, args);
    };

    ctx = ctx || window;
    options = $.extend({
      delay: 0,
      stack: Infinity
    }, options);

    return function () {
      counter++;

      // prevent calling the delayed function multiple times
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      if (counter >= options.stack) {
        _call(arguments);
      } else {
        var args = arguments;

        timer = setTimeout(function () {
          timer = null;
          _call(args);
        }, options.delay);
      }
    };
  }

  var holdResize = asyncProxy(function (event) {
    getWindowSize();
    pagesLayout();
    slidesContainerWidth();
    slidesLayout();
    alignPageAfterResize();
    alignSlideAfterResize();
  }, {
    delay: 250
  });

  $(window).on('resize', holdResize);

  function alignPageAfterResize() {
    var curIndex = $(".current").index();
    var topOffset = (curIndex * -vHeight) + "px";
    $(".pswrapper").animate({ "top": topOffset }, 300);
  }

  function alignSlideAfterResize() {
    var curSlideIndex = $(".current .curSlide").index();
    var leftOffset = (curSlideIndex * -vWidth) + "px";
    $(".current .slideDiv").animate({ "left": leftOffset }, 300);
  }

  //page bullet click function
  $(".pageNav a").each(function () {
    var bulIndex = $(this).index();
    //var pageOffset = (bulIndex * -100) + "vh";
    var pageOffset = (bulIndex * -vHeight) + "px";
    $(this).click(function () {
      $(".pswrapper").animate({ "top": pageOffset }, 500);
      $(".current").removeClass("current");
      $(".page:eq(" + bulIndex + ")").addClass("current");
      checkcurrent();
    });
  });

  function moveUp() {
    current = $(".current");
    if ($(current).next().length) {
      var nextPage = $(current).next(),
        section = $(current).closest(".pswrapper");
      //section.animate({ "top": "-=100vh" }, 500);
      section.animate({ "top": "-=" + vHeight + "px" }, 500);
      $(current).removeClass("current");
      $(nextPage).addClass("current");
    }
    checkcurrent();
  }

  function moveDown() {
    current = $(".current");
    if ($(current).prev().length) {
      var prevPage = $(current).prev(),
        section = $(current).closest(".pswrapper");
      //section.animate({ "top": "+=100vh" }, 500);
      section.animate({ "top": "+=" + vHeight + "px" }, 500);
      $(current).removeClass("current");
      $(prevPage).addClass("current");
    }
    checkcurrent();
  }

  $(document).on("keydown", function (e) {
    //PgDown || DownArrow key
    if (
      e.keyCode === 34 || e.keyCode === 40
    ) {
      moveUp();
    }
    //PgUp || UpArrow key
    if (
      e.keyCode === 33 || e.keyCode === 38
    ) {
      moveDown();
    }
    //Home key
    if (
      e.keyCode === 36
    ) {
      goToTop();
    }
    //End key
    if (
      e.keyCode === 35
    ) {
      goToEnd();
    }
  });

  // next button
  $(".next-btn").click(function (e) {
    e.preventDefault();
    if ($(".current").next().length) {
      moveUp();
    }
  });

  // scroll to top button
  $(".backtop-btn").click(function () {
    goToTop();
  });

  function goToTop() {
    $(".pswrapper").animate({ "top": "0" }, 1000);
    $(".page").removeClass("current");
    $(".page").first().addClass("current");
    checkcurrent();
  };

  function goToEnd() {
    var pageCount = $(".page").length;
    $(".pswrapper").animate({ "top": (-100 * (pageCount - 1)) + "vh" }, 1000);
    $(".page").removeClass("current");
    $(".page").last().addClass("current");
    checkcurrent();
  };

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

  //page bullet click function
  $(".pageNav a").each(function () {
    var bulIndex = $(this).index();
    var pageOffset = (bulIndex * -vHeight) + "px";
    $(this).click(function () {
      $(".pswrapper").animate({ "top": pageOffset }, 300);
      $(".current").removeClass("current");
      $(".page:eq(" + bulIndex + ")").addClass("current");
      checkcurrent();
    });
  });

  //assign current class for page nav bullets
  function checkcurrent() {
    $(".pageNav a").each(function () {
      var pBulIndex = $(this).index();
      if (pBulIndex == $(".current").index()) {
        $(".pageNav a").removeClass("current-bull");
        $(".pageNav a:eq(" + pBulIndex + ")").addClass("current-bull");
      }
    });
  }

  // slide to left
  function slideLeft() {
    var prevSlide = $(".current .curSlide").prev();
    if ($(prevSlide).length) {
      $(".current .slideDiv").animate({ "left": "+=" + vWidth + "px" }, 500);
      $(".current .curSlide").removeClass("curSlide");
      $(prevSlide).addClass("curSlide");
      checkCurBul();
    }
  }
  // slide to right
  function slideRight() {
    var nextSlide = $(".current .curSlide").next();
    if ($(nextSlide).length) {
      $(".current .slideDiv").animate({ "left": "-=" + vWidth + "px" }, 500);
      $(".current .curSlide").removeClass("curSlide");
      $(nextSlide).addClass("curSlide");
      checkCurBul();
    }
  }

  $(".slideDiv").each(function () {
    $(this).find(".spslide").first().addClass("curSlide");
    $(".slideNavL").css("left", "-50px");
  });
  $(".slideNavL").click(function () {
    slideLeft();
  });
  $(".slideNavR").click(function () {
    slideRight();
  });

  //left/right arrow keys & wheel for mouse with X-axis slide scroll
  $(document).on("keydown wheel", function (e) {
    if (e.keyCode === 37 || e.originalEvent.deltaX > 1) {
      slideLeft();
      triggers = 0;
    }
  });
  $(document).on("keydown wheel", function (e) {
    if (e.keyCode === 39 || e.originalEvent.deltaX < -1) {
      slideRight();
      triggers = 0;
    }
  });

  //slide navigation nodes generator
  $(".spslide").each(function () {
    var slideid = $(this).attr("id");
    var slidename = $(this).attr("name");

    //add name attribute to bullet:
    var slink = $("<a class='slide-nav-bull'><span class='slinkdesc'>" + slidename + "</span></a>").attr("name", slideid);
    $(this).closest(".page").find(".slideBul").append(slink);
    $(this).closest(".page").find(".slideBul a").first().addClass("current-bull");
  });

  //assign current class for slide nav bullets + show L/R nav arrows
  const slideBullet = $(".slideBul a");
    
  function checkCurBul() {
    var lastSlideIndex = $(".current .spslide").last().index();
    slideBullet.each(function () {
      var sBulIndex = $(this).index();
      if (sBulIndex == $(".current .curSlide").index()) {
        $(".current .slide-nav-bull").removeClass("current-bull");
        $(".current .slide-nav-bull:eq(" + sBulIndex + ")").addClass("current-bull");
      
        if (sBulIndex == 0) {
          $(".current .slideNavL").css("left", "-50px");
          $(".current .slideNavR").css("right", "50px");
        }
        else if (sBulIndex == lastSlideIndex ) {
          $(".current .slideNavR").css("right", "-50px");
          $(".current .slideNavL").css("left", "50px");
        }
        else {
          $(".current .slideNavL").css("left", "50px");
          $(".current .slideNavR").css("right", "50px");
        }
      console.log("sBulIndex:", sBulIndex);
      console.log("lastSlideIndex:", lastSlideIndex);
      console.log("currentSlideIndex:", $(".current .curSlide").index());
      }
    });
  }

  //slide bullet click function
  slideBullet.each(function () {
    var sBulIndex = $(this).index();
    var slideOffset = (sBulIndex * -100) + "vw";
    $(this).click(function () {
      $(".current .slideDiv").animate({ "left": slideOffset }, 500);
      $(".current .curSlide").removeClass("curSlide");
      $(".current .spslide:eq(" + sBulIndex + ")").addClass("curSlide");
      checkCurBul();
    });
  });


  // fired wheel/touchmove or swipe events counter
  var triggers = 0;
  $(document).on("wheel touchmove", function (e) {
    $(".count").text(++triggers);
  });

  // limit multiple wheel triggers to one move - mouse inertia timeout
  var firstExecution = 0; // Store the first execution time
  var interval = 800; // timeout another wheel event

  function scrollimitDown() {
    var date = new Date();
    var checkTime = date.getTime();
    if ((checkTime - firstExecution) > interval) {
      firstExecution = checkTime;
      moveUp();
    }
  }

  function scrollimitUp() {
    var date = new Date();
    var checkTime = date.getTime();
    if ((checkTime - firstExecution) > interval) {
      firstExecution = checkTime;
      moveDown();
    }
  }

  $(document).on("wheel", function (e) {
    if (e.originalEvent.deltaY > 1 && triggers > 0 && triggers < 100) {
      scrollimitDown()
      triggers = 0;
    }
    if (e.originalEvent.deltaY < -1 && triggers > 0 && triggers < 100) {
      scrollimitUp()
      triggers = 0;
    }
  });

  /*
    //slide bullets on mobile overlapped by tab/address bar - position modification
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      $('.slideBul').css({ "bottom": 80 + "px" });
    };
  */

  //touch/mouse navigation with drag
  const pswrapper = document.querySelector(".pswrapper");
  var dragYstart,
    dragXstart,
    dragYcurrent,
    dragXcurrent,
    dragYstop,
    dragXstop,
    dragYoffset,
    dragXoffset,
    curPagePosition,
    curSlidePosition = 0,
    dragY = 0,
    dragX = 0,
    isDragging = false,
    draggingY = 0,
    draggingX = 0;

  pswrapper.addEventListener("pointerdown", pointerDown);
  pswrapper.addEventListener("pointerup", pointerUp);
  pswrapper.addEventListener("pointercancel", pointerUp);

  //pswrapper.addEventListener("pointerout", pointerUp);

  function pointerDown(e) {
    //pswrapper.setPointerCapture(e.pointerId);
    dragYstart = e.clientY;
    dragXstart = e.clientX;
    curPagePosition = ($(".current").index()) * vHeight;
    curSlidePosition = ($(".current .curSlide").index()) * vWidth;
    isDragging = true;
    pswrapper.addEventListener("pointermove", pointerMove);
  }

  function pointerMove(e) {
    //e.preventDefault();
    dragYcurrent = e.clientY;
    dragXcurrent = e.clientX;
    if (isDragging = true) {
      XorYdrag();
      pswrapper.classList.add("grabbing");
    }
  }

  function pointerUp(e) {
    dragYstop = e.clientY;
    dragYoffset = dragYstart - dragYstop;
    dragXstop = e.clientX;
    dragXoffset = dragXstart - dragXstop;

    //dragging prevents firing on click
    if (dragXoffset < 30 && dragX > 30 && $(".current .curSlide").prev().length) {
      dragmoveRight();
    }
    else if (dragXoffset > 30 && dragX < -30 && $(".current .curSlide").next().length) {
      dragmoveLeft();
    }
    else if (dragYoffset < 30 && dragY > 30 && $(".current").prev().length) {
      dragmoveDown();
    }
    else if (dragYoffset > 30 && dragY < -30 && $(".current").next().length) {
      dragmoveUp();
    }
    else {
      //not a drag, get back to position 
      $(".pswrapper").animate({ "top": -curPagePosition + "px" }, 100);
      $(".current .slideDiv").animate({ "left": -curSlidePosition + "px" }, 100);
    }

    isDragging = false;
    dragYlock = false;
    dragXlock = false;

    pswrapper.removeEventListener("pointermove", pointerMove);
    pswrapper.classList.remove("grabbing");
  }

  var dragYlock = false;
  var dragXlock = false;

  //dragging in one axis at a time
  function XorYdrag() {
    draggingY = Math.abs(dragYcurrent - dragYstart);
    draggingX = Math.abs(dragXcurrent - dragXstart);
    //if (draggingY > draggingX) {
    if (draggingY > 7 && dragXlock === false) {
      dragYlock = true;
      dragYPosition();
    }
    //else if (draggingX > draggingY && dragLock === false) {
    if (draggingX > 7 && dragYlock === false) {
      dragXlock = true;
      dragXPosition()
    }
  }

  function dragYPosition() {
    dragY = dragYcurrent - dragYstart;
    $(".pswrapper").css("top", -curPagePosition + dragY + "px");
  }

  function dragXPosition() {
    dragX = dragXcurrent - dragXstart;
    //$(".current .slideDiv").css("transform", "translateX(" + draggingX + "px)");
    $(".current .slideDiv").css("left", -curSlidePosition + dragX + "px");
  }

  function dragmoveUp() {
    var finishDrag = vHeight - dragYoffset;
    current = $(".current");
    if ($(current).next().length) {
      var nextPage = $(current).next();
      section = $(current).closest(".pswrapper");
      section.animate({ "top": "-=" + finishDrag + "px" }, 250);
      $(current).removeClass("current");
      $(nextPage).addClass("current");
    }
    checkcurrent();
    dragYoffset = 0;
    dragY = 0;
  }

  function dragmoveDown() {
    var finishDrag = vHeight + dragYoffset;
    current = $(".current");
    if ($(current).prev().length) {
      var prevPage = $(current).prev(),
        section = $(current).closest(".pswrapper");
      section.animate({ "top": "+=" + finishDrag + "px" }, 250);
      $(current).removeClass("current");
      $(prevPage).addClass("current");
    }
    checkcurrent();
    dragYoffset = 0;
    dragY = 0;
  }

  function dragmoveLeft() {
    var finishDrag = vWidth - dragXoffset;
    current = $(".current .curSlide");
    if ($(current).next().length) {
      var nextSlide = $(current).next();
      section = $(current).closest(".slideDiv");
      section.animate({ "left": "-=" + finishDrag + "px" }, 250);
      $(current).removeClass("curSlide");
      $(nextSlide).addClass("curSlide");
    }
    checkCurBul();
    dragXoffset = 0;
    dragX = 0;
  }

  function dragmoveRight() {
    var finishDrag = vWidth + dragXoffset;
    current = $(".current .curSlide");
    if ($(current).prev().length) {
      var prevSlide = $(current).prev(),
        section = $(current).closest(".slideDiv");
      section.animate({ "left": "+=" + finishDrag + "px" }, 250);
      $(current).removeClass("curSlide");
      $(prevSlide).addClass("curSlide");
    }
    checkCurBul();
    dragXoffset = 0;
    dragX = 0;
  }

});
