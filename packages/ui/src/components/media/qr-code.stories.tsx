import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { QRCodeView } from './qr-code';
import { Input } from '../Input';

const meta: Meta<typeof QRCodeView> = {
  title: 'Media/QrCode',
  component: QRCodeView,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof QRCodeView>;

export const Url: Story = {
  args: { value: 'https://evo.heuresys.com', size: 200, ariaLabel: 'Heuresys URL' },
};
export const Wifi: Story = {
  args: { value: 'WIFI:S:GuestWifi;T:WPA;P:welcome2026;;', size: 240, level: 'H' },
};

function Live() {
  const [v, setV] = useState('hello');
  return (
    <div className="space-y-3">
      <Input value={v} onChange={(e) => setV(e.target.value)} placeholder="Type to update QR…" />
      <QRCodeView value={v || ' '} size={200} />
    </div>
  );
}
export const LiveText: Story = { render: () => <Live /> };
