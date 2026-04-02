'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ChevronDown, User, BarChart2, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const AVATAR_COLORS = [
  'bg-blue-600',
  'bg-purple-600',
  'bg-emerald-600',
  'bg-rose-600',
  'bg-amber-600',
  'bg-cyan-600',
];

function getInitials(name: string | null | undefined, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function getAvatarColor(email: string): string {
  const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function getDisplayName(name: string | null | undefined, email: string): string {
  return name?.trim() || email;
}

export default function UserBadge() {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (!session?.user) return null;

  const { name, email } = session.user;
  const safeEmail = email ?? '';
  const initials = getInitials(name, safeEmail);
  const avatarColor = getAvatarColor(safeEmail);
  const displayName = getDisplayName(name, safeEmail);

  return (
    <div ref={wrapperRef} className="relative px-3 pt-3 pb-2 shrink-0">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 w-full min-h-[44px] px-2 py-1.5 rounded-lg hover:bg-[#EDE9E3] transition-colors"
      >
        <span
          className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white shrink-0 ${avatarColor}`}
        >
          {initials}
        </span>
        <span className="flex-1 text-left text-sm text-[#2C2723] font-medium truncate">
          {displayName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#2C2723]/40 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 z-50 bg-[#F7F5F2]/95 backdrop-blur-xl border border-[#2C2723]/10 rounded-xl shadow-2xl overflow-hidden">
          <div className="px-4 py-3">
            <p className="text-sm font-semibold text-[#2C2723] truncate">{name || safeEmail}</p>
            {name && (
              <p className="text-xs text-[#2C2723]/50 truncate mt-0.5">{safeEmail}</p>
            )}
          </div>

          <div className="h-px bg-[#2C2723]/10 mx-2" />

          <div className="py-1">
            <MenuItem
              icon={<User className="w-3.5 h-3.5" />}
              label="Profile"
              onClick={() => { toast.info('Profile — coming soon'); setOpen(false); }}
            />
            <MenuItem
              icon={<BarChart2 className="w-3.5 h-3.5" />}
              label="Insights & Reports"
              onClick={() => { router.push('/insights'); setOpen(false); }}
            />
            <MenuItem
              icon={<Settings className="w-3.5 h-3.5" />}
              label="Settings"
              onClick={() => { toast.info('Settings — coming soon'); setOpen(false); }}
            />
          </div>

          <div className="h-px bg-[#2C2723]/10 mx-2" />

          <div className="py-1">
            <MenuItem
              icon={<LogOut className="w-3.5 h-3.5" />}
              label="Sign out"
              onClick={() => signOut({ callbackUrl: '/' })}
              danger
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

function MenuItem({ icon, label, onClick, danger = false }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 w-full min-h-[36px] px-4 py-1.5 text-sm transition-colors
        ${danger
          ? 'text-rose-500 hover:bg-rose-500/10 hover:text-rose-600'
          : 'text-[#2C2723]/80 hover:bg-[#2C2723]/5 hover:text-[#2C2723]'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}
