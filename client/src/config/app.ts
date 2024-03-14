interface AppConfig {
	name: string;
	github: {
		title: string;
		url: string;
	};
	author: {
		name: string;
		url: string;
	};
}

export const appConfig: AppConfig = {
	name: "client",
	github: {
		title: "client",
		url: "https://github.com/AntonStankov/HackTuesX/client",
	},
	author: {
		name: "bobikenobi12",
		url: "https://github.com/bobikenobi12/",
	},
};
