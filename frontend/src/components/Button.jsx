export function Button({label, onClick}) {
    return (
        <button 
            onClick={onClick} 
            type="button" 
            className="w-full px-6 py-3 text-white text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg 
                     hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                     transform transition-all duration-200 hover:scale-[1.02]"
        >
            {label}
        </button>
    )
}
  