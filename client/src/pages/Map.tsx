import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// generates a string with a given length an consists of random A-water, B - land, C - mountain
function generateStringWithLength(length: number) {
	const result = [];
	const characters = "ABC";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result.push(
			characters.charAt(Math.floor(Math.random() * charactersLength))
		);
	}
	return result.join("");
}

export default function Map() {
	let map = generateStringWithLength(20000);

	return (
		<TransformWrapper>
			<TransformComponent>
				<div className="grid grid-cols-200 w-[1800px] h-[800px] overflow-hidden relative">
					{map.split("").map((item, idx) => (
						<div
							key={idx}
							className={`h-2 w-2 outline outline-gray-300 dark:outline-gray-700 ${
								item === "A"
									? "bg-blue-500"
									: item === "B"
									? "bg-green-500"
									: "bg-yellow-500"
							}`}
						></div>
					))}
				</div>
			</TransformComponent>
		</TransformWrapper>
	);
}
