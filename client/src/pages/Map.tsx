export default function Map() {
	return (
		<div className="bg-gray-200">
			<div className="grid grid-cols-100 grid-rows-40 grid-rows-w gap-0.5">
				{Array.from({ length: 4000 }, (_, index) => (
					<div
						key={index}
						className="bg-white border border-gray-300 w-3 h-3"
					></div>
				))}
			</div>
		</div>
	);
}
