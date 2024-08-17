const tableBody = document.getElementById('myTable').getElementsByTagName('tbody')[0];

function populateTable(data) {
    data.forEach(item => {
        console.log(item._id);
        const row = document.createElement('tr');
        const cell1 = document.createElement('td');
        const cell2 = document.createElement('td');
        const cell3 = document.createElement('td');

        cell1.textContent = item._id;
        cell2.textContent = item.Name;
        cell3.textContent = item.Email;

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);

        tableBody.appendChild(row);
    });
}

fetch('http://localhost:3000/api/data')
    .then(response => response.json())
    .then(data => {
        populateTable(data)
        console.log(data)
    })
    .catch(error => console.error('Error fetching data:', error));
