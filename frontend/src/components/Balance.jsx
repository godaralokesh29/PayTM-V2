export const Balance = ({ value }) => {
    return (
        <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Your Balance</h2>
            <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                    ₹{value?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0.00'}
                </span>
            </div>
        </div>
    );
};