export const TableRow = (el) => {
  return `
    <tr class="data-${el._id}">
      <td>${el._id}</td>
      <td id="first-name" class="editable">${el.firstName}</td>
      <td id="last-name" class="editable">${el.lastName}</td>
      <td id="email" class="editable">${el.email}</td>
      <td id="phone" class="editable">${el.phone}</td>
      <td id="entry" class="editable">${el.typeEntry}</td>
      <td class="table-action">
        <a class="edit" href="#/update/${el._id}">
          <i class="fa-solid fa-pen-to-square"></i>
        </a>
        <a class="delete" href="#/delete/${el._id}">
          <i class="fa-solid fa-trash"></i>
        </a>
      </td>
    </tr>
  `;
};
