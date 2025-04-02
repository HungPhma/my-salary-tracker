import React, { useState, useEffect }from 'react';
import Swal from 'sweetalert2';

const SalaryTable = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('all');
    useEffect(() => {
        const fetchDate =  async () => {
            try{
                // const url = process.env.REACT_APP_API_URL;
                // const response = await fetch(url);
                const response = await fetch(`https://my-salary-tracker.onrender.com/api/salary`);
                const data = await response.json();
                console.log('Fetched data: ', data);
                setData(data);
                setFilteredData(data); 
            }
            catch(err){
                console.log('Error fetching data: ', err);
            }
        };

        fetchDate();
    }, []);

    const handleFilter = (event) => {
        const month = event.target.value;
        setSelectedMonth(month);

        if (month === 'all') {
            setFilteredData(data);
        } else {
            const filtered = data.filter((item) => {
                const itemMonth = new Date(item.date).toLocaleString('en-US', { month: 'long' }).toLowerCase();
                return itemMonth === month;
            });
            setFilteredData(filtered);
        }
    };

    const handEditSalary = async (index) => {
        const currentIndex = data[index];

        const { value: formValues } = await Swal.fire({
            title: 'Edit Salary and Tip',
            html:
                `<div class="form-group">
                    <label htmlFor="salary">Salary:</label>
                    <input type="number" id="salary" value="${currentIndex.salary}" />
                </div>

                <div class="form-group">
                    <label htmlFor="tip">Tip:</label>
                    <input type="number" id="tip" value="${currentIndex.tip}" />
                </div>

                <div class="form-group">
                    <label htmlFor="date">Date:</label>
                    <input type="date" id="date" value="${currentIndex.date}" />
                </div>`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Save',
            preConfirm: () => {
                const newdate = document.getElementById('date').value;
                const salaryInput = document.getElementById('salary').value;
                const tipInput = document.getElementById('tip').value;

                const newsalary = salaryInput === '' ? NaN : parseFloat(salaryInput);
                const newtip = tipInput === '' ? NaN : parseFloat(tipInput);
                console.log('new salary:', newsalary);
                console.log('new tip:', newtip);
                if (isNaN(newsalary) || isNaN(newtip)) {
                    Swal.showValidationMessage('Please enter a valid number (0 is allowed)');
                    return false;
                }
                else{
                    console.log('accepted 0');
                }
                return {newsalary, newtip, newdate};
            }
        });

        if(formValues){
            const {newsalary, newtip, newdate} = formValues;  
            const id = currentIndex._id;
            console.log('currently ID:', id);
            try {
                // const url = process.env.REACT_APP_API_URL; // Use the environment variable for the API URL
                const response = await fetch(`https://my-salary-tracker.onrender.com/api/salary/edit${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        date: newdate,
                        salary: newsalary,
                        tip: newtip
                    })
                });

                console.log('Response status:', response.status);
                console.log('Response body:', response);

                if(response.ok){
                    const updatedSalary = await response.json();
                    const newData = [...data];
                    newData[index] = updatedSalary;
                    newData.sort((a, b) => new Date(a.date) - new Date(b.date));

                    setData(newData);
                    Swal.fire(
                        'Updated!',
                        'The salary has been updated.',
                        'success'
                    ).then(() => {
                        window.location.reload();
                    });
                }
                else{
                    Swal.fire(
                        'Error!',
                        'Failed to update the database.',
                        'error'
                    );
                }
            }
            catch (error) {
                console.error('Error updating:', error);
                Swal.fire('Error', 'Failed to connect to server.', 'error');
            }
        }
    };
    const handDeleteSalary = async (index) => {
        const currentIndex = data[index];
        const {value: confirmDelete} = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'     
        });

        if(confirmDelete){
            const id = currentIndex._id;
            try {
                // const url = process.env.REACT_APP_API_DELETE; // Use the environment variable for the API URL
                const response = await fetch(`https://my-salary-tracker.onrender.com/api/salary/delete/${id}`, {
                    method: 'DELETE',
                    headers:{
                        'Content-Type': 'application/json'
                    }
                });

                if(response.ok){
                    const updatedData = data.filter((item, i) => i !== index);
                    setData(updatedData);
                    Swal.fire(
                        'Deleted!',
                        'The salary has been deleted.',
                        'success'
                    ).then(() => {
                        window.location.reload();
                    });
                }
                else{
                    Swal.fire(
                        'Error!',
                        'Failed to delete the salary.',
                        'error'
                    );
                }
            }
            catch (error) {
                console.error('Error deleting:', error);
                Swal.fire('Error', 'Failed to connect to server.', 'error');
            }
        }
    };
    const handAddSalary = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Add Salary and Tip',
            html: `
                <div class="form-group">
                    <label htmlFor="salary">Salary:</label>
                    <input type="number" id="salary" />
                </div>

                <div class="form-group">
                    <label htmlFor="tip">Tip:</label>
                    <input type="number" id="tip" />
                </div>

                <div class="form-group">
                    <label htmlFor="date">Date:</label>
                    <input type="date" id="date" />
                </div>
            `,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Add',
            preConfirm: () => {
                const newdate = document.getElementById('date').value;
                const salaryInput = document.getElementById('salary').value;
                const tipInput = document.getElementById('tip').value;

                const newsalary = salaryInput.trim() === '' ? NaN : parseFloat(salaryInput);
                const newtip = tipInput.trim() === '' ? NaN : parseFloat(tipInput);
            
                console.log('new salary:', newsalary);
                console.log('new tip:', newtip);
                console.log('new date:', newdate);
                
                if (isNaN(newsalary) || isNaN(newtip)) {
                    Swal.showValidationMessage('Please enter a valid number (0 is allowed)');
                    return false;
                }
                else{
                    console.log('accepted 0');
                }
                return { newsalary, newtip, newdate };
            }
        });
    
        if (formValues) {
            const { newsalary, newtip, newdate } = formValues;
            try {
                // const url = process.env.REACT_APP_API_ADD; // Use the environment variable for the API URL
                const response = await fetch((`https://my-salary-tracker.onrender.com/api/salary/add`), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        date: newdate,
                        salary: newsalary,
                        tip: newtip
                    })
                });
                console.log('Response status:', response.status);
                console.log('Response body:', response);
                
                if (response.ok) {
                    const newSalaryData = await response.json();
                    console.log('Server response data:', newSalaryData);
                    // Add new data to the existing state
                    setData((prevData) => [...prevData, newSalaryData]);
                    Swal.fire('Added!', 'The salary has been added.', 'success').then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire('Error!', 'Failed to add the salary.', 'error');
                }
            } catch (error) {
                console.error('Error adding:', error);
                Swal.fire('Error', 'Failed to connect to server.', 'error');
            }
        }
    };
    return (
        <div className='salaryTable'>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Salary</th>
                        <th>Tip</th>
                        <th>Total</th>
                        <th>
                            <select onChange={handleFilter} value={selectedMonth} className='selection' id="monthSelector" >
                                <option value="all">All</option>
                                {Array.from({ length: 12 }, (_, index) => {
                                    const month = new Date(0, index).toLocaleString('en-US', { month: 'long' });
                                    return (
                                        <option key={index} value={month.toLowerCase()}>
                                            {month}
                                        </option>
                                    );
                                })}
                            </select>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={item._id}>
                            <td>{item.date}</td>
                            <td>${item.salary}</td>
                            <td>${item.tip}</td>
                            <td>${item.total}</td>
                            <td className='edit'>
                                <div className='edit-delete-buttons'>
                                    <button className="edit-button" onClick={() => handEditSalary(index)}>Edit</button>
                                    <button className='delete-button' onClick={() => handDeleteSalary(index)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='add-salary'>
                <button className='add-button' onClick={handAddSalary}>Add</button>
            </div>
        </div>
    );
};

export default SalaryTable;