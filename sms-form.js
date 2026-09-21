(function () {
  var form = document.getElementById("sms-opt-in-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", function (event) {
    var nameInput = form.elements.namedItem("name");
    var emailInput = form.elements.namedItem("email");
    var mobileInput = form.elements.namedItem("mobile");
    var consentInput = form.elements.namedItem("sms_consent");

    if (!(consentInput instanceof HTMLInputElement) || !consentInput.checked) {
      return;
    }

    event.preventDefault();

    var name = nameInput instanceof HTMLInputElement ? nameInput.value.trim() : "";
    var email = emailInput instanceof HTMLInputElement ? emailInput.value.trim() : "";
    var mobile = mobileInput instanceof HTMLInputElement ? mobileInput.value.trim() : "";

    var body = [
      "LOJO Engineering SMS opt-in request",
      "",
      "Name: " + name,
      "Email: " + email,
      "Mobile: " + mobile,
      "",
      "I agree to receive transactional text messages from Lojo Engineering at (505) 207-4190 about my computer-systems and AI-hardware projects, including project status, site-visit coordination, shipping updates, and replies to messages I send. Message frequency is up to 8 messages per month. Message and data rates may apply. Reply STOP to cancel. Reply HELP for help. Consent is not required as a condition of purchasing any goods or services.",
      "",
      "Please add this mobile number to the LOJO project SMS list."
    ].join("\n");

    window.location.href =
      "mailto:team@lojo.engineering?subject=" +
      encodeURIComponent("LOJO SMS opt-in request") +
      "&body=" +
      encodeURIComponent(body);
  });
})();
