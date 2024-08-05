// const { v4: uuidv4 } = require('uuid');
import {v4 as uuidv4} from 'uuid';


// getUUID is a function that returns a UUID

export default function getUUID(): string {
  return uuidv4();
}

