import { start, interruptable } from './src/index';

import { execute } from 'effection';

execute(interruptable(start(3000)));
