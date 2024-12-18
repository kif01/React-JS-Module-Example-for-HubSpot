import { Island } from '@hubspot/cms-components';

import MakeServerlessRequestIsland from './MakeServerlessRequestIsland?island';



export function Component() {
  return (
    <div style={{ fontFamily: "'Lexend Deca', sans-serif"}}>
      <Island
        id="make-serverless-request"
        module={MakeServerlessRequestIsland}
      />
    </div>
  );
}

export const fields = [];

export const meta = {
  label: 'Make Serverless Requests',
};
