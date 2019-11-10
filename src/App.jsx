import React, { createContext, useContext, useReducer } from 'react';

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
    const cells = getCells(table.N, table.X, table.M);
    const rows = getRows(cells, colCount, table.D_ltr);
    console.log(rows);
    const rowsInline = table.D_up ? rows.reverse() : rows;

    return (
        <div className={`table-outer ${table.name}`}>
            <table style={{width: `${table.W}%`}}>
                <tbody>
                    {rowsInline.map((rowCells, idx) => (
                        <Row rowCells={rowCells} key={idx} />
                    ))}
                </tbody>
            </table>
            <div className='controls'>
                <button onClick={() => console.log('clicked!')} />
                <p className='label'>{table.W}%</p>
            </div>
        </div>
    );
}

const Tables = ({ tables }) => (
    <div className='tables'>
        {tables.map((table, idx) => <Table table={table} key={idx} /> )}
    </div>
)

const Panel = () => (
    <section className='tables'>
        <main className="parameters">
            <input type="text" />
            <input type="text" />
            <input type="text" />
            <input type="text" />
            <input type="text" />
        </main>
        <footer>
            <button className="ok" value='ok' />
            <button className="cancel" value='cancel' />
        </footer>
    </section>
)

const directionsKey = [
    {label: 'LTR-UP', ltr: true, up: true},
    {label: 'RTL-UP', ltr: false, up: true},
    {label: 'LTR-DOWN', ltr: true, up: false},
    {label: 'RTL-DOWN', ltr: false, up: false},
]

const initialState = {
    tables: [
        {name: 'red', N: 8, X: 1, M: 29, W: 20, D_label: 'LTR-UP', D_ltr: true, D_up: true,},
        {name: 'green', N: 231, X: 1, M: 247, W: 30, D_label: 'LTR-UP', D_ltr: true, D_up: true,},
        {name: 'blue', N: 47, X: 2, M: 81, W: 40, D_label: 'RTL-UP', D_ltr: false, D_up: true,},
    ]
};

// const initialState = { test: 0 };

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
        </div>
    );
}

export default App;
