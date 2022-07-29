$(document).ready(function () {

  $(".page").first().addClass("current");

  //get offset +100vh for each page from index
  $(".page").each(function () {
    var pageIndex = $(this).index();
    $(this).css({ "top": (100 * pageIndex) + "vh" });
  });

  //page bullet click function
  $(".pageNav a").each(function () {
    var bulIndex = $(this).index();
    var pageOffset = (bulIndex * -100) + "vh";
    $(this).click(function () {
      $(".wrapper").animate({ "top": pageOffset }, 300);
      $(".current").removeClass("current");
      $(".page:eq(" + bulIndex + ")").addClass("current");
      console.log("bulIndex =", bulIndex, "slideOffset =", pageOffset);
      checkcurrent();
    });
  });

  //upDown bool true = down ... false = up
  function move(current, upDown) {
    if (upDown) {
      if ($(current).next().length) {
        var nextPage = $(current).next(),
          section = $(current).closest(".wrapper");
        section.animate({ "top": "-=100vh" }, 500);
        $(current).removeClass("current");
        $(nextPage).addClass("current");
        console.log("pageDown", $(".current").attr("id"));
        checkcurrent();
      }
    } else {
      if ($(current).prev().length) {
        var prevPage = $(current).prev(),
          section = $(current).closest(".wrapper");
        section.animate({ "top": "+=100vh" }, 500);
        $(current).removeClass("current");
        $(prevPage).addClass("current");
        console.log("pageUp", $(".current").attr("id"));
        checkcurrent();
      }
    }
  }

  $(document).on("keydown", function (e) {
    //PgDown || DownArrow key
    if (
      e.keyCode === 34 || e.keyCode === 40
    ) {
      move($(".current"), true);
    }
    //PgUp || UpArrow key
    if (
      e.keyCode === 33 || e.keyCode === 38
    ) {
      move($(".current"), false);
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
      move($(".current"), true);
      console.log("next Button");
    }
  });

  // scroll to top button
  $(".backtop-btn").click(function () {
    goToTop();
  });

  function goToTop() {
    $(".wrapper").animate({ "top": "0" }, 1000);
    $(".page").removeClass("current");
    $(".page").first().addClass("current");
    checkcurrent();
  };

  function goToEnd() {
    var pageCount = $(".page").length;
    $(".wrapper").animate({ "top": (-100 * (pageCount - 1)) + "vh" }, 1000);
    $(".page").removeClass("current");
    $(".page").last().addClass("current");
    checkcurrent();
    console.log("pageCount:", pageCount);
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
    var pageOffset = (bulIndex * -100) + "vh";
    $(this).click(function () {
      $(".wrapper").animate({ "top": pageOffset }, 700);
      $(".current").removeClass("current");
      $(".page:eq(" + bulIndex + ")").addClass("current");
      console.log("bulIndex =", bulIndex, "slideOffset =", pageOffset);
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
        console.log(pBulIndex, "=", $(".current").index(), "checkcurrent fired");
      }
    });
  }

  // slide to left
  function slideLeft() {
    var prevSlide = $(".current .curSlide").prev();
    if ($(prevSlide).length) {
      $(".current .slideDiv").animate({ "left": "+=100vw" }, 300);
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
      $(".current .slideDiv").animate({ "left": "-=100vw" }, 300);
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
    console.log($(this).parent().attr("id"), "slides:", slideCount);
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
    console.log("left arrow Nav");
  });
  $(".slideNavR").click(function () {
    slideRight();
    console.log("right arrow Nav");
  });

  //left/right arrow keys & wheel for mouse with X-axis slide scroll
  $(document).on("keydown wheel", function (e) {
    //if (e.keyCode === 37 || e.originalEvent.deltaX > 1 && triggers > 5) {
    if (e.keyCode === 37 || e.originalEvent.deltaX > 1) {
      slideLeft();
      triggers = 0;
      console.log("slide to left");
    }
  });
  $(document).on("keydown wheel", function (e) {
    //if (e.keyCode === 39 || e.originalEvent.deltaX < -1 && triggers > 5) {
    if (e.keyCode === 39 || e.originalEvent.deltaX < -1) {
      slideRight();
      triggers = 0;
      console.log("slide to right");
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
  function checkCurBul() {
    $(".slideBul a").each(function () {
      var sBulIndex = $(this).index();
      if (sBulIndex == $(".current .curSlide").index()) {
        $(".current .slide-nav-bull").removeClass("current-bull");
        $(".current .slide-nav-bull:eq(" + sBulIndex + ")").addClass("current-bull");
        console.log(sBulIndex, "=", $(".current .curSlide").index(), "checkCurBul fired");
      }
    });
  }

  //slide bullet click function
  $(".slideBul a").each(function () {
    var sBulIndex = $(this).index();
    var slideOffset = (sBulIndex * -100) + "vw";
    $(this).click(function () {
      $(".current .slideDiv").animate({ "left": slideOffset }, 300);
      $(".current .curSlide").removeClass("curSlide");
      $(".current .spslide:eq(" + sBulIndex + ")").addClass("curSlide");
      console.log("sBulIndex =", sBulIndex, "slideOffset =", slideOffset);
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
      move($(".current"), true);
      console.log('scrollimit start');
    } else {
      console.log('dont scroll yet');
    }
  }
  function scrollimitUp() { // this is ugly repeating for now..
    var date = new Date();
    var checkTime = date.getTime();
    if ((checkTime - firstExecution) > interval) {
      firstExecution = checkTime;
      move($(".current"), false);
      console.log('scrollimit start');
    } else {
      console.log('dont scroll yet');
    }
  }

  $(document).on("wheel", function (e) {
    if (
      e.originalEvent.deltaY > 1 && triggers > 0 && triggers < 100
    ) {
      scrollimitDown()
      triggers = 0;
    }
    if (
      e.originalEvent.deltaY < -1 && triggers > 0 && triggers < 100
    ) {
      scrollimitUp()
      triggers = 0;
    }
  });


  //slide bullets on mobile overlapped by tab/address bar - position modification
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    $('.slideBul').css({ "bottom": 80 + "px" });
  };


  //swipe navigation with drag
  var startingX, startingY, movingX, movingY;
  var touchmoved;
  let isDragging = false,
    draggingY = 0,
    draggingX = 0,
    animationID = 0

  $(document).on("touchstart", function touchStart(evt) {
    startingX = evt.touches[0].clientX;
    startingY = evt.touches[0].clientY;
    isDragging = true;
  });

  $(document).on("touchmove", function touchMove(evt) {
    movingX = evt.touches[0].clientX;
    movingY = evt.touches[0].clientY;
    dragYPosition();
    dragXPosition();
  });

  $(document).on("touchend", function touchEnd(evt) {
    if (startingX + 50 < movingX && draggingX > 50) {
      slideLeft();
      console.log('right');
    } else if (startingX - 50 > movingX && draggingX < -50) {
      slideRight();
      console.log('left');
    }
    if (startingY + 50 < movingY && draggingY > 50) {
      move($(".current"), false);
      console.log('down');
    } else if (startingY - 50 > movingY && draggingY < -50) {
      move($(".current"), true);
      console.log('up');
    }
    isDragging = false;
    console.log("draggingY:", draggingY);
    console.log("draggingX:", draggingX);
    draggingY = 0;
    draggingX = 0;
    $(".wrapper").css("transform", "translateY(" + draggingY + "px)");
    $(".current .slideDiv").css("transform", "translateX(" + draggingX + "px)");
  });

  function dragYPosition() {
    draggingY = movingY - startingY;
    $(".wrapper").css("transform", "translateY(" + draggingY + "px)");
    //console.log(draggingY);
  }

  function dragXPosition() {
    draggingX = movingX - startingX;
    $(".current .slideDiv").css("transform", "translateX(" + draggingX + "px)");
    //console.log(draggingY);
  }


  /*
    //mouse drag
    movingX = getPositionX;
    movingY = getPositionY;
  
    function getPositionY(event) {
      return event.type.includes('mouse')
        ? event.pageY
        : event.touches[0].clientY
    }
  
    function getPositionX(event) {
      return event.type.includes('mouse')
        ? event.pageX
        : event.touches[0].clientX
    }
  */



});
