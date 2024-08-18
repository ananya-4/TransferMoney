document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("transactionForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const idFrom = document.getElementById("idFrom").value;
    const idTo = document.getElementById("idTo").value;
    const amount = document.getElementById("amount").value;

    if (!idFrom || !idTo || !amount) {
      alert("Please fill in all fields");
      return;
    }

    const amountNumber = parseInt(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      alert("Please enter a positive amount");
      return;
    }

    // Send the data to the server via fetch
    fetch("http://localhost:3000/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idFrom: idFrom,
        idTo: idTo,
        amount: amountNumber,
        
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Transaction successfully recorded");
        } else {
          alert("Error recording transaction");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
