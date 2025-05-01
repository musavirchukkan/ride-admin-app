// src/layouts/AuthLayout.jsx
import PropTypes from 'prop-types';
import mountainsBg from '../assets/images/mountains-bg.jpg';

export default function AuthLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            {/* Left side - Background */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-gray-700 to-gray-900">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${mountainsBg})` }} />
            </div>

            {/* Right side - Auth Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                {children}
            </div>
        </div>
    );
}

AuthLayout.propTypes = {
    children: PropTypes.node.isRequired,
};