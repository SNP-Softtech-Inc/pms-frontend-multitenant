import React from 'react'
import { Link } from 'react-router-dom'
import { 
  PiNotepad, 
  PiChatCircle, 
  PiFileText, 
  PiBriefcase, 
  PiReceipt, 
  PiPaperPlaneTilt
} from "react-icons/pi";
import { useParams } from "react-router-dom";

// Empty hardcoded data
const hardcodedData = {
  chats: [],
  organizers: [],
  proposals: [],
  jobs: [],
  invoices: []
};

const Overview = () => {
  const { data } = useParams();
  const accountId = data || "ACC-001";

  const EmptyState = ({ label, icon: Icon = PiNotepad }) => (
    <div className="flex flex-col items-center py-12 text-muted-foreground/60">
      <Icon className="text-5xl mb-3 opacity-50" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );

  const SectionHeader = ({ title, to, icon: Icon, count }) => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="text-primary text-lg" />}
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {count !== undefined && (
          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
            {count}
          </span>
        )}
      </div>
      <Link 
        to={to} 
        className="text-sm font-medium text-primary hover:text-primary/80 no-underline transition-colors flex items-center gap-1"
      >
        View all
        <PiPaperPlaneTilt className="text-xs" />
      </Link>
    </div>
  );

  const TableHead = ({ cols }) => (
    <thead>
      <tr className="bg-muted/50 border-b border-border">
        {cols.map((c, idx) => (
          <th key={idx} className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Account Header */}
      <div className="mb-6 pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Account Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Account ID: {accountId}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Jobs</p>
              <p className="text-2xl font-bold text-foreground">0</p>
            </div>
            <PiBriefcase className="text-3xl text-primary/60" />
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Unpaid Invoices</p>
              <p className="text-2xl font-bold text-foreground">0</p>
            </div>
            <PiReceipt className="text-3xl text-primary/60" />
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Active Chats</p>
              <p className="text-2xl font-bold text-foreground">0</p>
            </div>
            <PiChatCircle className="text-3xl text-primary/60" />
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pending Organizers</p>
              <p className="text-2xl font-bold text-foreground">0</p>
            </div>
            <PiFileText className="text-3xl text-primary/60" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── LEFT COLUMN ── */}
        <div className="space-y-6">
          {/* Chats Card */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <SectionHeader 
              title="Chats" 
              to={`/clients/accounts/accountsdash/communication/${accountId}`}
              icon={PiChatCircle}
              count={0}
            />
            <EmptyState label="No chats available" icon={PiChatCircle} />
          </div>

          {/* Organizers Card */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <SectionHeader 
              title="Organizers" 
              to={`/clients/accounts/accountsdash/organizers/${accountId}`}
              icon={PiFileText}
              count={0}
            />
            <EmptyState label="No organizers available" icon={PiFileText} />
          </div>

          {/* Proposals Card */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <SectionHeader 
              title="Proposals & ELs" 
              to={`/clients/accounts/accountsdash/proposals/${accountId}`}
              icon={PiNotepad}
              count={0}
            />
            <EmptyState label="No proposals available" icon={PiNotepad} />
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-6">
          {/* Jobs Card */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <SectionHeader 
              title="Jobs" 
              to={`/clients/accounts/accountsdash/workflow/${accountId}/activejobs`}
              icon={PiBriefcase}
              count={0}
            />
            <EmptyState label="No jobs available" icon={PiBriefcase} />
          </div>

          {/* Invoices Card */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <SectionHeader 
              title="Unpaid Invoices" 
              to={`/clients/accounts/accountsdash/invoices/${accountId}/invoice`}
              icon={PiReceipt}
              count={0}
            />
            <EmptyState label="No unpaid invoices available" icon={PiReceipt} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview