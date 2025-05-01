// src/components/ui/Avatar.jsx
import PropTypes from 'prop-types';
import { UserRound } from 'lucide-react';

export default function Avatar({ src, alt, size = 'md', status }) {
    // Size mapping
    const sizeMap = {
        'xs': 'h-6 w-6 text-xs',
        'sm': 'h-8 w-8 text-sm',
        'md': 'h-10 w-10 text-base',
        'lg': 'h-12 w-12 text-lg',
        'xl': 'h-16 w-16 text-xl',
    };

    // Status indicator styles
    const statusMap = {
        'online': 'bg-green-500',
        'offline': 'bg-gray-400',
        'busy': 'bg-red-500',
        'away': 'bg-yellow-500',
    };

    return (
        <div className="relative">
            <div className={`${sizeMap[size]} rounded-full overflow-hidden bg-gray-100 flex items-center justify-center`}>
                {src ? (
                    <img
                        src={src}
                        alt={alt || 'Avatar'}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            // Replace with a placeholder icon on error
                            e.target.style.display = 'none';
                            e.target.parentElement.classList.add('bg-gray-200');
                        }}
                    />
                ) : (
                    <UserRound className="h-1/2 w-1/2 text-gray-400" />
                )}
            </div>

            {status && (
                <span
                    className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${statusMap[status] || 'bg-gray-400'}`}
                />
            )}
        </div>
    );
}

Avatar.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    status: PropTypes.oneOf(['online', 'offline', 'busy', 'away']),
};