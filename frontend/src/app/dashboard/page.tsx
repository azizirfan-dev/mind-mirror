import PanelLayout from '@/shared/layout/PanelLayout';
import JournalHistoryPanel from '@/features/journal/components/JournalHistoryPanel';
import ChatPanel from '@/features/chat/components/ChatPanel';
import JournalEditorPanel from '@/features/journal/components/JournalEditorPanel';

export default function DashboardPage() {
  return (
    <div className="bg-[#F7F5F2] h-screen overflow-hidden">
      <PanelLayout
        left={<JournalHistoryPanel />}
        middle={<ChatPanel />}
        right={<JournalEditorPanel />}
      />
    </div>
  );
}
