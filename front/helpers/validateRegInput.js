export const validateRegInput = (el) => {
  const type = el.type;
  const patternText = new RegExp(`^[A-Za-zÑÁÉÍÓÚáéíóú\s]+$`);
  const patternEmail = new RegExp(
    "^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})"
  );
  const patternPhone = new RegExp(`^[0-9]+$`);

  if (type === "text") {
    return patternText.exec(el.value);
  }

  if (type === "email") {
    return patternEmail.exec(el.value);
  }

  if (type === "tel") {
    return patternPhone.exec(el.value);
  }

  if (type === "select-one") {
    return el.value !== "" ? true : false;
  }
};
