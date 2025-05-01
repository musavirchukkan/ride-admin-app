// src/components/dashboard/StatCard.jsx
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Icon from '../ui/Icon';

export default function StatCard({ title, icon, iconBgColor, iconColor, linkTo, value }) {
    return (
        <Link
            to={linkTo}
            className="flex items-center justify-between p-5 bg-white rounded-lg shadow-sm hover:shadow transition-all"
        >
            <div className="flex items-center">
                <div className={`p-3 rounded-md ${iconBgColor}`}>
                    <Icon name={icon} size="sm" className={iconColor} />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                    {value && (
                        <p className="text-base font-semibold mt-1">{value}</p>
                    )}
                </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
        </Link>
    );
}

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    iconBgColor: PropTypes.string.isRequired,
    iconColor: PropTypes.string.isRequired,
    linkTo: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
};

StatCard.defaultProps = {
    value: null
};