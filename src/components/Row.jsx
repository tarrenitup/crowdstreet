import React from 'react';

const Row = ({ rowCells }) => (
    <tr>
        {rowCells.map((cell, idx) => {
            const empty = cell ? '' : 'empty';
            return (
                <td className={empty} key={idx}>{cell}</td>
            )
        })}
    </tr>
)

export default Row;
