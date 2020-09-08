/* eslint-disable prettier/prettier */
export const GlobalConfig = Object.freeze({
	// BASE_API_URL: "http://192.168.210.10:8081/api/v1/",
	BASE_API_URL: "https://analytic-center.tk:8081/api/v1/",
	// SOCKET_URL: "http://192.168.210.10:8081", // IP PROD,
	SOCKET_URL: "https://18.140.232.52:8081", // IP TEST
	BASE_AUTH_USER: "user0",
	STATUS_CODES: {
		IN_PROCESSING: "0", // В обработке
		APPROVED: "1", // Утвержден
		PRELIMINARY: "2", // Предварительный
		DELETED: "3", // Удален
		CANCELED_BY_USER: "4", // Отменен пользователем
		FORMED_WITH_ERROR: "5", // Сформирован с ошибкой
		WAITING_FOR_PROCESSING: "6", // В ожидании обработки
		IN_AGREEMENT: "7", // На согласовании
	},
	HIERARCHY_REPORTS: {
		FOR_ERSOP: 0o1,
		FOR_ANOTHER_ORGANIZATIONS: 0o2,
	},
	REPORT_GROUPS: {
		ERSOP: 100,
		COURT_REPORTS: 0o4,
		ADMIN_VIOLATIONS: 0o6
	}
});
