// src/app/(dashboard)/evidence/page.tsx

import EvidenceCollector from "@/components/evidence/evidence-collector";

export default function EvidencePage() {
	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<div className="mb-8">
				<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
					Submit Evidence
				</h1>
				<p className="text-gray-600 mt-2">
					Document and report incidents by submitting evidence below
				</p>
			</div>
			<EvidenceCollector />
		</div>
	);
}
