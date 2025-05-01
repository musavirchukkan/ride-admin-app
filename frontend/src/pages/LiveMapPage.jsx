
// src/pages/LiveMapPage.jsx
import DashboardLayout from '../layouts/DashboardLayout';

export default function LiveMapPage() {
    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Live Map</h1>
            </div>
            <div className="bg-white p-8 rounded-lg shadow text-center">
                <h2 className="text-xl font-medium mb-4">Real-time Driver Tracking</h2>
                <p className="text-gray-600">This section will contain the live map interface for tracking drivers in real-time.</p>
            </div>
        </DashboardLayout>
    );
}
