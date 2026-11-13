
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

import AddCustomerModal from "../components/AddCustomerModal";
import EditCustomerModal from "../components/EditCustomerModal";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef(null);

    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch customers
    const fetchCustomers = useCallback(async (searchTerm = "") => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/customers", {
                params: searchTerm.trim()
                    ? { search: searchTerm.trim() }
                    : {}
            });

            setCustomers(response.data.customers || []);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch customers"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // Close profile dropdown when clicking outside or pressing Escape
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target)
            ) {
                setShowProfileMenu(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    // Search
    const handleSearch = (e) => {
        e.preventDefault();
        fetchCustomers(search);
    };

    // Clear search
    const handleClear = () => {
        setSearch("");
        fetchCustomers("");
    };

    // Logout
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Delete customer
    const handleDelete = async (customerId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`/customers/${customerId}`);
            await fetchCustomers(search);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete customer"
            );
        }
    };

    const firstName = user?.name?.trim().split(" ")[0] || "there";

    const initials = user?.name
        ?.trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U";

    return (
        <div className="min-h-screen bg-[#f6f7fb] lg:flex">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 min-h-screen bg-[#17152f] text-white flex-col sticky top-0 h-screen">

                <div className="px-7 py-7">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-900/40">
                            C
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight">
                                ClientFlow
                            </h1>
                            <p className="text-xs text-indigo-300">
                                Customer workspace
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-5 mt-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold px-3 mb-4">
                        Workspace
                    </p>

                    <nav className="space-y-2">
                        <button
                            type="button"
                            onClick={() =>
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth"
                                })
                            }
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-400/20 text-left"
                        >
                            <span className="text-lg">◫</span>
                            Overview
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                document.getElementById("customers")?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start"
                                })
                            }
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition text-left"
                        >
                            <span className="text-lg">◉</span>
                            Customers
                        </button>
                    </nav>
                </div>

                <div className="mt-auto p-5">
                    <div className="border-t border-white/10 pt-5">
                        <div className="flex items-center gap-3 px-2 mb-5">
                            <div className="w-10 h-10 rounded-full bg-indigo-400/20 text-indigo-300 flex items-center justify-center font-semibold">
                                {initials}
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm font-semibold truncate">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-xs text-slate-400">
                                    Account
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-300 hover:bg-red-400/10 transition"
                        >
                            <span>↪</span>
                            Sign out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Workspace */}
            <div className="flex-1 min-w-0">

                {/* Mobile Header */}
                <header className="lg:hidden bg-[#17152f] text-white px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center font-bold">
                            C
                        </div>
                        <span className="text-lg font-bold">
                            ClientFlow
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="text-sm text-slate-300 hover:text-white"
                    >
                        Sign out
                    </button>
                </header>

                {/* Top Bar */}
                <header className="hidden lg:flex h-20 bg-white border-b border-slate-200/70 px-10 items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-400">
                            Workspace / Overview
                        </p>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileMenuRef}>

                        <button
                            type="button"
                            onClick={() => setShowProfileMenu((prev) => !prev)}
                            aria-expanded={showProfileMenu}
                            className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-slate-50 transition"
                        >
                            <div className="text-right">
                                <p className="text-sm font-semibold text-slate-800">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-xs text-slate-400">
                                    Signed in
                                </p>
                            </div>

                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                {initials}
                            </div>
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 top-full mt-3 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">

                                <div className="px-4 py-2 border-b border-slate-100">
                                    <p className="text-sm font-semibold text-slate-800 truncate">
                                        {user?.name || "User"}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Account
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        handleLogout();
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                                >
                                    ↪ Sign out
                                </button>

                            </div>
                        )}
                    </div>
                </header>

                <main className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-10 py-6 lg:py-8">

                    {/* Page Heading */}
                    <section
                        id="overview"
                        className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-7"
                    >
                        <div>
                            <p className="text-sm font-semibold text-indigo-600 mb-2">
                                OVERVIEW
                            </p>

                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                                Welcome back, {firstName}
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Here's what's happening with your customers.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200/70 font-medium flex items-center justify-center gap-2 transition"
                        >
                            <span className="text-xl leading-none">+</span>
                            Add Customer
                        </button>
                    </section>

                    {/* Overview Cards */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">

                        {/* Customers Count */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-500">
                                    Customers in view
                                </p>

                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                                    ◉
                                </div>
                            </div>

                            <h3 className="text-3xl font-bold text-slate-900 mt-3">
                                {customers.length}
                            </h3>

                            <p className="text-xs text-slate-400 mt-1">
                                {search.trim()
                                    ? "Matching search results"
                                    : "Your customer records"}
                            </p>
                        </div>

                        {/* Current View */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-500">
                                    Current view
                                </p>

                                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-xl">
                                    ▤
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mt-3">
                                {search.trim() ? "Search results" : "Full directory"}
                            </h3>

                            <p className="text-xs text-slate-400 mt-1">
                                {search.trim()
                                    ? "Filtered customer records"
                                    : "All your customer records"}
                            </p>
                        </div>

                        {/* Yaloric Assessment Card */}
                        <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-5 shadow-sm sm:col-span-2 xl:col-span-1">

                            {/* Decorative accents */}
                            <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-indigo-200/40 blur-2xl"></div>

                            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-transparent"></div>

                            <div className="relative z-10">

                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-indigo-500"></span>

                                    <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">
                                        Software Engineering Intern Assessment
                                    </p>
                                </div>

                                <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-900">
                                    Built for Yaloric<span className="text-indigo-600">.</span>
                                </h3>

                                <p className="mt-2 text-sm leading-5 text-slate-600">
                                    Thank you for taking the time to review my work ☺️.
                                </p>

                                <div className="mt-3 border-t border-indigo-100 pt-3">
                                    <p className="text-xs text-slate-500">
                                        Designed & developed by
                                    </p>

                                    <a
                                        href="https://rauniaadi127.vercel.app/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition hover:text-violet-700 hover:underline"
                                    >
                                        Aditya Rauniyar
                                        <span aria-hidden="true">↗</span>
                                    </a>
                                </div>

                            </div>
                        </div>

                    </section>

                    {/* Customer Directory */}
                    <section
                        id="customers"
                        className="scroll-mt-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden"
                    >

                        {/* Directory Header */}
                        <div className="px-6 sm:px-8 py-6 border-b border-slate-100">

                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">

                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        Customer Directory
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-1">
                                        Manage and organize your customer records.
                                    </p>
                                </div>

                                {/* Search */}
                                <form
                                    onSubmit={handleSearch}
                                    className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto"
                                >
                                    <div className="relative flex-1 xl:w-72">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            ⌕
                                        </span>

                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search customers..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800 text-sm font-medium"
                                    >
                                        Search
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="bg-slate-100 text-slate-600 px-4 py-3 rounded-xl hover:bg-slate-200 text-sm font-medium"
                                    >
                                        Clear
                                    </button>
                                </form>

                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">

                            <table className="w-full text-left">

                                <thead className="bg-slate-50/80">
                                    <tr className="text-xs uppercase tracking-wider text-slate-400">
                                        <th className="px-6 sm:px-8 py-4 font-semibold">Customer</th>
                                        <th className="px-6 py-4 font-semibold">Email</th>
                                        <th className="px-6 py-4 font-semibold">Phone</th>
                                        <th className="px-6 py-4 font-semibold">Address</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-16 text-slate-400">
                                                Loading customers...
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-16 text-red-500">
                                                {error}
                                            </td>
                                        </tr>
                                    ) : customers.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-16">
                                                <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-2xl mb-4">
                                                    ◉
                                                </div>

                                                <p className="font-semibold text-slate-800">
                                                    No customers found
                                                </p>

                                                <p className="text-sm text-slate-400 mt-1">
                                                    {search.trim()
                                                        ? "Try another search term."
                                                        : "Add your first customer to get started."}
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        customers.map((customer) => {
                                            const customerInitial = customer.name
                                                ?.trim()
                                                .charAt(0)
                                                .toUpperCase() || "?";

                                            return (
                                                <tr
                                                    key={customer._id}
                                                    className="hover:bg-indigo-50/30 transition-colors"
                                                >
                                                    <td className="px-6 sm:px-8 py-5">
                                                        <div className="flex items-center gap-3 min-w-44">
                                                            <div className="w-10 h-10 shrink-0 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                                                {customerInitial}
                                                            </div>

                                                            <span className="font-semibold text-slate-800">
                                                                {customer.name}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5 text-sm text-slate-500">
                                                        {customer.email || "-"}
                                                    </td>

                                                    <td className="px-6 py-5 text-sm text-slate-500 whitespace-nowrap">
                                                        {customer.phone || "-"}
                                                    </td>

                                                    <td className="px-6 py-5 text-sm text-slate-500 min-w-40">
                                                        {customer.address || "-"}
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => setSelectedCustomer(customer)}
                                                                className="px-3 py-2 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                onClick={() => handleDelete(customer._id)}
                                                                className="px-3 py-2 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}

                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        <div className="px-6 sm:px-8 py-4 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-xs text-slate-400">
                                Showing {customers.length} customer{customers.length === 1 ? "" : "s"}
                            </p>

                            <p className="text-xs text-slate-400">
                                ClientFlow CRM
                            </p>
                        </div>

                    </section>

                    <footer className="text-center text-xs text-slate-400 mt-8">
                        ClientFlow · Customer Management Workspace
                    </footer>

                </main>
            </div>

            {/* Add Customer Modal */}
            {showAddModal && (
                <AddCustomerModal
                    onClose={() => setShowAddModal(false)}
                    onCustomerAdded={() => fetchCustomers(search)}
                />
            )}

            {/* Edit Customer Modal */}
            {selectedCustomer && (
                <EditCustomerModal
                    customer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                    onCustomerUpdated={() => fetchCustomers(search)}
                />
            )}

        </div>
    );
};

export default Dashboard;
