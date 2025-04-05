export function InputBox({label, placeholder, onChange, type = "text"}) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input 
                type={type}
                onChange={onChange} 
                placeholder={placeholder} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-200 placeholder-gray-400 text-gray-900"
            />
        </div>
    )
}