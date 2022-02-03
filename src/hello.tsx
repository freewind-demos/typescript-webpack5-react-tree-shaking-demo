import React, {FC} from 'react';
import {utils} from './utils';

type Props = {};

export const Hello: FC<Props> = ({}) => {
  return <div>
    <h1>Hello {utils.util1('React')}</h1>
  </div>;
}
