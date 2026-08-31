import { v4 as uuidv4 } from 'uuid';

export const generateRequestId = (): string => {
  return uuidv4();
};
