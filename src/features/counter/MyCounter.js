import React from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {selectCount, increment} from './counterSlice';

export function MyCounter() {
    const count = useSelector(selectCount);
    const dispatch = useDispatch();
    return (
        <div>
            MyCounter does work {count}
            <button onClick={() => dispatch(increment())}>increment</button>
        </div>
    )
}