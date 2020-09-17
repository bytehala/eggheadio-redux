import React from 'react';

import {useSelector} from 'react-redux';
import {selectCount} from './counterSlice';

export function MyCounter() {
    const count = useSelector(selectCount);
    return (
        <div>
            MyCounter does work {count}
        </div>
    )
}