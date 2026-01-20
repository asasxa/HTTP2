export default class TemplateEngine {
  static getTicketHTML(data) {
    const {
      id,
      name,
      description,
      status,
      created,
    } = data;
    return `
      <div class="ticket" id="${id}">
        <a href="#" class="ticket__control-status ${status ? 'active' : ''}"></a>
        <div class="ticket__name">
          ${name}
          <p class="ticket__description">${description}</p>
        </div>
        <span class="timestamp">${created}</span>
        <a href="#" class="ticket__control-edit">&#9998;</a>
        <a href="#" class="ticket__control-delete">&#10005;</a>
      </div>
    `;
  }
}
