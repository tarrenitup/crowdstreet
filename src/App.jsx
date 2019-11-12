import React, { useReducer, useState, useEffect } from 'react';
import Tables from './components/Tables.jsx';
import Panel from './components/Panel.jsx';
import { updateObjectInArray } from './utilities.js';

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
