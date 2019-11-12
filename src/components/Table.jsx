import React from 'react';
import Cog from './Cog.jsx';
import Row from './Row.jsx';
import { getCells, getRows } from './../utilities.js';


const Table = ({ table, tableId, configClick, directions }) => {
    const colCount = 5;
    const cells = getCells(table.data.N, table.data.X, table.data.M);
    const rows = getRows(cells, colCount, directions[table.direction].ltr);
    const rowsInline = directions[table.direction].up ? rows.reverse() : rows;

    return (
        <div className={`table-outer ${table.name}`} style={{width: `calc(${table.data.W}% + 40px)`}}>
            <table>
                <tbody>
                    {rowsInline.map((rowCells, idx) => (
                        <Row rowCells={rowCells} key={idx} />
                    ))}
                </tbody>
            </table>
            <div className='controls'>
                <button onClick={() => configClick(tableId)}>
                    <Cog/>
                    <span>configure</span>
                </button>
                <p className='label'>{table.data.W}%</p>
            </div>
        </div>
    );
}

export default Table;
