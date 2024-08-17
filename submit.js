document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transactionForm');
    const updateForm = document.getElementById('updatePersonalInfoForm');
    const errorElement = document.getElementById('error-message');
  
    transactionForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const idFrom = document.getElementById('idFrom').value;
      const idTo = document.getElementById('idTo').value;
      const amount = document.getElementById('amount').value;
  
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
  
      const transactionData = {
        idFrom,
        idTo,
        amount: amountNumber
      };
  
      fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          // Handle successful transaction
          console.log('Transaction successful:', data);
          displaySuccessMessage('Transaction successful');
        })
        .catch(error => {
          console.error('Error:', error);
          displayErrorMessage('Error recording transaction');
        });
    });
  
    updateForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const userId = document.getElementById('userId').value;
      const amount = document.getElementById('updateAmount').value;
  
      // Input validation
      if (!userId || !amount) {
        displayErrorMessage('Please fill in all fields');
        return;
      }
  
      const amountNumber = parseInt(amount);
      if (isNaN(amountNumber) || amountNumber <= 0) {
        displayErrorMessage('Please enter a positive amount');
        return;
      }
  
      fetch(`http://localhost:3000/updatePersonalInfo/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amountNumber
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          // Handle successful update
          console.log('Update successful:', data);
          displaySuccessMessage('User updated successfully');
        })
        .catch(error => {
          console.error('Error:', error);
          displayErrorMessage('Error updating user');
        });
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
  