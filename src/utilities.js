
export const isEven = n => (n % 2) === 0;

export const padShortRow = (row, colCount, ltr) => {
    const extras = colCount - row.length;
    return extras 
        ? row.concat(new Array(extras).fill(null))
        : row;
}

export const getCells = (start, increment, end) => {
    if (!start || !increment || !end) return;
    const cellCount = Math.floor((end - start) / increment) + 1;
    return new Array(cellCount).fill(null).map((c, i) => start + i * increment);
}

export const getRow = (cells, rowIdx, colCount, ltr) => {
    const row = cells.slice(rowIdx*colCount, rowIdx*colCount + colCount);
    const paddedRow = padShortRow(row, colCount, ltr);
    const firstColEven = ltr ? isEven(rowIdx) : !isEven(rowIdx);
    return firstColEven ? paddedRow : paddedRow.reverse(); 
}

export const getRows = (cells, colCount, ltr) => {
    if (!cells || !colCount ) return;
    const preciseRowCount = cells.length / colCount;
    const rowCount = Math.ceil(preciseRowCount);
    return new Array(rowCount).fill(null).map((r, i) => getRow(cells, i, colCount, ltr))
}

export const updateObjectInArray = (array, action) => array.map(
    (item, idx) => idx !== action.index 
    ? item 
    : { ...action.item }
);
