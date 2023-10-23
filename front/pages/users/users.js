import { validateRegInput } from "../../helpers/validateRegInput.js";
import { TableRow } from "../../components/TableRow.js";
const d = document;
const $buttonEdit = d.querySelector(".edit-form");

const handleUsers = () => {
  fetch("http://localhost:80/evento/back/index.php", {
    method: "GET",
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((json) => {
      const $tableData = d.querySelector("tbody");
      let html = ``;

      json.forEach((el) => (html += TableRow(el)));
      $tableData.innerHTML = html;
    })
    .catch((err) => {
      console.log(err);
    });
};

const validateInput = (inputHTML) => {
  if (!validateRegInput(inputHTML)) {
    inputHTML.style.border = `thin solid red`;
    console.log($buttonEdit);
    $buttonEdit.firstElementChild.disabled = true;
    $buttonEdit.firstElementChild.style.cursor = "not-allowed";
  } else {
    $buttonEdit.firstElementChild.disabled = false;
    $buttonEdit.firstElementChild.style.cursor = "pointer";
    inputHTML.style.border = `thin solid green`;
  }
};

const createInputElement = (typeInput, input) => {
  const inputHTML = d.createElement("input");
  inputHTML.type = `${typeInput}`;
  inputHTML.value = input.textContent;
  inputHTML.name = input.id;
  inputHTML.id = input.id;
  inputHTML.classList.add("edit-content");
  inputHTML.addEventListener("change", (e) => {
    input.value = e.target.value;
  });

  inputHTML.addEventListener("keydown", (e) => {
    validateInput(inputHTML);
  });

  return inputHTML;
};

const editUsers = (_id) => {
  $buttonEdit.classList.remove("none");
  const $data = d.querySelectorAll(`.data-${_id} > td.editable`);
  $data.forEach((input, index) => {
    if (input.id === "entry") {
      const selectHTML = d.createElement("select");
      const optionHTMLVIP = d.createElement("option");
      const optionHTMLGeneral = d.createElement("option");
      const optionHTMLPromotional = d.createElement("option");
      optionHTMLVIP.value = "VIP";
      optionHTMLVIP.textContent = "VIP";
      optionHTMLGeneral.value = "general";
      optionHTMLGeneral.textContent = "general";
      optionHTMLPromotional.value = "promotional";
      optionHTMLPromotional.textContent = "promotional";
      selectHTML.appendChild(optionHTMLVIP);
      selectHTML.appendChild(optionHTMLGeneral);
      selectHTML.appendChild(optionHTMLPromotional);
      selectHTML.name = input.name;
      selectHTML.id = input.id;
      selectHTML.classList.add("edit-content");
      selectHTML.addEventListener("change", (e) => {
        input.value = e.target.value;
      });
      input.textContent = "";
      input.appendChild(selectHTML);
    } else if (input.id === "email") {
      const inputHTML = createInputElement("email", input);
      input.textContent = "";
      input.appendChild(inputHTML);
    } else if (input.id === "phone") {
      const inputHTML = createInputElement("tel", input);
      input.textContent = "";
      input.appendChild(inputHTML);
    } else {
      const inputHTML = createInputElement("text", input);
      input.textContent = "";
      input.appendChild(inputHTML);
    }
  });
};

const userMessage = (messageText, type = "success") => {
  const message = d.querySelector(".message-request p");
  const editFormButton = d.querySelector(".edit-form button");
  message.parentElement.classList.remove("none");
  message.textContent = `${messageText}`;
  message.style.color = type === "success" ? "green" : "red";
  editFormButton.classList.add("none");

  setTimeout(() => {
    message.parentElement.classList.add("none");
    location.hash = "/";
    location.reload();
  }, 1000);
};

d.addEventListener("DOMContentLoaded", handleUsers);

d.addEventListener("click", (e) => {
  let { hash } = location;
  let _id = parseInt(hash.split("/")[2]);
  if (
    e.target.matches(".edit") ||
    e.target.matches(".fa-solid.fa-pen-to-square")
  ) {
    editUsers(_id);
  }

  if (e.target.matches(".edit-form button")) {
    const dataToSend = d.querySelectorAll(`.data-${_id} .edit-content`);
    let objData = {};

    dataToSend.forEach((el) => (objData[el.id] = el.value));

    if (objData) {
      fetch(`http://localhost:80/evento/back/index.php/${_id}`, {
        method: "PUT",
        body: JSON.stringify(objData),
      })
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((json) => {
          userMessage(`Successful update!!!`);
        })
        .catch((err) => {
          userMessage(`Failed update!!!`, `error`);
        });
    }
  }

  if (e.target.matches(".editable > input")) {
    validateInput(e.target);
  }
});

window.addEventListener("hashchange", () => {
  let { hash } = location;
  let _id = parseInt(hash.split("/")[2]);

  if (hash.includes("#/update")) {
    editUsers(_id);
  }

  if (hash.includes("#/delete")) {
    fetch(`http://localhost:80/evento/back/index.php/${_id}`, {
      method: "DELETE",
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((json) => {
        userMessage(`User has been deleted!!!`);
      })
      .catch((err) => {
        userMessage(`Error in request`, "error");
      });
  }
});
