import React, { createContext, useContext, useReducer } from 'react';

const updateObjectInArray = (array, action) => array.map(
    (item, idx) => idx !== action.index 
    ? item 
    : { ...item, ...action.item }
);

const isEven = n => (n % 2) === 0;

// // factor out
const getCells = (start, increment, end) => {
    if (!start || !increment || !end) return;
    const cellCount = (end - start) / increment + 1;
    return new Array(cellCount).fill(0).map((c, i) => start + i * increment);
}

// factor out
const getRows = (cells, colCount, ltr) => {
    if (!cells || !colCount ) return;
    const rowCount = Math.ceil(cells.length / colCount);
    return new Array(rowCount).fill(0).map((r, i) => {
        const row = cells.slice(i, i + colCount);
        const firstColEven = ltr ? isEven(i) : !isEven(i);
        return firstColEven ? row : row.reverse(); 
    })
}

const Row = ({ rowCells }) => (
    <tr>
        {rowCells.map((cell, idx) => (
            <td key={idx}>{cell}</td>
        ))}
    </tr>
)

const Table = ({ table }) => {
    const colCount = 5;
    const cells = getCells(table.N, table.X, table.M);
    const rows = getRows(cells, colCount, table.D_ltr);
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
        {name: 'red', N: 8, X: 1, M: 29, W: 20, D_ltr: true, D_up: true,},
        {name: 'green', N: 231, X: 1, M: 247, W: 30, D_ltr: true, D_up: true,},
        {name: 'blue', N: 47, X: 2, M: 81, W: 40, D_ltr: false, D_up: true,},
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
