$(document).ready(function () {

  var vHeight;
  var vWidth;

  getWindowSize();
  pagesLayout();

  function getWindowSize() {
    vHeight = document.documentElement.clientHeight;
    document.documentElement.style.setProperty('--vHeight', `${vHeight}px`);

    vWidth = $(document).width();

    $(".heightInfo").text(window.screen.height + "px");
    $(".pageMove").text(vHeight + "px");
  }

  $(".page").first().addClass("current");
  var holdResize;
  $(window).resize(function () {
    getWindowSize();
    clearTimeout(holdResize);
    holdResize = setTimeout(pagesLayout, 1000);
    var curIndex = $(".current").index();
    var topOffset = (curIndex * -vHeight) + "px";
    $(".pswrapper").animate({ "top": topOffset }, 300);
  });



  //get offset 1 window height for each page from index
  function pagesLayout() {
    $(".page").each(function () {
      var pageIndex = $(this).index();
      $(this).css({ "top": (vHeight * pageIndex) + "px" });
    });
    console.log("pagesLayout done");
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
    //var pageOffset = (bulIndex * -100) + "vh";
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
      $(".current .slideDiv").animate({ "left": "+=100vw" }, 500);
      $(".current .curSlide").removeClass("curSlide");
      $(prevSlide).addClass("curSlide");
      checkCurBul();
    } else {
      shakeLast();
    }
  }
  // slide to right
  function slideRight() {
    var nextSlide = $(".current .curSlide").next();
    if ($(nextSlide).length) {
      $(".current .slideDiv").animate({ "left": "-=100vw" }, 500);
      $(".current .curSlide").removeClass("curSlide");
      $(nextSlide).addClass("curSlide");
      checkCurBul();
    } else {
      shakeLast();
    }
  }
  // shake if no more slides exist
  function shakeLast() {
    $(".current .curSlide").effect("shake", { times: 1 }, 200);
  }

  //get slideDiv width from No. of slides 
  $(".slideDiv").each(function () {
    var slideCount = $(this).children().length;
    var autoWidth = $(this);
    autoWidth.css({ width: autoWidth.width() * slideCount });
  });

  //get offset +100vw for each slide from index
  $(".spslide").each(function () {
    var slideIndex = $(this).index();
    $(this).css({ "left": (100 * slideIndex) + "vw" });
  });

  $(".slideDiv").each(function () {
    $(this).find(".spslide").first().addClass("curSlide");
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

  //assign current class for slide nav bullets
  const slideBullet = $(".slideBul a");

  function checkCurBul() {
    slideBullet.each(function () {
      var sBulIndex = $(this).index();
      if (sBulIndex == $(".current .curSlide").index()) {
        $(".current .slide-nav-bull").removeClass("current-bull");
        $(".current .slide-nav-bull:eq(" + sBulIndex + ")").addClass("current-bull");
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
  var startingX,
    startingY,
    movingX,
    movingY,
    dragYstart,
    dragYcurrent,
    dragYstop,
    dragYoffset,
    curPagePosition;
  dragY = 0,
    isDragging = false,
    draggingY = 0,
    draggingX = 0;

  pswrapper.addEventListener("pointerdown", pointerDown);
  pswrapper.addEventListener("pointerup", pointerUp);
  pswrapper.addEventListener("pointercancel", pointerUp);

  function pointerDown(e) {
    //pswrapper.setPointerCapture(e.pointerId);
    dragYstart = e.clientY;
    //console.log("dragYstart:", dragYstart);
    curPagePosition = ($(".current").index()) * vHeight;
    startingX = e.pageX;
    startingY = e.pageY;

    isDragging = true;
    pswrapper.addEventListener("pointermove", pointerMove);
  }

  function pointerMove(e) {
    e.preventDefault();

    movingX = e.pageX;
    movingY = e.pageY;
    dragYcurrent = e.clientY;
    if (isDragging = true) {
      XorYdrag();
      pswrapper.classList.add("grabbing");
    }
  }

  function pointerUp(e) {
    dragYstop = e.clientY;
    dragYoffset = dragYstart - dragYstop;

    //dragging prevents firing on click
    if (startingX + 30 < movingX && draggingX > 30) {
      slideLeft();
    } else if (startingX - 30 > movingX && draggingX < -30) {
      slideRight();
    }
    if (dragYoffset < 30 && dragY > 30 && $(".current").prev().length) {
      dragmoveDown();
    }
    else if (dragYoffset > 30 && dragY < -30 && $(".current").next().length) {
      dragmoveUp();
    }
    else {
      $(".pswrapper").animate({ "top": -curPagePosition + "px" }, 100);
    }

    isDragging = false;
    startingX = 0;
    startingY = 0;
    movingX = 0;
    movingY = 0;

    $(".current .slideDiv").css({
      "transition": "transform 0.25s ease-out 0.25s",
      "transform": "translateX(0)"
    });

    draggingX = 0;
    //   draggingY = 0;


    //x-drag css 
    setTimeout(function () {
      $(".pswrapper").css({ "transition": "none" });
      $(".current .slideDiv").css({ "transition": "none" });
    }, 500);


    pswrapper.removeEventListener("pointermove", pointerMove);
    pswrapper.classList.remove("grabbing");
  }

  //dragging enabled in one axis only - buggy so far:
  function XorYdrag() {
    draggingY = Math.abs(movingY - startingY);
    draggingX = Math.abs(movingX - startingX);
    if (draggingY > draggingX) {
      draggingX = 0;
      dragYPosition();
    } else {
      draggingY = 0;
      dragXPosition();
    }
  }

  function dragYPosition() {
    dragY = dragYcurrent - dragYstart;
    $(".pswrapper").css("top", -curPagePosition + dragY + "px");
  }

  function dragXPosition() {
    draggingX = movingX - startingX;
    $(".current .slideDiv").css("transform", "translateX(" + draggingX + "px)");
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
    }/* else {
      section.animate({ "top": "-=" + dragYoffset + "px" }, 100);
    }*/
    checkcurrent();
    //console.log("finishDrag:", finishDrag);
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
    } /*else {
      section.animate({ "top": "+=" + dragYoffset + "px" }, 100);
    }*/
    checkcurrent();
    //console.log("finishDrag:", finishDrag);
    dragYoffset = 0;
    dragY = 0;
  }

});
