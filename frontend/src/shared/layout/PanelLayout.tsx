'use client';

import { ReactNode } from 'react';
import { Group as PanelGroup, Panel as PanelSlot } from 'react-resizable-panels';
import ResizeHandle from './ResizeHandle';
import { PANEL_CONFIG } from '@/shared/constants/layout';

interface PanelLayoutProps {
  left: ReactNode;
  middle: ReactNode;
  right: ReactNode;
}

export default function PanelLayout({ left, middle, right }: PanelLayoutProps) {
  return (
    <PanelGroup orientation="horizontal" className="h-screen">
      <PanelSlot
        defaultSize={PANEL_CONFIG.left.defaultSize}
        minSize={PANEL_CONFIG.left.minSize}
      >
        {left}
      </PanelSlot>
      <ResizeHandle />
      <PanelSlot
        defaultSize={PANEL_CONFIG.middle.defaultSize}
        minSize={PANEL_CONFIG.middle.minSize}
      >
        {middle}
      </PanelSlot>
      <ResizeHandle />
      <PanelSlot
        defaultSize={PANEL_CONFIG.right.defaultSize}
        minSize={PANEL_CONFIG.right.minSize}
      >
        {right}
      </PanelSlot>
    </PanelGroup>
  );
}
