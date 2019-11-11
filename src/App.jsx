import React, { useReducer, useState, useEffect } from 'react';
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

const Table = ({ table, tableId, configClick, directions }) => {
    const colCount = 5;
    const cells = getCells(table.data.N, table.data.X, table.data.M);
    const rows = getRows(cells, colCount, directions[table.direction].ltr);
    const rowsInline = directions[table.direction].up ? rows.reverse() : rows;
    
    const temp = () => {
        configClick(tableId);
    }

    return (
        <div className={`table-outer ${table.name}`} style={{width: `${table.data.W}%`}}>
            <table>
                <tbody>
                    {rowsInline.map((rowCells, idx) => (
                        <Row rowCells={rowCells} key={idx} />
                    ))}
                </tbody>
            </table>
            <div className='controls'>
                <button onClick={temp}>configure</button>
                <p className='label'>{table.data.W}%</p>
            </div>
        </div>
    );
}

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

const Inputs = ({ data, reset }) => {

    const [ state, setState ] = useState(data);
    
    useEffect(() => {
        setState(data);
    }, [data]);


    return (
        <div className="inputs">
            <div>
                <label>N</label>
                <input value={state.N} onChange={(e) => setState({...state, N: e.target.value})} />
            </div>
            <div>
                <label>X</label>
                <input value={state.X} onChange={(e) => setState({...state, X: e.target.value})} />
            </div>
            <div>
                <label>M</label>
                <input value={state.M} onChange={(e) => setState({...state, M: e.target.value})} />
            </div>
            <div>
                <label>W</label>
                <input value={state.W} onChange={(e) => setState({...state, W: e.target.value})} />
            </div>
        </div>
    );
}

const Panel = ({ table }) => {

    const [ state, setState ] = useState({name: table.name, direction: table.direction});

    useEffect(() => {
        setState(table);
    }, [table]);

    return (
        <section className={`panel ${state.name}`}>
            <main className="parameters">
                <h1>table {state.name}</h1>
                <Inputs data={table.data} />
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
    panel: {
        open: false,
        tableIdx: 0,
    },
    tables: [
        {
            name: 'red', 
            data: {N: 8, X: 1, M: 29, W: 20}, 
            direction: 'LTR_UP',
        },
        {
            name: 'green', 
            data: {N: 231, X: 1, M: 247, W: 30}, 
            direction: 'LTR_UP',
        },
        {
            name: 'blue', 
            data: {N: 47, X: 2, M: 81, W: 40}, 
            direction: 'RTL_UP',
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
        case 'changePanelTable':
            return {
                ...state,
                panel: {...state.panel, tableIdx: action.payload}
            }
        default:
            return state;
    }
};

const App = () => {

    const [ state, dispatch ] = useReducer(reducer, initialState);

    const configClick = (tableId) => {
        dispatch({type:'changePanelTable', payload: tableId})
    }
    
    const panelTableIdx = state.panel.tableIdx;
    const panelTable = state.tables[panelTableIdx];

    return (
        <div className='App'>
            <Tables tables={state.tables} configClick={configClick} directions={directions} />
            <Panel table={panelTable} directions={directions} />
        </div>
    );
}

export default App;
