import React from 'react';
import Table from './Table.jsx';

const Tables = ({ tables, configClick, directions }) => (
    <div className='tables'>
        {tables.map((table, idx) => (
            <Table 
                table={table} 
                tableId={idx} 
                configClick={configClick} 
                directions={directions}
                key={idx+'t'} 
            />
        ))}
    </div>
)

export default Tables;
