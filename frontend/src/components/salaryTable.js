import React, { useState, useEffect }from 'react';
import Swal from 'sweetalert2';

const SalaryTable = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchDate =  async () => {
            try{
                const response = await fetch('http://localhost:8000/api/salary');
                const data = await response.json();
                console.log('Fetched data: ', data);
                setData(data);
            }
            catch(err){
                console.log('Error fetching data: ', err);
            }
        };

        fetchDate();
    }, []);

    const handEditSalary = async (index) => {
        const currentIndex = data[index];

        const { value: formValues } = await Swal.fire({
            title: 'Edit Salary and Tip',
            html:
                `<label>Salary:</label>
                <input type='number' id='salary' value='${currentIndex.salary}' />
                <label>Tip:</label>
                <input type='number' id='tip' value='${currentIndex.tip}' />
                <label>Date:</label>
                <input type='date' id='date' value='${currentIndex.date}' />`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Save',
            preConfirm: () => {
                const newsalary = parseFloat(document.getElementById('salary').value);
                const newtip = parseFloat(document.getElementById('tip').value);
                const newdate = document.getElementById('date').value;

                if(isNaN(newsalary) || isNaN(newtip)){
                    Swal.showValidationMessage('Please enter a valid number');
                    return false;
                }
                return {newsalary, newtip, newdate};
            }
        });

        if(formValues){
            const {newsalary, newtip, newdate} = formValues;  
            const id = currentIndex._id;
            console.log('currently ID:', id);
            try {
                const response = await fetch(`http://localhost:8000/api/salary/${id}`, {
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
                    );
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
                const response = await fetch(`http://localhost:8000/api/salary/delete/${id}`, {
                    method: 'DELETE',
                    headers:{
                        'Content-Type': 'application/json'
                    }
                });

                if(response.ok){
                    Swal.fire(
                        'Deleted!',
                        'The salary has been deleted.',
                        'success'
                    );

                    const updatedData = data.filter((item, i) => i !== index);
                    setData(updatedData);
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
                <label>Salary:</label>
                <input type='number' id='salary' />
                <label>Tip:</label>
                <input type='number' id='tip' />
                <label>Date:</label>
                <input type='date' id='date' />
            `,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Add',
            preConfirm: () => {
                const newsalary = parseFloat(document.getElementById('salary').value);
                const newtip = parseFloat(document.getElementById('tip').value);
                const newdate = document.getElementById('date').value;
    
                if (isNaN(newsalary) || isNaN(newtip)) {
                    Swal.showValidationMessage('Please enter a valid number');
                    return false;
                }
                return { newsalary, newtip, newdate };
            }
        });
    
        if (formValues) {
            const { newsalary, newtip, newdate } = formValues;
            try {
                const response = await fetch('http://localhost:8000/api/salary/add', {
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
    
                if (response.ok) {
                    const newSalaryData = await response.json();
                    // Add new data to the existing state
                    setData((prevData) => [...prevData, newSalaryData]);
    
                    Swal.fire('Added!', 'The salary has been added.', 'success');
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
                        <th>Edit</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((item, index) => (
                        <tr key={item._id}>
                            <td>{item.date}</td>
                            <td>{item.salary}</td>
                            <td>{item.tip}</td>
                            <td>{item.total}</td>
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