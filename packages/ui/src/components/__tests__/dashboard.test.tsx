import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

import {
  IntegrationHealthPill,
  KpiRing,
  SuccessionCard,
  CareerArc,
  SkillHeatmap,
  CapabilityRadar,
  RbacMatrix,
  type RbacAssignment,
} from '../dashboard';

// kg-mini-graph wraps cytoscape (DOM measure-heavy) — exercised via Storybook visual test, not unit.

describe('IntegrationHealthPill', () => {
  it('renders default OK label with status role', () => {
    render(<IntegrationHealthPill tone="ok" />);
    expect(screen.getByRole('status', { name: /integration health: ok/i })).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('overrides label and respects pulse + showDot=false', () => {
    const { container } = render(
      <IntegrationHealthPill tone="warn" label="DEGRADED" pulse showDot={false} />
    );
    expect(screen.getByText('DEGRADED')).toBeInTheDocument();
    expect(container.querySelector('.animate-pulse')).toBeNull(); // no dot when hidden
  });

  it('a11y clean', async () => {
    const { container } = render(<IntegrationHealthPill tone="down" pulse />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('KpiRing', () => {
  it('renders label + group role with aria value', () => {
    render(<KpiRing value={72} label="Capability score" unit="%" />);
    const group = screen.getByRole('group', { name: /capability score: 72 %/i });
    expect(group).toBeInTheDocument();
    expect(screen.getByText('Capability score')).toBeInTheDocument();
  });

  it('threshold resolution: success when >= goodAt', () => {
    render(<KpiRing value={88} label="Cov" thresholds={{ goodAt: 80, warnAt: 60 }} />);
    expect(screen.getByRole('group', { name: /cov: 88/i })).toBeInTheDocument();
  });

  it('threshold resolution: destructive when below warnAt', () => {
    render(<KpiRing value={42} label="Cov" thresholds={{ goodAt: 80, warnAt: 60 }} />);
    expect(screen.getByRole('group', { name: /cov: 42/i })).toBeInTheDocument();
  });

  it('renders trend percentage when provided', () => {
    render(<KpiRing value={70} label="Score" trend={4.2} />);
    expect(screen.getByText(/4\.2%/)).toBeInTheDocument();
  });
});

describe('SuccessionCard', () => {
  it('renders candidate, current role, target role, readiness gauge', () => {
    render(
      <SuccessionCard
        candidateName="Stefania Bianchi"
        currentRole="Head Credit Risk"
        targetRole="Director Risk"
        readinessPercent={88}
        readiness="ready-now"
        risk="low"
      />
    );
    expect(screen.getByRole('article', { name: /stefania bianchi/i })).toBeInTheDocument();
    expect(screen.getByText('Head Credit Risk')).toBeInTheDocument();
    expect(screen.getByText('Director Risk')).toBeInTheDocument();
    expect(screen.getByText(/low risk/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '88');
  });

  it('clamps readinessPercent above 100', () => {
    render(
      <SuccessionCard candidateName="X" currentRole="A" targetRole="B" readinessPercent={150} />
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });
});

describe('CareerArc', () => {
  it('marks current stage with aria-current=step', () => {
    render(
      <CareerArc
        stages={[
          { id: 'a', label: 'Junior' },
          { id: 'b', label: 'Mid' },
          { id: 'c', label: 'Senior' },
        ]}
        currentIndex={1}
      />
    );
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).not.toHaveAttribute('aria-current');
  });

  it('renders empty message when no stages', () => {
    render(<CareerArc stages={[]} />);
    expect(screen.getByText(/no career stages/i)).toBeInTheDocument();
  });

  it('respects explicit status over currentIndex', () => {
    render(
      <CareerArc
        stages={[
          { id: 'a', label: 'A', status: 'past' },
          { id: 'b', label: 'B', status: 'past' },
          { id: 'c', label: 'C', status: 'current' },
          { id: 'd', label: 'D', status: 'future' },
        ]}
        currentIndex={0} // ignored because all have explicit status
      />
    );
    const items = screen.getAllByRole('listitem');
    expect(items[2]).toHaveAttribute('aria-current', 'step');
  });
});

describe('SkillHeatmap', () => {
  const rows = [
    { id: 'r1', label: 'Finance' },
    { id: 'r2', label: 'Risk' },
  ];
  const cols = [
    { id: 'c1', label: 'SQL' },
    { id: 'c2', label: 'Python' },
  ];
  const cells = [
    { rowId: 'r1', colId: 'c1', value: 80 },
    { rowId: 'r1', colId: 'c2', value: 40 },
    { rowId: 'r2', colId: 'c1', value: 60 },
    { rowId: 'r2', colId: 'c2', value: 20 },
  ];

  it('renders rows × cols cell grid', () => {
    render(<SkillHeatmap rows={rows} cols={cols} cells={cells} />);
    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('SQL')).toBeInTheDocument();
    expect(screen.getByLabelText(/finance × sql: 80/i)).toBeInTheDocument();
  });

  it('renders 0 for missing cell', () => {
    const { container } = render(
      <SkillHeatmap rows={rows} cols={cols} cells={[{ rowId: 'r1', colId: 'c1', value: 80 }]} />
    );
    expect(container.querySelector('td[aria-label="Risk × Python: 0"]')).toBeInTheDocument();
  });

  it('emits onCellClick when interactive', async () => {
    const onCellClick = vi.fn();
    const user = userEvent.setup();
    render(<SkillHeatmap rows={rows} cols={cols} cells={cells} onCellClick={onCellClick} />);
    await user.click(screen.getByLabelText(/finance × sql: 80/i));
    expect(onCellClick).toHaveBeenCalledWith(expect.objectContaining({ value: 80 }));
  });
});

describe('CapabilityRadar', () => {
  const axes = [
    { id: 'a', label: 'Tech' },
    { id: 'b', label: 'Finance' },
    { id: 'c', label: 'Lead' },
    { id: 'd', label: 'Comms' },
    { id: 'e', label: 'Risk' },
  ];

  it('renders SVG with role=img and aria summary', () => {
    render(
      <CapabilityRadar
        axes={axes}
        series={[{ id: 's1', label: 'X', values: [70, 60, 50, 40, 80] }]}
      />
    );
    expect(screen.getByRole('img', { name: /5 axes and 1 series/i })).toBeInTheDocument();
  });

  it('renders series legend labels when showLegend=true', () => {
    render(
      <CapabilityRadar
        axes={axes}
        series={[
          { id: 's1', label: 'Current' },
          { id: 's2', label: 'Target' },
        ].map((s) => ({ ...s, values: [60, 60, 60, 60, 60] }))}
      />
    );
    expect(screen.getByText('Current')).toBeInTheDocument();
    expect(screen.getByText('Target')).toBeInTheDocument();
  });

  it('returns guard message for <3 axes', () => {
    render(
      <CapabilityRadar
        axes={[
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
        ]}
        series={[{ id: 's', label: 's', values: [1, 1] }]}
      />
    );
    expect(screen.getByText(/at least 3 axes/i)).toBeInTheDocument();
  });
});

describe('RbacMatrix', () => {
  const roles = [
    { id: 'su', label: 'SUPERUSER', level: -1 },
    { id: 'emp', label: 'EMPLOYEE', level: 6 },
  ];
  const areas = [
    { id: 'employees', label: 'Employees' },
    { id: 'audit', label: 'Audit' },
  ];
  const assignments: RbacAssignment[] = [
    { roleId: 'su', areaId: 'employees', level: 'owner' },
    { roleId: 'su', areaId: 'audit', level: 'owner' },
    { roleId: 'emp', areaId: 'employees', level: 'read' },
  ];

  it('renders header + body cells with level glyph', () => {
    render(<RbacMatrix roles={roles} areas={areas} assignments={assignments} readonly />);
    expect(screen.getByText('SUPERUSER')).toBeInTheDocument();
    expect(screen.getByText('Employees')).toBeInTheDocument();
    expect(screen.getByLabelText(/superuser × employees: owner/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/employee × audit: none/i)).toBeInTheDocument();
  });

  it('cycles permission level on cell click when interactive', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RbacMatrix roles={roles} areas={areas} assignments={assignments} onChange={onChange} />
    );
    await user.click(screen.getByLabelText(/employee × employees: read/i));
    expect(onChange).toHaveBeenCalledWith({
      roleId: 'emp',
      areaId: 'employees',
      level: 'write',
    });
  });

  it('readonly mode does not render interactive role on cells', () => {
    render(<RbacMatrix roles={roles} areas={areas} assignments={assignments} readonly />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
