function ibg() {
  let ibg = document.querySelectorAll('.ibg');
  for (var i = 0; i < ibg.length; i++) {
    if (ibg[i].querySelector('img')) {
      ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
    }
  }
}

const slick = () => {
  const params = {
    dots: true,
    arrows: false,
    waitForAnimate: false,
    speed: 228,
    dots: true,
    // autoplay: true,
    // autoplaySpeed: 5000,
    // adaptiveHeight: true,
    // fade: true,
    // variableWidth: true,
  };
  $('.reviews__slider').slick(params);
};

const headerToggle = () => {
  const burger = $('.intro__burger');
  const menu = $('.intro__nav');
  const navItem = $('.nav__item');

  const handleClose = (e) => {
    e.preventDefault();
    burger.removeClass('active');
    menu.removeClass('active');
    document.body.classList.remove('no-scroll');
  };

  const handler = (e) => {
    e.preventDefault();
    burger.toggleClass('active');
    menu.toggleClass('active');
    document.body.classList.toggle('no-scroll');
  };

  burger.click(handler);
  navItem.click(handleClose);
};

const header = $('.intro__header');

const fixHeader = () => {
  const scrollOffset = $(document).scrollTop();
  if (scrollOffset === 0) header.removeClass('fixed');
  if (scrollOffset > 0) header.addClass('fixed');
};

const scrollSubscribe = () => {
  $(window).on('scroll', () => {
    fixHeader();
  });
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
  // fixHeader();
  // headerToggle();
  ibg();
  // slick();
  // scrollSubscribe();
  dev();
  // scrolling();
});
