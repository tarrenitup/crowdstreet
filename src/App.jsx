import React, { useReducer } from 'react';
import { selector } from 'postcss-selector-parser';

const updateObjectInArray = (array, action) => array.map(
    (item, idx) => idx !== action.index 
    ? item 
    : { ...item, ...action.item }
);

const isEven = n => (n % 2) === 0;

// factor out
const getCells = (start, increment, end) => {
    if (!start || !increment || !end) return;
    const cellCount = (end - start) / increment + 1;
    return new Array(cellCount).fill(null).map((c, i) => start + i * increment);
}

const padShortRow = (row, colCount, ltr) => {
    const extras = colCount - row.length;
    return extras 
        ? row.concat(new Array(extras).fill(null))
        : row;
        
    // if(ltr) {
    //     return extras 
    //     ? row.concat(new Array(extras).fill(null))
    //     : row;
    // } else {
    //     return extras 
    //     ? new Array(extras).fill(null).concat(row)
    //     : row;
    // }
}

const getRow = (cells, rowIdx, colCount, ltr) => {
    const row = cells.slice(rowIdx*colCount, rowIdx*colCount + colCount);
    const paddedRow = padShortRow(row, colCount, ltr);
    const firstColEven = ltr ? isEven(rowIdx) : !isEven(rowIdx);
    return firstColEven ? paddedRow : paddedRow.reverse(); 
}

// factor out
const getRows = (cells, colCount, ltr) => {
    if (!cells || !colCount ) return;
    const preciseRowCount = cells.length / colCount;
    const rowCount = Math.ceil(preciseRowCount);
    return new Array(rowCount).fill(null).map((r, i) => getRow(cells, i, colCount, ltr))
}

const Row = ({ rowCells }) => (
    <tr>
        {rowCells.map((cell, idx) => {
            const cellContent = cell ? cell : 'blah!';
            return (
                <td key={idx}>{cellContent}</td>
            )
        })}
    </tr>
)

const Table = ({ table }) => {
    const colCount = 5;
    const cells = getCells(table.data.N, table.data.X, table.data.M);
    const rows = getRows(cells, colCount, table.direction.ltr);
    const rowsInline = table.direction.up ? rows.reverse() : rows;

    return (
        <div className={`table-outer ${table.name}`}>
            <table style={{width: `${table.data.W}%`}}>
                <tbody>
                    {rowsInline.map((rowCells, idx) => (
                        <Row rowCells={rowCells} key={idx} />
                    ))}
                </tbody>
            </table>
            <div className='controls'>
                <button onClick={() => console.log('clicked!')} />
                <p className='label'>{table.data.W}%</p>
            </div>
        </div>
    );
}

const Tables = ({ tables }) => (
    <div className='tables'>
        {tables.map((table, idx) => <Table table={table} key={idx} /> )}
    </div>
)

const Panel = ({ table, directions }) => {
    return (
        <section className={`panel ${table.name}`}>
            <main className="parameters">
                <h1>table {table.name}</h1>
                {Object.keys(table.data).map((key, idx) => (
                    <>
                        <label key={key+'l'}>{key}</label>
                        <input key={key+'i'} defaultValue={table.data[key]} />
                    </>
                ))}
                <select>
                    <option>a</option>
                </select>
            </main>
            <footer>
                <button className="ok" value='ok' />
                <button className="cancel" value='cancel' />
            </footer>
        </section>
    )
}

const directions = {
    LTR_UP: {label: 'Left to right & up', ltr: true, up: true},
    RTL_UP: {label: 'Right to left & up', ltr: false, up: true},
    LTR_DOWN: {label: 'Left to right & down', ltr: true, up: false},
    RTL_DOWN: {label: 'Right to left & down', ltr: false, up: false},
}

const initialState = {
    tables: [
        {
            name: 'red', 
            data: {N: 8, X: 1, M: 29, W: 20}, 
            direction: directions.LTR_UP,
        },
        {
            name: 'green', 
            data: {N: 231, X: 1, M: 247, W: 30}, 
            direction: directions.LTR_UP,
        },
        {
            name: 'blue', 
            data: {N: 47, X: 2, M: 81, W: 40}, 
            direction: directions.RTL_UP,
        },
    ]
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'changeTableParameters':
            return {
                ...state,
                tables: updateObjectInArray(state.tables, action),
            };
        
        default:
            return state;
    }
};

const App = () => {

    const [ state, dispatch ] = useReducer(reducer, initialState);

    return (
        <div className='App'>
            <Tables tables={state.tables} />
            <Panel table={state.tables[0]} directions={directions} />
        </div>
    );
}

export default App;
