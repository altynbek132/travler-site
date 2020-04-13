function ibg() {
  let ibg = document.querySelectorAll('.ibg');
  for (var i = 0; i < ibg.length; i++) {
    if (ibg[i].querySelector('img')) {
      ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
    }
  }
}

let isSlicked = false;
let slickPoint = 0;

const unslick = (item) => item.slick('unslick');

const slick = () => {
  const teamslider = $('.team__slider');
  const ww = $(window);
  const w = ww.outerWidth();
  const h = ww.outerHeight();

  let slidesToShow = 4;
  let slidesToScroll = 2;

  if (w > 990) {
    slidesToShow = 4;
    if (slickPoint !== 0 && slickPoint !== 3) {
      unslick(teamslider);
      isSlicked = false;
    }
    slickPoint = 3;
  } else if ((w < 991 && w > 767) || h < 340) {
    slidesToShow = 3;
    if (slickPoint !== 0 && slickPoint !== 1) {
      unslick(teamslider);
      isSlicked = false;
    }
    slickPoint = 1;
  } else if (w < 767 && w > 575) {
    slidesToShow = 2;
    if (slickPoint !== 0 && slickPoint !== 2) {
      unslick(teamslider);
      isSlicked = false;
    }
    slickPoint = 2;
  } else if (w < 576) {
    slidesToShow = 1;
    if (slickPoint !== 0 && slickPoint !== 4) {
      unslick(teamslider);
      isSlicked = false;
    }
    slickPoint = 4;
  }

  if (slidesToShow % 2 === 1) {
    slidesToScroll = slidesToShow - 2;
    if (slidesToScroll < 0) slidesToScroll = 1;
  }

  const params = {
    dots: true,
    arrows: false,
    waitForAnimate: false,
    speed: 228,
    dots: true,
    slidesToShow,
    slidesToScroll,
  };

  if (!isSlicked) {
    teamslider.slick(params);
    isSlicked = true;
  }
};

const headerToggle = () => {
  const burger = $('.header__burger');
  const menu = $('.header__nav');
  const navItem = $('.nav__item');

  const handleClose = (e) => {
    e.preventDefault();
    burger.removeClass('active');
    menu.removeClass('active');
    // document.body.classList.remove('no-scroll');
  };

  const handler = (e) => {
    e.preventDefault();
    burger.toggleClass('active');
    menu.toggleClass('active');
    // document.body.classList.toggle('no-scroll');
  };

  burger.click(handler);
  // navItem.click(handleClose);
};

const header = $('.intro__header');

const fixHeader = () => {
  const scrollOffset = $(document).scrollTop();
  if (scrollOffset === 0) header.removeClass('fixed');
  if (scrollOffset > 0) header.addClass('fixed');
};

const scrollSubscribe = (...functions) => {
  $(window).on('scroll', () => {
    functions.forEach((f) => f());
  });
};

const resizeSubscribe = (...functions) => {
  const ww = $(window);
  ww.resize((e) => {
    const w = ww.outerWidth();
    const h = ww.outerHeight();
    functions.forEach((f) => f(w, h));
  });
};

const adaptiveHeader = (w, h) => {
  const dropItems = $('.nav__dropdown-items');
  const burger = $('.header__burger');
};

const scrolling = () => {
  const paddingTop = $('.intro__header').height();
  const handler = function (e) {
    e.preventDefault();
    const id = $(this).attr('href');
    document.body.classList.remove('no-scroll');
    const blockOffset = $(id).offset().top - paddingTop;
    $('html, body').animate(
      {
        scrollTop: blockOffset,
      },
      500,
    );
  };
  $('[data-scroll]').click(handler);
};

const dev = () => {
  $('a').on('click', (e) => e.preventDefault());
};

$(document).ready(function () {
  headerToggle();
  ibg();
  slick();
  fixHeader();
  scrollSubscribe(fixHeader);
  resizeSubscribe(slick);
  dev();
  // scrolling();
});
