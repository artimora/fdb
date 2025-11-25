import { useEffect, useState } from "react";

export default function App() {
	const [path, setPath] = useState("/");
	const [folders, setFolders] = useState<any[]>([]);
	const [files, setFiles] = useState<any[]>([]);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [selected, setSelected] = useState<string | null>(null);
	const [previewContent, setPreviewContent] = useState<string | null>(null);

	async function load(p: string) {
		const clean = p.trim() === "" ? "/" : p;
		setPath(clean);
		setSelected(null);
		setPreviewContent(null);

		const foldersRes = await fetch(
			`http://localhost:3000/api/fdb/directory/folders?path=${clean}`,
		);
		const filesRes = await fetch(
			`http://localhost:3000/api/fdb/directory/files?path=${clean}&data=false`,
		);

		if (foldersRes.ok) setFolders(await foldersRes.json());
		if (filesRes.ok) setFiles(await filesRes.json());
	}

	async function openFolder(name: string) {
		const newPath = path.endsWith("/") ? path + name : `${path}/${name}`;
		load(newPath);
	}

	async function previewFile(name: string) {
		setSelected(name);

		const target = path.endsWith("/") ? path + name : `${path}/${name}`;
		const res = await fetch(
			`http://localhost:3000/api/fdb/files/text/read?path=${target}`,
		);

		if (res.ok) {
			setPreviewContent(await res.json());
		} else {
			setPreviewContent("Unable to read file.");
		}
	}

	function goUp() {
		if (path === "/") return;
		const parts = path.split("/").filter(Boolean);
		parts.pop();
		const newPath = "/" + parts.join("/");
		load(newPath === "/" ? "/" : newPath);
	}

	useEffect(() => {
		load("/");
	}, []);

	return (
		<div style={styles.container}>
			{/* SIDEBAR */}
			<div style={styles.sidebar}>
				<h2 style={{ margin: 0 }}>Drive</h2>

				<button style={styles.sideButton} onClick={() => load("/")}>
					My Drive
				</button>
			</div>

			{/* MAIN */}
			<div style={styles.main}>
				{/* Toolbar */}
				<div style={styles.toolbar}>
					<div>{path}</div>

					<div style={{ display: "flex", gap: 10 }}>
						<button onClick={goUp}>Up</button>
						<button onClick={() => setViewMode("list")}>List</button>
						<button onClick={() => setViewMode("grid")}>Grid</button>
					</div>
				</div>

				{/* File Grid/List */}
				<div
					style={
						viewMode === "grid" ? styles.gridContainer : styles.listContainer
					}
				>
					{/* FOLDERS */}
					{folders.map((f) =>
						viewMode === "grid" ? (
							<div
								key={f.uuid}
								style={styles.gridItem}
								onClick={() => openFolder(f.name)}
							>
								<div style={styles.folderIcon}>📁</div>
								<div>{f.name}</div>
							</div>
						) : (
							<div
								key={f.uuid}
								style={styles.listItem}
								onClick={() => openFolder(f.name)}
							>
								📁 {f.name}
							</div>
						),
					)}

					{/* FILES */}
					{files.map((f) =>
						viewMode === "grid" ? (
							<div
								key={f.uuid}
								style={{
									...styles.gridItem,
									border:
										selected === f.name
											? "2px solid #4ea1ff"
											: "1px solid #444",
								}}
								onClick={() => previewFile(f.name)}
							>
								<div style={styles.fileIcon}>📄</div>
								<div>{f.name}</div>
							</div>
						) : (
							<div
								key={f.uuid}
								onClick={() => previewFile(f.name)}
								style={{
									...styles.listItem,
									background: selected === f.name ? "#2a2a2a" : "none",
								}}
							>
								📄 {f.name}
							</div>
						),
					)}
				</div>
			</div>

			{/* PREVIEW PANEL */}
			<div style={styles.preview}>
				<h3>Preview</h3>
				<div style={styles.previewBox}>
					{previewContent ?? "Select a file to preview"}
				</div>
			</div>
		</div>
	);
}

const styles: Record<string, any> = {
	container: {
		display: "flex",
		height: "100vh",
		background: "#111",
		color: "white",
	},
	sidebar: {
		width: 200,
		background: "#1a1a1a",
		padding: 20,
		borderRight: "1px solid #333",
		display: "flex",
		flexDirection: "column",
		gap: 10,
	},
	sideButton: {
		background: "#222",
		border: "1px solid #333",
		padding: "8px 12px",
		color: "white",
		cursor: "pointer",
	},
	main: {
		flex: 1,
		padding: 20,
		display: "flex",
		flexDirection: "column",
	},
	toolbar: {
		display: "flex",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	gridContainer: {
		display: "grid",
		gridTemplateColumns: "repeat(auto-fill, 140px)",
		gap: 16,
	},
	gridItem: {
		background: "#1f1f1f",
		padding: 12,
		borderRadius: 8,
		border: "1px solid #333",
		textAlign: "center",
		cursor: "pointer",
	},
	folderIcon: {
		fontSize: 32,
	},
	fileIcon: {
		fontSize: 32,
	},
	listContainer: {
		display: "flex",
		flexDirection: "column",
		gap: 4,
	},
	listItem: {
		padding: 10,
		borderBottom: "1px solid #333",
		cursor: "pointer",
	},
	preview: {
		width: 300,
		borderLeft: "1px solid #333",
		padding: 20,
		background: "#141414",
	},
	previewBox: {
		whiteSpace: "pre-wrap",
		background: "#1f1f1f",
		padding: 10,
		borderRadius: 6,
		minHeight: 200,
		border: "1px solid #333",
	},
};
