import React from 'react';

const clearInputText = x => isNaN(x) || x === '' ? '' : parseInt(x);

const Inputs = ({ state, setState }) => { // make parameters data subset of state only.

    return (
        <div className="inputs">
            <div>
                <input value={state.data.N} onChange={e => setState({...state, data: {...state.data, N: clearInputText(e.target.value) } }) } />
                <label>Start<span>N</span></label>
            </div>
            <div>
                <input value={state.data.X} onChange={e => setState({...state, data: {...state.data, X: clearInputText(e.target.value) } }) } />
                <label>Increment<span>X</span></label>
            </div>
            <div>
                <input value={state.data.M} onChange={e => setState({...state, data: {...state.data, M: clearInputText(e.target.value) } }) } />
                <label>End<span>M</span></label>
            </div>
            <div>
                <input value={state.data.W} onChange={e => setState({...state, data: {...state.data, W: clearInputText(e.target.value) } }) } />
                <label>Width<span>W</span></label>
            </div>
        </div>
    );
}

export default Inputs;
