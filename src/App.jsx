import React, { useReducer, useState, useEffect } from 'react';
import Cog from './components/Cog.jsx';

const isEven = n => (n % 2) === 0;

// factor out
const getCells = (start, increment, end) => {
    if (!start || !increment || !end) return;
    const cellCount = Math.floor((end - start) / increment) + 1;
    return new Array(cellCount).fill(null).map((c, i) => start + i * increment);
}

const padShortRow = (row, colCount, ltr) => {
    const extras = colCount - row.length;
    return extras 
        ? row.concat(new Array(extras).fill(null))
        : row;
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
            const empty = cell ? '' : 'empty';
            return (
                <td className={empty} key={idx}>{cell}</td>
            )
        })}
    </tr>
)

const Table = ({ table, tableId, configClick, directions }) => {
    const colCount = 5;
    const cells = getCells(table.data.N, table.data.X, table.data.M);
    const rows = getRows(cells, colCount, directions[table.direction].ltr);
    const rowsInline = directions[table.direction].up ? rows.reverse() : rows;

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
                <button onClick={() => configClick(tableId)}>
                    <Cog/>
                    <span>configure</span>
                </button>
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

const Inputs = ({ state, setState }) => { // make parameters data subset of state only.
    return (
        <div className="inputs">
            <div>
                <label>Start</label>
                <input value={state.data.N} onChange={e => setState({...state, data: {...state.data, N: parseInt(e.target.value) } }) } />
            </div>
            <div>
                <label>Increment</label>
                <input value={state.data.X} onChange={e => setState({...state, data: {...state.data, X: parseInt(e.target.value) } }) } />
            </div>
            <div>
                <label>End</label>
                <input value={state.data.M} onChange={e => setState({...state, data: {...state.data, M: parseInt(e.target.value) } }) } />
            </div>
            <div>
                <label>Width</label>
                <input value={state.data.W} onChange={e => setState({...state, data: {...state.data, W: parseInt(e.target.value) } }) } />
            </div>
        </div>
    );
}

const Selector = ({currentDirection, directions, handleChange}) => {
    return (
        <select onChange={handleChange} value={currentDirection}>
            {Object.keys(directions).map((direction, idx) => {
                return (<option key={idx+'op'} value={direction}>{directions[direction].label}</option>);
            })}
        </select>
    )
}

const Panel = ({ table, directions, okClick, close }) => {

    const initialState = table;
    const [ state, setState ] = useState(initialState);

    useEffect(() => {
        setState(initialState);
    },[table]);

    const handleSelectChange = (e) => {
        setState({...state, direction: e.target.value});
    }

    const handleCancel = () => {
        setState(initialState);
        close();
    }

    return (
        <section className={`panel ${state.name}`}>
            <main className="parameters">
                <h1>table {state.name}</h1>
                <Inputs state={state} setState={setState} />
                <Selector currentDirection={state.direction} directions={directions} handleChange={handleSelectChange} />
            </main>
            <footer>
                <button className="ok" onClick={() => okClick(state)}>ok</button>
                <button className="cancel" onClick={handleCancel}>cancel</button>
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

const updateObjectInArray = (array, action) => array.map(
    (item, idx) => idx !== action.index 
    ? item 
    : { ...action.item }
);

const reducer = (state, action) => {
    switch (action.type) {
        case 'updateTable':
            return {
                ...state,
                tables: updateObjectInArray(state.tables, action),
            };
        case 'changePanelTable':
            return {
                ...state,
                panel: {...state.panel, tableIdx: action.payload},
            }
        case 'openPanel':
            return {
                ...state,
                panel: {...state.panel, open: action.item},
            }

        default:
            return state;
    }
};

const App = () => {

    const [ state, dispatch ] = useReducer(reducer, initialState);

    const closePanel = () => {
        dispatch({type: 'openPanel', item: false});
    }

    const openPanel = () => {
        dispatch({type: 'openPanel', item: true});
    }

    const configClick = (tableId) => {
        dispatch({type:'changePanelTable', payload: tableId});
        openPanel();
    }

    const panelOkClick = (newTable) => {
        dispatch({type:'updateTable', item: newTable, index: panelTableIdx});
        closePanel();
    }
    
    const panelTableIdx = state.panel.tableIdx;
    const panelTable = state.tables[panelTableIdx];

    return (
        <div className={`App ${state.panel.open ? 'panel-show' : ''}`}>
            <Tables tables={state.tables} configClick={configClick} directions={directions} />
            <Panel table={panelTable} directions={directions} okClick={panelOkClick} close={closePanel}  />
        </div>
    );
}

export default App;
