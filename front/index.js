import { validateRegInput } from "./helpers/validateRegInput.js";
const d = document;

const handleForm = () => {
  const $form = d.querySelector(".register-form");
  const $inputs = d.querySelectorAll(".register-form [required]");
  const $date = d.querySelector(".register-now");

  const days = ["Sun", "Mon", "Tus", "Wed", "Thu", "Fri", "Sat"];

  const getDate = new Date();
  const getDay = getDate.getDay();
  const getYear = getDate.getFullYear();
  const getDayNum = getDate.getDate();
  $date.textContent = `${days[getDay]} ${getDayNum}, ${getYear}`;

  $inputs.forEach((input) => {
    const $span = d.createElement("span");
    $span.classList.add("register-form-error", "none");
    $span.textContent = input.title || `Please complete the field.`;
    if (!input.value || !input.checked) {
      input.closest("div").appendChild($span);
    }
  });

  d.addEventListener("keydown", (e) => {
    if (e.target.matches(".register-form [required]")) {
      let $input = e.target;

      if (!validateRegInput($input)) {
        $input.nextElementSibling.classList.remove("none");
      } else {
        $input.style.borderBottom = `thin solid green`;
        $input.nextElementSibling.classList.add("none");
      }
    }
  });

  d.addEventListener("click", (e) => {
    if (e.target.matches(".register-form select")) {
      let $input = e.target;
      if (e.target.value) {
        $input.style.borderBottom = `thin solid green`;
        $input.nextElementSibling.classList.add("none");
      }
    }

    if (e.target.matches(".register-form input[type='checkbox']")) {
      if (!e.target.checked) {
        e.target.nextElementSibling.nextElementSibling.classList.remove("none");
      } else {
        e.target.nextElementSibling.nextElementSibling.classList.add("none");
      }
    }
  });

  d.addEventListener("submit", (e) => {
    e.preventDefault();

    const $sectionRegister = d.querySelector(".register");
    const $response = d.createElement("p");
    const $buttonSubmit = d.getElementById("button-submit");
    $response.classList.add("successfull", "none");
    $response.textContent = `Successful registration!`;
    $sectionRegister.appendChild($response);

    fetch("http://localhost:80/evento/back/index.php", {
      method: "POST",
      body: new FormData(e.target),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((json) => {
        const $registerform = d.querySelector(".register-form");
        $registerform.reset();
        $buttonSubmit.classList.add("none");
        $response.classList.remove("none");
      })
      .catch((err) => {
        $response.textContent =
          err.statusText || `Ocurrió un error al enviar la información.`;
        $buttonSubmit.classList.add("none");
        $response.classList.remove("none");
      })
      .finally(() =>
        setTimeout(() => {
          $buttonSubmit.classList.remove("none");
          $response.classList.add("none");
          location.href =
            "http://localhost:80/evento/front/pages/users/users.html";
        }, 2000)
      );
  });
};

d.addEventListener("DOMContentLoaded", handleForm);
