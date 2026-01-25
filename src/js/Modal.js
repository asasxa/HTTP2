import TemplateEngine from './TemplateEngine';

export default class Modal extends TemplateEngine {
  constructor(
    modal,
    modalForm,
    modalHeader,
    modalFormControls,
    modalFormDescription,
    cancelBtn,
    ticketsList,
    negotiator,
  ) {
    super();
    this.modal = modal;
    this.modalForm = modalForm;
    this.modalHeader = modalHeader;
    this.modalFormControls = modalFormControls;
    this.modalFormDescription = modalFormDescription;
    this.cancelBtn = cancelBtn;
    this.ticketsList = ticketsList;
    this.negotiator = negotiator;
  }

  assignCommonHandler() {
    this.modalForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const { ticketId } = event.currentTarget.dataset;
      let ticket = null;
      if (ticketId) {
        ticket = this.ticketsList.querySelector(`#${ticketId}`);
      }

      if (this.modalHeader.textContent === 'Добавить тикет') {
        const formData = new FormData(event.currentTarget);
        const ticketData = {
          name: formData.get('name'),
          description: formData.get('description'),
          status: false,
        };

        this.negotiator.createRequest({
          method: 'POST',
          url: '?method=createTicket',
           ticketData,
          callback: (response) => {
            const receivedData = response;
            const ticketHTML = this.constructor.getTicketHTML(receivedData);
            this.ticketsList.insertAdjacentHTML('beforeend', ticketHTML);
            this.modalFormControls.classList.remove('active');
            console.log('Новый тикет был добавлен.');
          },
        });
      }

      else if (this.modalHeader.textContent === 'Изменить тикет') {
        const ticketName = ticket.querySelector('.ticket__name');
        const ticketDescription = ticket.querySelector('.ticket__description');

        const formData = new FormData(event.currentTarget);
        const updateData = {
          name: formData.get('name'),
          description: formData.get('description'),
        };

        this.negotiator.createRequest({
          method: 'PATCH',
          url: `?method=updateById&id=${ticketId}`,
           updateData,
          callback: (response) => {
            const receivedData = response;
            if (receivedData.name !== undefined) {
              ticketName.firstChild.replaceWith(document.createTextNode(receivedData.name));
            }
            if (receivedData.description !== undefined) {
              ticketDescription.textContent = receivedData.description;
            }
            this.modalFormControls.classList.remove('active');
            console.log('Измененные значения сохранены.');
          },
        });
      }

      else if (this.modalHeader.textContent === 'Удалить тикет') {
        this.negotiator.createRequest({
          method: 'DELETE',
          url: `?method=deleteById&id=${ticketId}`,
          callback: () => {
            ticket.remove();
            this.modalFormDescription.classList.remove('active');
            console.log(`Тикет с id #${ticketId} был удален.`);
          },
        });
      }

      this.modalForm.reset();
      this.modal.classList.remove('active');
    });
  }

  assignCancelBtnHandler() {
    this.cancelBtn.onclick = (event) => {
      this.modalForm.reset();
      this.modalFormControls.classList.remove('active');
      this.modalFormDescription.classList.remove('active');
      event.currentTarget.closest('.modal').classList.remove('active');
    };
  }
}
