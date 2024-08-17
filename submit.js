document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('transactionForm');
  const button = document.getElementById('submitButton');
  const errorElement = document.getElementById('error-message');
  const transactionIdInput = document.getElementById('transactionId');

  button.addEventListener('click', async () => {
    const idFrom = document.getElementById('idFrom').value;
    const idTo = document.getElementById('idTo').value;
    const amount = document.getElementById('amount').value;
    const transactionId = transactionIdInput.value;

    // Input validation
    if (!idFrom || !idTo || !amount) {
      displayErrorMessage('Please fill in all fields');
      return;
    }

    const amountNumber = parseInt(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      displayErrorMessage('Please enter a positive amount');
      return;
    }

    if (transactionId) {
      try {
        // Send PATCH request to update transaction
        const patchResponse = await fetch(`http://localhost:3000/updateTransaction/${transactionId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idFrom,
            idTo,
            amount: amountNumber
          })
        });

        const patchData = await patchResponse.json();

        console.log(patchData);
        displaySuccessMessage('Transaction updated successfully!');
      } catch (error) {
        console.error('Error updating transaction:', error);
        displayErrorMessage('Error updating transaction. Please try again.');
      }

      try {
        // Send POST request to submit new transaction
        const postResponse = await fetch('http://localhost:3000/submitTransaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idFrom,
            idTo,
            amount: amountNumber
          })
        });

        const postData = await postResponse.json();

        console.log(postData);
        displaySuccessMessage('New transaction submitted successfully!');
      } catch (error) {
        console.error('Error submitting new transaction:', error);
        displayErrorMessage('Error submitting new transaction. Please try again.');
      }
    } else {
      try {
        // Send POST request to submit new transaction
        const response = await fetch('http://localhost:3000/submitTransaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idFrom,
            idTo,
            amount: amountNumber
          })
        });

        const data = await response.json();

        console.log(data);
        displaySuccessMessage('Transaction submitted successfully!');
      } catch (error) {
        console.error('Error submitting transaction:', error);
        displayErrorMessage('Error submitting transaction. Please try again.');
      }
    }
  });

  function displayErrorMessage(message) {
    errorElement.textContent = message;
    // Add styling or other visual feedback for the error message
  }

  function displaySuccessMessage(message) {
    errorElement.textContent = message;
    // Add styling or other visual feedback for success message
  }
});
  