import { checkExistParent } from './checkExistParent';

/**
 Обязательные классы внутри ModalElem:
 .js-modal-container
 .js-modal-content
 */

export class Modal {
  bodyElem;

  modalElem;
  modalContainerElem;
  modalContentElem;
  isOpenModal = false;

  constructor(modalElem) {
    this.checkClickByModal = this.checkClickByModal.bind(this);
    // this.setHeightModalContainer = this.setHeightModalContainer.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);

    this.bodyElem = document.querySelector('body');

    this.modalElem = modalElem;
    this.modalContainerElem = this.modalElem.querySelector('.js-modal-container');
    this.modalContentElem = this.modalElem.querySelector('.js-modal-content');

    document.addEventListener('click', this.checkClickByModal);

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        this.onCloseModal();
      }
    });
  }

  checkClickByModal(event) {
    if (this.isOpenModal && !checkExistParent(event.target, this.modalContainerElem)) {
      this.onCloseModal();
    } else {
      this.isOpenModal = true;
    }
  }

  onOpenModal() {
    this.modalElem.classList.add('mod-show');
    // this.setHeightModalContainer();
    this.bodyElem.classList.add('mod-no-scroll');

    // window.addEventListener('resize', this.setHeightModalContainer);
  }

  onCloseModal() {
    this.modalElem.classList.remove('mod-show');
    this.isOpenModal = false;
    document.removeEventListener('click', this.checkClickByModal);
    // window.removeEventListener('resize', this.setHeightModalContainer);
    this.bodyElem.classList.remove('mod-no-scroll');
  }

  // setHeightModalContainer() {
  //   if (this.modalContentElem) {
  //     this.modalContainerElem.style.height = `${ this.modalContentElem.scrollHeight }px`;
  //   }
  // }
}

window.classModal = Modal;
