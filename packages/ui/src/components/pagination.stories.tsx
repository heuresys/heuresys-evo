import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination } from './pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Pagination>;

function Demo({ total = 25, jumpTo = false, sizePicker = false }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  return (
    <div className="space-y-3">
      <Pagination
        page={page}
        pageCount={total}
        onPageChange={setPage}
        showJumpTo={jumpTo}
        showPageSize={sizePicker}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
      <p className="text-xs text-neutral-500">
        Page {page} of {total} | Size {pageSize}
      </p>
    </div>
  );
}

export const Default: Story = { render: () => <Demo total={10} /> };
export const ManyPages: Story = { render: () => <Demo total={50} /> };
export const WithJumpTo: Story = { render: () => <Demo total={250} jumpTo /> };
export const Full: Story = { render: () => <Demo total={100} jumpTo sizePicker /> };
export const FewPages: Story = { render: () => <Demo total={3} /> };
