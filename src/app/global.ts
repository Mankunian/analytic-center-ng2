/* eslint-disable prettier/prettier */
let hostname = window.location.hostname
sessionStorage.setItem('hostname', hostname);
let ADM_PAGE = '';
if (hostname === 'localhost') {
	ADM_PAGE = 'http://localhost:4200';
}
else if (hostname.startsWith("10")) {
	ADM_PAGE = 'http://10.2.30.69';
}
else if (hostname.startsWith("192")) {
	ADM_PAGE = 'http://192.168.210.69';
}
else if (hostname.startsWith("master")) {
	ADM_PAGE = 'https://master.d260huhvcvtk4w.amplifyapp.com'
}

const SLICES_PROD_URL = window.location.protocol.toString() + "//" + hostname.toString() + ":8081";
const SLICES_TEST_URL = "https://18.140.232.52:8081";
const ADM_PROD_URL = hostname.startsWith("10") ? 'http://10.2.30.69:8084' : 'http://192.168.210.69:8084';
const ADM_TEST_URL = 'https://18.138.17.74:8084';


export const GlobalConfig = Object.freeze({

	// localhost
	// BASE_API_URL: SLICES_TEST_URL + '/api/v1/',
	// SOCKET_URL: SLICES_TEST_URL,
	// ADM_URL: ADM_TEST_URL,
	// ADMIN_PAGE: ADM_PAGE,

	// amazon
	BASE_API_URL: SLICES_TEST_URL + '/api/v1/',
	SOCKET_URL: SLICES_TEST_URL,
	ADM_URL: ADM_TEST_URL,
	ADMIN_PAGE: ADM_PAGE,

	//	production
	// BASE_API_URL: SLICES_PROD_URL + '/api/v1/',
	// SOCKET_URL: SLICES_PROD_URL,
	// ADM_URL: ADM_PROD_URL,
	// ADMIN_PAGE: ADM_PAGE,


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
		GROUP_001: 0o1,
		GROUP_002: 0o2,
		GROUP_003: 0o3,
		GROUP_004: 0o4,
		GROUP_005: 0o5
	},
	REPORT_GROUPS: {
		UGOLOV_PRESLED: 0o2,
		PROSECUTORS_WORK: 0o3,
		COURT_REPORTS: 0o4,
		KUI: 0o5,
		ADMIN_VIOLATIONS: 0o6,
		ERSOP: 100,
		KISA: 101,
		PROKURATURA: 102,
		CIVIL_CASES: 103,
		GPS_CORRUPTION: 104,
		F8: 105,
		GP_F7: 106,
		ROZYSK: 110,
		OM_SU: 112,
		GPS_F5: 115,
		VS_ADMIN_DELA: 118,
		VS_UGOLOV_DELA: 120,
		OL: 125
	}
});
