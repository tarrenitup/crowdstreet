import React from 'react';

const Selector = ({currentDirection, directions, handleChange}) => {
    return (
        <div className="select-outer">
            <select onChange={handleChange} value={currentDirection}>
                {Object.keys(directions).map((direction, idx) => {
                    return (<option key={idx+'op'} value={direction}>{directions[direction].label}</option>);
                })}
            </select>
            <label>Direction<span>D</span></label>
        </div>
    )
}

export default Selector;
