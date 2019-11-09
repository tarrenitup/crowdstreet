import React from 'react';
import { StateProvider, useStateValue } from './state.js';

const updateObjectInArray = (array, action) => array.map((item, index) => index !== action.index ? item : { ...item, ...action.item });

const Row = ({  }) => (
    <tr>

    </tr>
);

const Table = ({ table }) => {
    const rows = 5;
    // N: start number, X: increment by, M: max/stop number, W: width of table, D: start direction.
    
    return (
        <div className={`table-outer ${table.name}`}>
            <table style={{width: table.W+'%'}}>

            </table>
            <div className='controls'>
                <button onClick={console.log('clicked!')} />
                <p className='label'>{table.W}%</p>
            </div>
        </div>
    );
}

const Tables = ({ tables }) => (
    <div className='tables'>
        {tables.map( table => <Table table={table} /> )}
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

const directions = [
    {label: 'LTR-UP'},
    {label: 'RTL-UP'},
    {label: 'LTR-DOWN'},
    {label: 'RTL-DOWN'},
]

const initialState = {
    tables: [
        {name: 'red', N: 8, X: 1, M: 29, W: 20, D: 0,},
        {name: 'green', N: 231, X: 1, M: 247, W: 30, D: 0,},
        {name: 'blue', N: 47, X: 2, M: 81, W: 40, D: 0,},
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

const [{ tables }, dispatch] = useStateValue();

const App = () => (
    <StateProvider initialState={initialState} reducer={reducer}>
        <Tables tables={tables} />
        <Panel />
    </StateProvider>
)

export default App;
