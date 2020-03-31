const modalLinks = [...document.body.querySelectorAll('[data-modal]')];
const closeButtons = [...document.body.querySelectorAll('[data-close]')];
const modalBG = document.getElementById('modal-bg');

const mapModals = modalLinks.reduce((acc, button) => {
  const ref = button.dataset.modal;
  return acc[ref] ? acc : { ...acc, [ref]: document.getElementById(ref) };
}, {});
const modals = Object.values(mapModals);

const modalToggle = () => {
  const handleOpen = (modal) => (e) => {
    e.preventDefault();
    Object.values(modals).forEach((modal) => modal.classList.remove('active'));
    modal.classList.add('active');
    modalBG.classList.add('active');
    document.body.classList.add('no-scroll');
    const slider = $(modal.querySelector('.slider'));
    if (slider.length) {
      slider.slick('setPosition');
      slider.slick('slickGoTo', 0, true);
    }
  };

  const handleClose = (modal) => (e) => {
    e.preventDefault();
    document.body.classList.remove('no-scroll');
    modal.classList.remove('active');
    modalBG.classList.remove('active');
  };

  modalLinks.forEach((button) => {
    const ref = button.dataset.modal;
    const modal = mapModals[ref];
    button.addEventListener('click', handleOpen(modal));
  });

  closeButtons.forEach((el) => {
    const modal = el.closest('.modal');
    const modalNav = modal.querySelector('.slider-nav');
    if (modalNav) {
      const next = modalNav.querySelector('.slider-next');
      const prev = modalNav.querySelector('.slider-prev');
      el.addEventListener('click', handleClose(modal));
      document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') prev.click();
        if (e.key === 'ArrowRight') next.click();
      });
    }
    el.addEventListener('click', handleClose(modal));
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') handleClose(modal)(e);
    });
  });

  modals.forEach((modal) => {
    const innerWindow = modal.querySelector('.modal__inner');
    modal.addEventListener('click', (e) => handleClose(modal)(e));
    innerWindow.addEventListener('click', (e) => e.stopPropagation());
  });
};

const filterCategories = () => {
  const filters = document.body.querySelectorAll('[data-filter]');
  const categories = [...filters].reduce((acc, el) => [...acc, el.dataset.filter], []);
  const cards = document.body.querySelectorAll(`[data-category]`);

  const map = categories.reduce((acc, categoryName) => {
    const filteredCards = [...cards].filter((card) => card.dataset.category === categoryName);
    return { ...acc, [categoryName]: categoryName === 'all' ? cards : filteredCards };
  }, {});

  filters.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = e.currentTarget.dataset.filter;
      if (cat !== 'all') cards.forEach((el) => el.classList.add('hide'));
      map[cat].forEach((el) => el.classList.remove('hide'));
    });
  });
};

function isElementInViewport(el) {
  var width = el.offsetWidth;

  while (el.offsetParent) {
    el = el.offsetParent;
    left += el.offsetLeft;
  }

  return left >= window.pageXOffset && left + width <= window.pageXOffset + window.innerWidth;
}

const scrolling = () => {
  const paddingTop = $('.intro__header').height();
  const handler = function(e) {
    e.preventDefault();
    const id = $(this).attr('href');
    document.body.classList.remove('no-scroll');
    const blockOffset = $(id).offset().top - paddingTop - 30;
    $('html, body')
      .delay(300)
      .animate(
        {
          scrollTop: blockOffset,
        },
        500,
      );
  };
  $('[data-scroll]').click(handler);
};

const slick = () => {
  const params = {
    dots: true,
    // autoplay: true,
    // autoplaySpeed: 5000,
    arrows: false,
    waitForAnimate: false,
    adaptiveHeight: true,
    speed: 228,
    // fade: true,
    dots: true,
    // variableWidth: true,
  };
  $('.slider').slick(params);
  $('.slider-reviews').slick({
    ...params,
    dots: false,
    fade: false,
    arrows: true,
    draggable: false,
  });

  const arrowNavs = [...document.querySelectorAll('.slider-nav')];
  arrowNavs.forEach((arrowNav) => {
    const next = arrowNav.querySelector('.slider-next');
    const prev = arrowNav.querySelector('.slider-prev');
    const slider = $(arrowNav.closest('.modal').querySelector('.slider'));
    const handler = (direction) => (e) => {
      e.preventDefault();
      slider.slick(direction);
    };

    next.addEventListener('click', handler('slickNext'));
    prev.addEventListener('click', handler('slickPrev'));
  });
};

const svganim = () => {
  const socIcons = [...document.querySelectorAll('.social__icon-svg')];
  socIcons.forEach((icon) => {
    const svgDocument = icon.contentDocument;

    // const svgElement = svgDocument.querySelector('svg');
    svgDocument.setAttribute('fill', 'pink');
  });
};

const headerToggle = () => {
  const burger = $('.header__burger');
  const menu = $('.header__nav');
  const navItem = $('.nav__item');
  const handleClose = (e) => {
    e.preventDefault();
    burger.removeClass('active');
    menu.removeClass('active');
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

// const slickPlayToggle = () => {
// }

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

$(document).ready(function() {
  slick();
  filterCategories();
  modalToggle();
  scrolling();
  scrollSubscribe();
  fixHeader();
  // svganim();

  headerToggle();
});
