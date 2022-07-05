import { Navigation, Swiper, Pagination } from 'swiper';

Swiper.use([Navigation, Pagination]);

/**
 Входящие араметры:
 sliderElem — контейнер swiper-а

 */

export default class Slider {
  constructor(sliderElem, numSlide, btnPrev, btnNext, paginationElem, customGap) {

    const gap = customGap ? +customGap : 30;
    console.log(sliderElem, numSlide, btnPrev, btnNext, paginationElem, customGap)
    new Swiper(sliderElem, {
      slidesPerView: 1,
      lazy: true,
      keyboard: true,
      spaceBetween: 16,
      speed: 400,
      pagination: {
        el: paginationElem
      },
      navigation: {
        prevEl: btnPrev,
        nextEl: btnNext
      },
      breakpoints: {
        769: {
          spaceBetween: gap - 10 > 16 ? gap - 10 : 16
        },
        1025: {
        },
        1201: {
          spaceBetween: gap
        }
      }
    })
  }
}
