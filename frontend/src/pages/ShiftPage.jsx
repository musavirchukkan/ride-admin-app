
// src/pages/ShiftPage.jsx
import DashboardLayout from '../layouts/DashboardLayout';

export default function ShiftPage() {
    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Shift Management</h1>
            </div>
            <div className="bg-white p-8 rounded-lg shadow text-center">
                <h2 className="text-xl font-medium mb-4">Shift Scheduling</h2>
                <p className="text-gray-600">This section will contain the shift scheduling interface.</p>
            </div>
        </DashboardLayout>
    );
}
