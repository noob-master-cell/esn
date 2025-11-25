import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminRegistrations, useMarkAttendance, useUpdateRegistration } from '../../../hooks/api/useAdmin';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { Icon } from '../../../components/common/Icon';

export const AdminAttendancePage: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const { registrations, loading, error, refetch } = useAdminRegistrations({
        filter: {
            eventId,
            take: 1000, // Fetch all for attendance list
        },
    });

    const { markAttendance } = useMarkAttendance();
    const { updateRegistration } = useUpdateRegistration();

    const handleAttendanceToggle = async (registrationId: string, currentStatus: string) => {
        const isAttended = currentStatus === 'ATTENDED';
        try {
            await markAttendance({
                variables: {
                    registrationId,
                    attended: !isAttended,
                },
            });
            refetch();
        } catch (err) {
            console.error('Error marking attendance:', err);
            alert('Failed to update attendance. ' + (err as Error).message);
        }
    };

    const handlePaymentToggle = async (registrationId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
        try {
            await updateRegistration({
                variables: {
                    input: {
                        id: registrationId,
                        paymentStatus: newStatus,
                    },
                },
            });
            refetch();
        } catch (err) {
            console.error('Error updating payment:', err);
            alert('Failed to update payment. ' + (err as Error).message);
        }
    };

    const filteredRegistrations = registrations?.filter((reg: any) => {
        const firstName = reg.user?.firstName || '';
        const lastName = reg.user?.lastName || '';
        const fullName = `${firstName} ${lastName}`.toLowerCase();
        const email = (reg.user?.email || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        const matchesSearch = fullName.includes(search) || email.includes(search);

        let matchesStatus = true;
        if (statusFilter !== 'ALL') {
            matchesStatus = reg.status === statusFilter;
        } else {
            // By default show all except cancelled
            matchesStatus = reg.status !== 'CANCELLED';
        }

        return matchesSearch && matchesStatus;
    });

    const event = registrations?.[0]?.event;
    const attendedCount = registrations?.filter((r: any) => r.status === 'ATTENDED').length || 0;
    const totalCount = registrations?.length || 0;

    if (loading) return <div className="p-8 text-center">Loading attendance list...</div>;
    if (error) return <div className="p-8 text-center text-red-600">Error: {error.message}</div>;

    return (
        <AdminLayout
            title="Event Attendance"
            subtitle={event ? `${event.title} • ${new Date(event.startDate).toLocaleDateString()}` : 'Loading...'}
            actions={
                <button
                    onClick={() => navigate('/admin/registrations')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    <Icon name="chevron-left" size="sm" />
                    Back to Registrations
                </button>
            }
        >
            <div className="space-y-6">
                {/* Stats & Search */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
                            <div className="text-xs text-gray-500 uppercase font-semibold">Total Confirmed</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{attendedCount}</div>
                            <div className="text-xs text-gray-500 uppercase font-semibold">Checked In</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-400">{totalCount - attendedCount}</div>
                            <div className="text-xs text-gray-500 uppercase font-semibold">Remaining</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PENDING">Pending</option>
                            <option value="ATTENDED">Attended</option>
                            <option value="NO_SHOW">No Show</option>
                        </select>
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search attendee..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            />
                            <div className="absolute left-3 top-2.5 text-gray-400">
                                <Icon name="search" size="sm" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRegistrations?.map((reg: any) => (
                                <tr key={reg.id} className={`hover:bg-gray-50 transition-colors ${reg.status === 'ATTENDED' ? 'bg-green-50/30' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                {reg.user.avatar ? (
                                                    <img className="h-10 w-10 rounded-full object-cover" src={reg.user.avatar} alt="" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                                        {(reg.user?.firstName || '?').charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{reg.user?.firstName || 'Unknown'} {reg.user?.lastName || ''}</div>
                                                <div className="text-sm text-gray-500">{reg.user?.email || 'No email'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {reg.registrationType}
                                        </span>
                                        {reg.amountDue > 0 && (
                                            <div className="text-xs text-gray-500 mt-1">€{reg.amountDue}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {reg.amountDue > 0 ? (
                                            <button
                                                onClick={() => handlePaymentToggle(reg.id, reg.paymentStatus)}
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors ${reg.paymentStatus === 'COMPLETED'
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                    }`}
                                            >
                                                {reg.paymentStatus === 'COMPLETED' ? 'Paid' : 'Pending'}
                                            </button>
                                        ) : (
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                                                Free
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {reg.status === 'ATTENDED' ? (
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Attended
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                Not Checked In
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleAttendanceToggle(reg.id, reg.status)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${reg.status === 'ATTENDED'
                                                ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                : 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm'
                                                }`}
                                        >
                                            {reg.status === 'ATTENDED' ? 'Undo Check-in' : 'Check In'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredRegistrations?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No attendees found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};
