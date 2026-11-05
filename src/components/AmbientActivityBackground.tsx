import React from 'react';
import {
  TreePine,
  HeartHandshake,
  Stethoscope,
  Utensils,
  BookOpen,
  Recycle,
  Droplets,
  Users,
} from 'lucide-react';

export function AmbientActivityBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Soft Ambient Gradient Glows */}
      <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-purple-600/10 dark:bg-fuchsia-600/10 blur-3xl ambient-orb-1" />
      <div className="absolute top-1/3 -right-32 w-[380px] h-[380px] rounded-full bg-fuchsia-500/10 dark:bg-purple-600/12 blur-3xl ambient-orb-2" />
      <div className="absolute -bottom-32 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/8 dark:bg-amber-500/8 blur-3xl ambient-orb-1" />

      {/* Floating Foundation Activity Emblem Badges in Wide Outer Margins */}
      <div className="hidden 2xl:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-purple-900/5 dark:bg-purple-900/20 border border-purple-500/15 dark:border-purple-400/15 backdrop-blur-[2px] absolute top-28 left-5 float-activity-a opacity-55">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
          <TreePine className="w-4 h-4" />
        </div>
        <div className="text-[10px] leading-tight">
          <p className="font-bold text-slate-700 dark:text-purple-200">Tree Plantation</p>
          <p className="text-slate-500 dark:text-purple-300/60">Uttara &amp; Mirpur</p>
        </div>
      </div>

      <div className="hidden 2xl:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-purple-900/5 dark:bg-purple-900/20 border border-purple-500/15 dark:border-purple-400/15 backdrop-blur-[2px] absolute top-44 right-5 float-activity-b opacity-55">
        <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500 dark:text-amber-400">
          <HeartHandshake className="w-4 h-4" />
        </div>
        <div className="text-[10px] leading-tight">
          <p className="font-bold text-slate-700 dark:text-purple-200">Winter Relief</p>
          <p className="text-slate-500 dark:text-purple-300/60">Mirpur 10, Dhaka</p>
        </div>
      </div>

      <div className="hidden 2xl:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-purple-900/5 dark:bg-purple-900/20 border border-purple-500/15 dark:border-purple-400/15 backdrop-blur-[2px] absolute top-[54%] left-4 float-activity-c opacity-50">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
          <Recycle className="w-4 h-4" />
        </div>
        <div className="text-[10px] leading-tight">
          <p className="font-bold text-slate-700 dark:text-purple-200">Lake Clean-Up</p>
          <p className="text-slate-500 dark:text-purple-300/60">Dhanmondi Lake</p>
        </div>
      </div>

      <div className="hidden 2xl:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-purple-900/5 dark:bg-purple-900/20 border border-purple-500/15 dark:border-purple-400/15 backdrop-blur-[2px] absolute top-[58%] right-4 float-activity-a opacity-50">
        <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-500 dark:text-rose-400">
          <Stethoscope className="w-4 h-4" />
        </div>
        <div className="text-[10px] leading-tight">
          <p className="font-bold text-slate-700 dark:text-purple-200">Free Health Camp</p>
          <p className="text-slate-500 dark:text-purple-300/60">Banani, Dhaka</p>
        </div>
      </div>

      <div className="hidden 2xl:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-purple-900/5 dark:bg-purple-900/20 border border-purple-500/15 dark:border-purple-400/15 backdrop-blur-[2px] absolute bottom-28 left-6 float-activity-b opacity-50">
        <div className="w-7 h-7 rounded-lg bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-500 dark:text-fuchsia-400">
          <Utensils className="w-4 h-4" />
        </div>
        <div className="text-[10px] leading-tight">
          <p className="font-bold text-slate-700 dark:text-purple-200">Community Meals</p>
          <p className="text-slate-500 dark:text-purple-300/60">Old Dhaka</p>
        </div>
      </div>

      <div className="hidden 2xl:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-purple-900/5 dark:bg-purple-900/20 border border-purple-500/15 dark:border-purple-400/15 backdrop-blur-[2px] absolute bottom-24 right-6 float-activity-c opacity-50">
        <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-500 dark:text-violet-400">
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="text-[10px] leading-tight">
          <p className="font-bold text-slate-700 dark:text-purple-200">Youth Education</p>
          <p className="text-slate-500 dark:text-purple-300/60">Rayerbazar</p>
        </div>
      </div>

      {/* Subtle Floating Activity Watermark Icons Across Canvas */}
      <div className="absolute top-[22%] left-[4%] text-purple-500/10 dark:text-purple-400/10 float-activity-b">
        <Droplets className="w-9 h-9" />
      </div>
      <div className="absolute top-[74%] left-[5%] text-fuchsia-500/10 dark:text-fuchsia-400/10 float-activity-a">
        <Users className="w-10 h-10" />
      </div>
      <div className="absolute top-[38%] right-[4%] text-amber-500/10 dark:text-amber-400/10 float-activity-c">
        <TreePine className="w-10 h-10" />
      </div>
    </div>
  );
}
