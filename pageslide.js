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
    $(".pspage").each(function () {
      var pageIndex = $(this).index();
      $(this).css({ "top": (vHeight * pageIndex) + "px" });
      //assign ID to each page - starting no.1
      $(this).attr('id', ('pspage' + (pageIndex + 1)));

      //assign ID to each slide - starting no.1
      if ($(this).find('.psslide').length !== 0) {
        $(".psslide").each(function () {
          var slideIndex = $(this).index();
          $(this).attr('id', ('-' + (slideIndex + 1)));
        });
      }
    });
  }

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
    $(".psslide").each(function () {
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
    $(".pspage").removeClass("current");
    $(".pspage").first().addClass("current");
    checkcurrent();
  };

  function goToEnd() {
    var pageCount = $(".pspage").length;
    $(".pswrapper").animate({ "top": (-100 * (pageCount - 1)) + "vh" }, 1000);
    $(".pspage").removeClass("current");
    $(".pspage").last().addClass("current");
    checkcurrent();
  };

  //add page navigation if more than one page
  const pageNavBullets = $("<div class='pageNav'></div>");
  var twoOrMorePages = $(".pspage").length;
  if (twoOrMorePages >= 2) {
    $(".pswrapper").after(pageNavBullets);
  }

  //page navigation nodes generator
  $(".pspage").each(function () {
    var pageid = $(this).attr("id");
    var pagename = $(this).attr("name");
    var plink = $(
      "<a class='page-nav-bull'><span class='plinkdesc'>" +
      pagename +
      "</span></a>"
    ).attr("href", "#" + pageid);
    $(".pageNav").append(plink);
    checkcurrent();

  });

  //page bullet click function
  $(".pageNav a").each(function () {
    var bulIndex = $(this).index();
    var pageOffset = (bulIndex * -vHeight) + "px";
    $(this).click(function () {
      $(".pswrapper").animate({ "top": pageOffset }, 300);
      $(".current").removeClass("current");
      $(".pspage:eq(" + bulIndex + ")").addClass("current");
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

  //wrap slides into container
  $(".pspage").each(function () {
    if($(this).find(".psslide").length) {
      $(this).find(".psslide").wrapAll( "<div class='slideDiv' />");
    }
  });

  //add slide navigation if more than one slide
  $(".slideDiv").each(function () {
    const slideNavBullets = $("<div class='slideBul'></div>");
    const slideArrowLeft = $("<div class='slideNav slideNavL'></div>");
    const slideArrowRight = $("<div class='slideNav slideNavR'></div>");
    var twoOrMoreSlides = $(this).find(".psslide").length;
      if (twoOrMoreSlides >= 2) {
        $(this).after(slideNavBullets);
        $(this).after(slideArrowLeft);
        $(this).after(slideArrowRight);
      }
    });

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
    $(this).find(".psslide").first().addClass("curSlide");
    $(".slideNavL").css("left", "-50px");
  });
  $(".slideNavL").click(function () {
    slideLeft();
  });
  $(".slideNavR").click(function () {
    slideRight();
  });

  //left/right arrow keys
  $(document).on("keydown", function (e) {
    if (e.keyCode === 37) {
      slideLeft();
    }
  });
  $(document).on("keydown", function (e) {
    if (e.keyCode === 39) {
      slideRight();
    }
  });

  //slide navigation nodes generator
  $(".psslide").each(function () {
    var slideid = $(this).attr("id");
    var slidename = $(this).attr("name");

    //add slide name attribute to bullet:
    var slink = $("<a class='slide-nav-bull'><span class='slinkdesc'>" + slidename + "</span></a>").attr("name", slideid);
    $(this).closest(".pspage").find(".slideBul").append(slink);
    $(this).closest(".pspage").find(".slideBul a").first().addClass("current-bull");
  });

  //assign current class for slide nav bullets + show L/R nav arrows
  const slideBullet = $(".slideBul a");

  function checkCurBul() {
    var lastSlideIndex = $(".current .psslide").last().index();
    slideBullet.each(function () {
      var sBulIndex = $(this).index();
      if (sBulIndex == $(".current .curSlide").index()) {
        $(".current .slide-nav-bull").removeClass("current-bull");
        $(".current .slide-nav-bull:eq(" + sBulIndex + ")").addClass("current-bull");

        if (sBulIndex == 0) {
          $(".current .slideNavL").css("left", "-50px");
          $(".current .slideNavR").css("right", "50px");
        }
        else if (sBulIndex == lastSlideIndex) {
          $(".current .slideNavR").css("right", "-50px");
          $(".current .slideNavL").css("left", "50px");
        }
        else {
          $(".current .slideNavL").css("left", "50px");
          $(".current .slideNavR").css("right", "50px");
        }
      }
    });

    getCurSlideHash();
    updateURLhash();

  }

  //slide bullet click function
  slideBullet.each(function () {
    var sBulIndex = $(this).index();
    var slideOffset = (sBulIndex * -100) + "vw";
    $(this).click(function () {
      $(".current .slideDiv").animate({ "left": slideOffset }, 500);
      $(".current .curSlide").removeClass("curSlide");
      $(".current .psslide:eq(" + sBulIndex + ")").addClass("curSlide");
      checkCurBul();
    });
  });


  // fired wheel/touchmove or swipe events counter
  var triggers = 0;
  $(document).on("wheel touchmove", function (e) {
    ++triggers;
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

  function scrollimitLeft() {
    var date = new Date();
    var checkTime = date.getTime();
    if ((checkTime - firstExecution) > interval) {
      firstExecution = checkTime;
      slideRight();
    }
  }

  function scrollimitRight() {
    var date = new Date();
    var checkTime = date.getTime();
    if ((checkTime - firstExecution) > interval) {
      firstExecution = checkTime;
      slideLeft();
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
    if (e.originalEvent.deltaX > 1 && triggers > 0 && triggers < 100) {
      scrollimitLeft()
      triggers = 0;
    }
    if (e.originalEvent.deltaX < -1 && triggers > 0 && triggers < 100) {
      scrollimitRight()
      triggers = 0;
    }
  });

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
    isDragging = false;
  draggingY = 0;
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
    if (draggingY > 7 && dragXlock === false) {
      dragYlock = true;
      dragYPosition();
    }
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
      section.animate({ "top": "-=" + finishDrag + "px" }, 200);
      $(current).removeClass("current");
      $(nextPage).addClass("current");
      correctTopOffset();
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
      section.animate({ "top": "+=" + finishDrag + "px" }, 200);
      $(current).removeClass("current");
      $(prevPage).addClass("current");
      correctTopOffset();
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
      correctLeftOffset();
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
      correctLeftOffset()
    }
    checkCurBul();
    dragXoffset = 0;
    dragX = 0;
  }

  //iOs (height & width - drag) calculation not precise
  function correctTopOffset() {
    curPagePosition = ($(".current").index()) * -vHeight;
    $(".pswrapper").animate({ "top": curPagePosition + "px" }, 100);
  };
  function correctLeftOffset() {
    curSlidePosition = ($(".current .curSlide").index()) * -vWidth;
    $(".current .slideDiv").animate({ "left": curSlidePosition + "px" }, 100);
  };

  /////////////////////////// URL NAVIGATION ////////////////////////

  var checkSlashVal;
  var checkDashVal;
  var pageLengthCheck;
  var slideLengthCheck
  var curSlideUrl;
  var url;
  var URLPageID;
  var URLSlideID;
  var urlTarget;
  var curUrl;

  //navigate to particular page if defined in url
  addEventListener('hashchange', checkHash);

  checkHash();

  function checkHash() {
    url = document.URL;
    checkSlashVal = url.substring(url.lastIndexOf('/') + 1);
    checkDashVal = checkSlashVal.substring(checkSlashVal.lastIndexOf('-') + 1);

    //if page url value exists -> add hash
    if (checkSlashVal) {
      pageLengthCheck = $('#' + (checkSlashVal.split('#').pop().split('-')[0])).length;
      URLPageID = '#' + checkSlashVal.split('#').pop().split('-')[0];
      curUrl = checkSlashVal;
    }

    //if no hash -> add hash of #firstPage;
    if (!checkSlashVal || pageLengthCheck == 0) {
      URLPageID = '#' + $(".pspage").first().attr("id");
      $(".pspage").first().addClass("current");
      window.location.hash = URLPageID;
      return;
    }

    urlTarget = $(URLPageID).index();

    //check if url slide exists
    slideLengthCheck = $(".pspage:eq(" + urlTarget + ")").find(".psslide:eq(" + (checkDashVal - 1) + ")").length;

    if (~checkSlashVal.indexOf("-") && slideLengthCheck == 1) {
      curSlideUrl = ("-" + checkDashVal);
      URLSlideID = parseInt(checkDashVal);
    }

    //if url slide none or non-existing
    if (checkSlashVal.indexOf("-") < 0 || slideLengthCheck !== 1) {
      curSlideUrl = '';
      URLSlideID = 0;
    }

    //go to url defined page
    if (urlTarget !== -1) {
      $(".pswrapper").css("top", -vHeight * urlTarget + "px");
      $(".pspage").removeClass("current");
      $(URLPageID).addClass("current");
      $(".pageNav a").removeClass("current-bull");
      $(".pageNav a:eq(" + urlTarget + ")").addClass("current-bull");
    }

    //go to url defined slide
    if (URLSlideID !== 0) {
      $(".current .slideDiv").css("left", -vWidth * (URLSlideID - 1) + "px");
      $(".current .psslide").removeClass("curSlide");
      $(".current .psslide:eq(" + (URLSlideID - 1) + ")").addClass("curSlide");
      checkCurBul();
    }

    updateURLhash();
  }

  function getCurSlideHash() {
    if ($(".current").find('.curSlide').length !== 0) {
      curSlideUrl = ("-" + ($(".current .curSlide").index() + 1));
    }
    else {
      curSlideUrl = "";
    }
  }

  //update URL.hash 
  function updateURLhash() {
    curUrl = ("#" + $(".current").attr("id")) + curSlideUrl;
    // curUrl = $(".current").attr("id");
    window.location.hash = curUrl;
  }

  //check for movement to update URL
  let mutPage = document.querySelector(".pageNav");
  options = {
    childList: true,
    subtree: true,
    attributeFilter: ['class']
  },
    observer = new MutationObserver(mCallback);

  function mCallback(mutations) {
    for (let mutation of mutations) {
      if (mutation.type === 'attributes') {
        getCurSlideHash();
        updateURLhash();
      }
    }
  }
  observer.observe(mutPage, options);

});