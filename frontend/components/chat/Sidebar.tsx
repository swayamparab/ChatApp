import SidebarHeader from "./SidebarHeader";

export default function Sidebar() {
    return (
        <aside className="flex h-full flex-col border-r border-slate-800 bg-slate-900">
            <SidebarHeader />

            <div className="flex-1 overflow-y-auto">
                {/* Conversations */}
            </div>
        </aside>
    );
}