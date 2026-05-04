import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, LayoutDashboard, PenTool, User as UserIcon, Zap, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import Logo from './Logo';
import { logOut } from '../services/firebaseService';

interface NavigationProps {
  user: any;
  profile: any;
}

export default function Navigation({ user, profile }: NavigationProps) {
  const location = useLocation();

  const navItems = [
    { name: 'AI Studio', path: '/studio', icon: PenTool, highlight: true },
    { name: 'Command Center', path: '/command', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <>
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center">
                <Logo size="md" />
              </Link>
              
              <div className="hidden md:ml-8 md:flex md:space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                      location.pathname === item.path
                        ? "bg-white/10 text-white border border-white/10"
                        : "text-slate-400 hover:text-white hover:bg-white/5",
                      item.highlight && "ai-studio-highlight"
                    )}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.15)] relative overflow-hidden group transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                  <div className="absolute inset-0 bg-emerald-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)] relative z-10 animate-pulse" />
                  <span className="text-sm font-black text-emerald-400 tracking-wide relative z-10">
                    {(profile?.freeCredits || 0) + (profile?.paidCredits || 0)} Credits
                  </span>
                </div>
                
                <button
                  onClick={logOut}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:text-red-400 transition-all text-slate-400 text-[10px] font-black uppercase tracking-widest"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4">
        <div className="bg-slate-950/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex items-center justify-around p-3 shadow-2xl">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all",
                location.pathname === item.path
                  ? "text-blue-400 bg-blue-500/10"
                  : "text-slate-500 hover:text-slate-300",
                item.highlight && "ai-studio-highlight"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item.name.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
