(function () {
  "use strict";

  var CONSENT_STATEMENT =
    "I agree to receive transactional text messages from Lojo Engineering at (505) 207-4190 about my computer-systems and AI-hardware projects, including project status, site-visit coordination, shipping updates, and replies to messages I send. Message frequency is up to 8 messages per month. Message and data rates may apply. Reply STOP to cancel. Reply HELP for help. Consent is not required as a condition of purchasing any goods or services.";

  var PHONE_ERROR =
    "Enter a mobile number to opt in to SMS, or use Email my request (no SMS) to continue without texts.";

  var CONSENT_ERROR =
    "SMS is optional. Check the consent box and enter a mobile number, or use Email my request (no SMS).";

  var form = document.getElementById("sms-opt-in-form");
  if (!form) {
    return;
  }

  var nameInput = form.elements.namedItem("name");
  var emailInput = form.elements.namedItem("email");
  var mobileInput = form.elements.namedItem("mobile");
  var consentInput = form.elements.namedItem("sms_consent");
  var emailButton = form.querySelector("[data-intent='email']");
  var smsButton = form.querySelector("[data-intent='sms']");
  var status = document.getElementById("sms-opt-in-status");
  var phoneError = document.getElementById("sms-phone-error");
  var formError = document.getElementById("sms-form-error");
  var phoneHint = document.getElementById("mobile-requirement");
  var submitIntent = "email";

  function isConsentChecked() {
    return consentInput instanceof HTMLInputElement && consentInput.checked;
  }

  function fieldValue(input) {
    return input instanceof HTMLInputElement ? input.value.trim() : "";
  }

  function setPhoneRequired(required) {
    if (!(mobileInput instanceof HTMLInputElement)) {
      return;
    }
    mobileInput.required = required;
    mobileInput.setAttribute("aria-required", required ? "true" : "false");
    if (!required) {
      mobileInput.setCustomValidity("");
    }
  }

  function clearPhoneError() {
    if (phoneError) {
      phoneError.hidden = true;
      phoneError.textContent = "";
    }
    if (mobileInput instanceof HTMLInputElement) {
      mobileInput.removeAttribute("aria-invalid");
      mobileInput.setCustomValidity("");
    }
  }

  function showPhoneError(message) {
    if (phoneError) {
      phoneError.hidden = false;
      phoneError.textContent = message;
    }
    if (mobileInput instanceof HTMLInputElement) {
      mobileInput.setAttribute("aria-invalid", "true");
    }
  }

  function clearFormError() {
    if (!formError) {
      return;
    }
    formError.hidden = true;
    formError.textContent = "";
  }

  function showFormError(message) {
    if (!formError) {
      return;
    }
    formError.hidden = false;
    formError.textContent = message;
  }

  function syncSmsState() {
    var optedIn = isConsentChecked();
    setPhoneRequired(optedIn);
    if (!optedIn) {
      clearPhoneError();
    }
    if (smsButton instanceof HTMLButtonElement) {
      smsButton.disabled = !optedIn;
      smsButton.title = optedIn
        ? "Email this request and opt in to SMS"
        : "Check the SMS consent box to enable SMS opt-in";
    }
    if (status) {
      status.classList.toggle("is-on", optedIn);
      status.textContent = optedIn
        ? "SMS opt-in is on. A mobile number is required only if you use the SMS button. Email my request (no SMS) still sends this without texts."
        : "SMS opt-in is off. You can submit with name and email only — no phone number and no consent checkbox.";
    }
    if (phoneHint) {
      phoneHint.textContent = optedIn
        ? "required for the SMS button"
        : "optional — not required unless you opt in";
    }
  }

  function allowSubmitWithoutSms() {
    submitIntent = "email";
    setPhoneRequired(false);
    clearPhoneError();
    clearFormError();
  }

  function requirePhoneForSmsOptIn() {
    submitIntent = "sms";
    clearFormError();
    if (!isConsentChecked()) {
      return;
    }
    setPhoneRequired(true);
    if (!(mobileInput instanceof HTMLInputElement)) {
      return;
    }
    if (mobileInput.value.trim() === "") {
      mobileInput.setCustomValidity(PHONE_ERROR);
    } else {
      mobileInput.setCustomValidity("");
      clearPhoneError();
    }
  }

  function openMailto(subject, body) {
    window.location.href =
      "mailto:team@lojo.engineering?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);
  }

  if (consentInput instanceof HTMLInputElement) {
    consentInput.required = false;
    consentInput.removeAttribute("required");
    consentInput.addEventListener("change", syncSmsState);
  }

  if (emailButton) {
    emailButton.addEventListener("click", allowSubmitWithoutSms);
  }

  if (smsButton) {
    smsButton.addEventListener("click", requirePhoneForSmsOptIn);
  }

  if (mobileInput instanceof HTMLInputElement) {
    mobileInput.addEventListener("input", function () {
      if (mobileInput.value.trim() !== "") {
        mobileInput.setCustomValidity("");
        clearPhoneError();
      }
    });
    mobileInput.addEventListener("invalid", function () {
      if (submitIntent !== "sms") {
        mobileInput.setCustomValidity("");
        return;
      }
      showPhoneError(PHONE_ERROR);
    });
  }

  form.addEventListener("submit", function (event) {
    var name = fieldValue(nameInput);
    var email = fieldValue(emailInput);
    var mobile = fieldValue(mobileInput);
    var submitter = event.submitter;
    var smsOptIn = submitIntent === "sms";
    if (submitter && typeof submitter.getAttribute === "function") {
      smsOptIn = submitter.getAttribute("data-intent") === "sms";
    }

    if (name === "" || email === "") {
      event.preventDefault();
      return;
    }

    if (smsOptIn && !isConsentChecked()) {
      event.preventDefault();
      showFormError(CONSENT_ERROR);
      return;
    }

    if (smsOptIn && mobile === "") {
      event.preventDefault();
      setPhoneRequired(true);
      if (mobileInput instanceof HTMLInputElement) {
        mobileInput.setCustomValidity(PHONE_ERROR);
      }
      showPhoneError(PHONE_ERROR);
      if (mobileInput instanceof HTMLInputElement) {
        mobileInput.focus();
      }
      return;
    }

    event.preventDefault();
    clearFormError();
    clearPhoneError();

    if (smsOptIn) {
      openMailto(
        "LOJO SMS opt-in request",
        [
          "LOJO Engineering project request with SMS opt-in",
          "",
          "Name: " + name,
          "Email: " + email,
          "Mobile: " + mobile,
          "SMS consent: yes",
          "",
          CONSENT_STATEMENT,
          "",
          "Please add this mobile number to the LOJO project SMS list."
        ].join("\n")
      );
      return;
    }

    var lines = [
      "LOJO Engineering project request",
      "",
      "Name: " + name,
      "Email: " + email,
      "SMS consent: no",
      "",
      "This person did not opt in to SMS. Do not send text messages. Contact by email only."
    ];
    if (mobile !== "") {
      lines.push("");
      lines.push("A mobile number was typed, but SMS consent was not given. Do not text this number.");
      lines.push("Mobile (not consented): " + mobile);
    }
    openMailto("LOJO project request (no SMS)", lines.join("\n"));
  });

  syncSmsState();
})();
