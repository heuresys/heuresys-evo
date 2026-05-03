import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Accordion>;

export const Single: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[500px]">
      <AccordionItem value="a">
        <AccordionTrigger>What is multi-tenant?</AccordionTrigger>
        <AccordionContent>
          Each customer is isolated via tenantId on every query (P1 principle).
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>How is RBP enforced?</AccordionTrigger>
        <AccordionContent>
          Decorator @RequirePermission('AREA','ACTION') + RLS DB-level.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>What is PET strategy?</AccordionTrigger>
        <AccordionContent>
          33 functional areas, 47 PET (Process/Enterprise/Talent) mapping.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-[500px]">
      <AccordionItem value="1">
        <AccordionTrigger>Section 1</AccordionTrigger>
        <AccordionContent>Content 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>Content 2</AccordionContent>
      </AccordionItem>
      <AccordionItem value="3">
        <AccordionTrigger>Section 3</AccordionTrigger>
        <AccordionContent>Content 3</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  parameters: {
    docs: { description: { story: 'type="multiple" — più sezioni aperte contemporaneamente.' } },
  },
};
