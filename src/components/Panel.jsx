import React, { useState, useEffect } from 'react';
import Inputs from './Inputs.jsx';
import Selector from './Selector.jsx';

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
                <h1>{state.name} table</h1>
                <Inputs state={state} setState={setState} />
                <Selector currentDirection={state.direction} directions={directions} handleChange={handleSelectChange} />
            </main>
            <footer>
                <button className="cancel" onClick={handleCancel}>cancel</button>
                <button className="ok" onClick={() => okClick(state)}>ok</button>
            </footer>
        </section>
    )
}

export default Panel;
