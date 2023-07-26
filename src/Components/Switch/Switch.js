import React from 'react';
import * as radixSwitch from '@radix-ui/react-switch';
import './Switch.css';

const Switch = () => (
  <form>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label className="Label" htmlFor="airplane-mode" style={{ paddingRight: 15,fontSize:"0.8rem" }}>
        Night Mode
      </label>
      <radixSwitch.Root className="SwitchRoot" id="airplane-mode">
        <radixSwitch.Thumb className="SwitchThumb" />
      </radixSwitch.Root>
    </div>
  </form>
);

export default Switch;