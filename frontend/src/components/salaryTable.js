import React, {useState}from 'react';

const SalaryTable = () => {
    const [data, setData] = useState([
        {date: '2023-10-01', salary: 5000, tip: 200, total: 5200},
        {date: '2023-10-02', salary: 5500, tip: 250, total: 5750},
        {date: '2023-10-03', salary: 6000, tip: 300, total: 6300},
        {date: '2023-10-04', salary: 6500, tip: 350, total: 6850},
        {date: '2023-10-05', salary: 7000, tip: 400, total: 7400},
    ]);

    
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
                        <tr key={index}>
                            <td>{item.date}</td>
                            <td>{item.salary}</td>
                            <td>{item.tip}</td>
                            <td>{item.total}</td>
                            <td>
                                {/* <button className="edit-button" onClick={() => handEditSalary(index)}>Edit</button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalaryTable;