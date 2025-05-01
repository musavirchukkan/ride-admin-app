// src/components/ui/Icon.jsx
import PropTypes from 'prop-types';
import {
    FileText,
    Wallet,
    BarChart2,
    Users,
    Car,
    Clock,
    Map,
    Layers,
    Settings,
    ShieldCheck,
    GitBranch,
    Package,
    AlertCircle,
    CheckCircle,
    XCircle,
    HelpCircle,
    Truck,
    DollarSign,
    CreditCard,
    Calendar
} from 'lucide-react';

export default function Icon({ name, size = 'md', className = '' }) {
    // Size mapping
    const sizeMap = {
        'xs': 16,
        'sm': 18,
        'md': 20,
        'lg': 24,
        'xl': 32,
    };

    // Icon mapping
    const iconMap = {
        // UI Icons
        'file': FileText,
        'document': FileText,
        'wallet': Wallet,
        'chart': BarChart2,
        'users': Users,
        'car': Car,
        'clock': Clock,
        'map': Map,
        'layers': Layers,
        'settings': Settings,
        'shield': ShieldCheck,
        'branch': GitBranch,
        'package': Package,

        // Status Icons
        'error': AlertCircle,
        'success': CheckCircle,
        'warning': AlertCircle,
        'info': HelpCircle,
        'cancel': XCircle,

        // Business Logic Icons
        'order': Package,
        'delivery': Truck,
        'payment': DollarSign,
        'card': CreditCard,
        'schedule': Calendar,
    };

    const IconComponent = iconMap[name] || FileText;
    const iconSize = typeof size === 'number' ? size : sizeMap[size] || 24;

    return <IconComponent size={iconSize} className={className} />;
}

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.oneOfType([
        PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
        PropTypes.number
    ]),
    className: PropTypes.string,
};