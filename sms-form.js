(function () {
  "use strict";

  var CONSENT_STATEMENT =
    "I agree to receive transactional text messages from Lojo Engineering at (505) 207-4190 about my computer-systems and AI-hardware projects, including project status, site-visit coordination, shipping updates, and replies to messages I send. Message frequency is up to 8 messages per month. Message and data rates may apply. Reply STOP to cancel. Reply HELP for help. Consent is not required as a condition of purchasing any goods or services.";

  var PHONE_ERROR = "Enter a mobile phone number to submit this SMS opt-in.";
  var CONSENT_ERROR = "Check the consent box to submit this SMS opt-in. The box is unchecked until you check it.";

  function fieldValue(input) {
    return input instanceof HTMLInputElement ? input.value.trim() : "";
  }

  function openMailto(subject, body) {
    window.location.href =
      "mailto:team@lojo.engineering?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);
  }

  function showError(node, message) {
    if (!node) {
      return;
    }
    node.hidden = false;
    node.textContent = message;
  }

  function clearError(node) {
    if (!node) {
      return;
    }
    node.hidden = true;
    node.textContent = "";
  }

  function initSignup(form) {
    var nameInput = form.elements.namedItem("name");
    var emailInput = form.elements.namedItem("email");
    var mobileInput = form.elements.namedItem("mobile");
    var consentInput = form.elements.namedItem("sms_consent");
    var phoneError = document.getElementById("sms-phone-error");
    var formError = document.getElementById("sms-form-error");

    if (mobileInput instanceof HTMLInputElement) {
      mobileInput.required = true;
      mobileInput.setAttribute("aria-required", "true");
    }

    if (consentInput instanceof HTMLInputElement) {
      consentInput.required = true;
      consentInput.setAttribute("aria-required", "true");
    }

    form.addEventListener("submit", function (event) {
      var name = fieldValue(nameInput);
      var email = fieldValue(emailInput);
      var mobile = fieldValue(mobileInput);
      var consented = consentInput instanceof HTMLInputElement && consentInput.checked;

      if (name === "" || email === "" || mobile === "" || !consented) {
        event.preventDefault();
        if (mobile === "") {
          showError(phoneError, PHONE_ERROR);
          if (mobileInput instanceof HTMLInputElement) {
            mobileInput.setAttribute("aria-invalid", "true");
            mobileInput.focus();
          }
        } else {
          clearError(phoneError);
        }
        if (!consented) {
          showError(formError, CONSENT_ERROR);
          if (mobile !== "" && consentInput instanceof HTMLInputElement) {
            consentInput.focus();
          }
        } else {
          clearError(formError);
        }
        return;
      }

      event.preventDefault();
      clearError(phoneError);
      clearError(formError);
      if (mobileInput instanceof HTMLInputElement) {
        mobileInput.removeAttribute("aria-invalid");
      }

      openMailto(
        "LOJO SMS opt-in",
        [
          "LOJO Engineering SMS opt-in",
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
    });
  }

  function initEmailRequest(form) {
    var nameInput = form.elements.namedItem("name");
    var emailInput = form.elements.namedItem("email");

    form.addEventListener("submit", function (event) {
      var name = fieldValue(nameInput);
      var email = fieldValue(emailInput);

      if (name === "" || email === "") {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      openMailto(
        "LOJO project request (no SMS)",
        [
          "LOJO Engineering project request",
          "",
          "Name: " + name,
          "Email: " + email,
          "SMS consent: no",
          "",
          "This person did not opt in to SMS. Do not send text messages. Contact by email only."
        ].join("\n")
      );
    });
  }

  var signupForm = document.getElementById("sms-signup-form");
  if (signupForm) {
    initSignup(signupForm);
  }

  var requestForm = document.getElementById("service-request-form");
  if (requestForm) {
    initEmailRequest(requestForm);
  }
})();
