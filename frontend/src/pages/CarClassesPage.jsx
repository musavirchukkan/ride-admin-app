
// src/pages/CarClassesPage.jsx
import DashboardLayout from '../layouts/DashboardLayout';

export default function CarClassesPage() {
    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Car Classes</h1>
            </div>
            <div className="bg-white p-8 rounded-lg shadow text-center">
                <h2 className="text-xl font-medium mb-4">Vehicle Classification</h2>
                <p className="text-gray-600">This section will contain the car class management interface.</p>
            </div>
        </DashboardLayout>
    );
}
