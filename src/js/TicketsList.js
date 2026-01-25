import TemplateEngine from './TemplateEngine';

export default class TicketsList extends TemplateEngine {
  constructor(
    ticketsList,
    modal,
    modalForm,
    modalHeader,
    modalFormControls,
    modalFormDescription,
    negotiator,
  ) {
    super();
    this.ticketsList = ticketsList;
    this.modal = modal;
    this.modalForm = modalForm;
    this.modalHeader = modalHeader;
    this.modalFormControls = modalFormControls;
    this.modalFormDescription = modalFormDescription;
    this.negotiator = negotiator;
  }

  assignHandler() {
    this.ticketsList.addEventListener('click', (event) => {
      const { target } = event;
      const ticket = target.closest('.ticket');

      if (!ticket) return;

      const targetClass = target.className;

      if (targetClass.startsWith('ticket__control-status')) {
        target.classList.toggle('active');
        const params = new URLSearchParams();
        params.append('id', ticket.id);
        params.append('status', target.classList.contains('active'));
        params.append('method', 'changeTicket');

        this.negotiator.createRequest({
          method: 'PATCH',
          data: params,
          callback: (response) => {
            const receivedData = JSON.parse(response);
            console.log(`Статус тикета с id #${ticket.id} был изменен на ${receivedData.status}`);
          },
        });
      } else if (targetClass === 'ticket__control-edit') {
        this.modalForm.dataset.ticketId = ticket.id;
        this.modalHeader.textContent = 'Изменить тикет';
        this.modalFormControls.classList.add('active');
        this.modal.classList.add('active');
      } else if (targetClass === 'ticket__control-delete') {
        this.modalForm.dataset.ticketId = ticket.id;
        this.modalHeader.textContent = 'Удалить тикет';
        this.modalFormDescription.classList.add('active');
        this.modal.classList.add('active');
      } else if (targetClass.includes('ticket__description')) {
        const description = ticket.querySelector('.ticket__description');
        if (description) {
          description.classList.remove('active');
        }
      } else {
        const description = ticket.querySelector('.ticket__description');
        if (description) {
          description.classList.add('active');
        }
      }
    });
  }

  downloadTickets() {
    this.negotiator.createRequest({
      method: 'GET',
      url: '?method=allTickets',
      callback: (response) => {
        const receivedData = JSON.parse(response);
        let html = '';

        receivedData.forEach((item) => {
          html += this.constructor.getTicketHTML(item);
        });

        this.ticketsList.insertAdjacentHTML('beforeend', html);
        console.log('Все тикеты загружены с сервера.');
      },
    });
  }
}
