'use client';

import * as React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { cn } from '../../lib/cn';

/**
 * EChartsCard — generic ECharts wrapper. Pass option object directly. Theme
 * follows tokens via CSS variables. (TIER 4 charts core)
 */
export interface EChartsCardProps {
  option: EChartsOption;
  height?: number | string;
  loading?: boolean;
  className?: string;
  onEvents?: Record<string, (params: unknown) => void>;
  ariaLabel?: string;
}

export function EChartsCard({
  option,
  height = 320,
  loading,
  className,
  onEvents,
  ariaLabel = 'Chart',
}: EChartsCardProps) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn('rounded-md border border-border bg-background p-2', className)}
    >
      <ReactECharts
        option={option}
        style={{ height, width: '100%' }}
        showLoading={loading}
        notMerge={true}
        lazyUpdate={true}
        onEvents={onEvents}
      />
    </div>
  );
}

/**
 * Quick presets for common charts. Pass `data` shaped per preset.
 */
export const echartsPresets = {
  line(data: { x: string[]; series: { name: string; values: number[] }[] }): EChartsOption {
    return {
      tooltip: { trigger: 'axis' },
      legend: { data: data.series.map((s) => s.name) },
      xAxis: { type: 'category', data: data.x },
      yAxis: { type: 'value' },
      series: data.series.map((s) => ({
        name: s.name,
        type: 'line',
        smooth: true,
        data: s.values,
      })),
    };
  },
  bar(data: { x: string[]; series: { name: string; values: number[] }[] }): EChartsOption {
    return {
      tooltip: { trigger: 'axis' },
      legend: {},
      xAxis: { type: 'category', data: data.x },
      yAxis: { type: 'value' },
      series: data.series.map((s) => ({ name: s.name, type: 'bar', data: s.values })),
    };
  },
  pie(data: { name: string; value: number }[]): EChartsOption {
    return {
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', right: 0 },
      series: [{ type: 'pie', radius: ['40%', '70%'], data }],
    };
  },
  heatmap(data: { x: string[]; y: string[]; values: [number, number, number][] }): EChartsOption {
    return {
      tooltip: { position: 'top' },
      grid: { height: '70%' },
      xAxis: { type: 'category', data: data.x },
      yAxis: { type: 'category', data: data.y },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
      },
      series: [{ type: 'heatmap', data: data.values, label: { show: true } }],
    };
  },
  sankey(data: {
    nodes: { name: string }[];
    links: { source: string; target: string; value: number }[];
  }): EChartsOption {
    return {
      tooltip: {},
      series: [
        { type: 'sankey', data: data.nodes, links: data.links, emphasis: { focus: 'adjacency' } },
      ],
    };
  },
  funnel(data: { name: string; value: number }[]): EChartsOption {
    return {
      tooltip: { trigger: 'item' },
      series: [{ type: 'funnel', sort: 'descending', data }],
    };
  },
  treemap(data: { name: string; value: number; children?: unknown[] }[]): EChartsOption {
    return {
      tooltip: {},
      series: [
        {
          type: 'treemap',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: data as any,
          label: { show: true },
          breadcrumb: { show: true },
        },
      ],
    };
  },
  radar(data: {
    indicator: { name: string; max: number }[];
    series: { name: string; value: number[] }[];
  }): EChartsOption {
    return {
      tooltip: {},
      legend: {},
      radar: { indicator: data.indicator },
      series: [{ type: 'radar', data: data.series }],
    };
  },
  gauge(value: number, max = 100): EChartsOption {
    return {
      series: [
        {
          type: 'gauge',
          progress: { show: true },
          detail: { valueAnimation: true, formatter: '{value}' },
          data: [{ value }],
          max,
        },
      ],
    };
  },
} as const;
