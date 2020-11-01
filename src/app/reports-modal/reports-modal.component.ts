import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { HttpService } from "../services/http.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TreeNode } from "primeng/api";
import { GlobalConfig } from "../global";
import { ErrorHandlerService } from "../services/error-handler.service";
import { FormatGridService } from "../services/format-grid.service";
// import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';


@Component({
	selector: "app-reports-modal-content",
	templateUrl: "./reports-modal-content.component.html",
	styleUrls: ["./reports-modal-content.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class ReportsModalContentComponent {
	private BASE_API_URL = GlobalConfig.BASE_API_URL;
	sliceId: any;
	slicePeriod: any;
	reportGroups: any;

	colsDep: any[];
	colsReg: any[];
	colsGovs: any[];

	selectedGroupCode: any;
	gridData = {
		deps: [] as any,
		regs: [] as any,
		orgz: [] as any
	};
	childrenNode: TreeNode[];

	requestedReports = { deps: [], regs: [], orgz: [] };
	selectedReportsList: any = [];
	selectedReportsQuery: any = [];
	readyReports: any = [];
	selectAllStatus = { deps: [], regs: [], orgz: [] };
	reportLangs = {
		ru: {
			name: "Русский",
			langCode: "ru",
			isSelected: true,
			isInterfaceLang: false,
		},
		kz: {
			name: "Казахский",
			langCode: "kz",
			isSelected: false,
			isInterfaceLang: false,
		},
	};
	readyReportsParts = 0;
	sliceSize = 2;
	isReportsSelected = false;
	isReportsSelectedDeps = false;
	tabIndex = 0;
	contentLoading = false;
	loadingOrgz: boolean;

	isReportsLoading: boolean;
	groupCode: any;
	isGroupGov = false;

	isReportOrgz = false;
	hierarchyReportCode: any;

	gridScrollHeight = "400px";
	regionTableIndent = 12;
	hideColsDepTable: boolean;
	departments: any;
	startWith0ReportCodeRegs: boolean;
	startWith0ReportCodeDeps: boolean;
	regionsTabIndex: any;
	subscription: Subscription;
	enableGetReportBtn: string;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private http: HttpService,
		private formatGridService: FormatGridService,
		public errorHandler: ErrorHandlerService) { }

	ngOnInit() {
		this.enableGetReportBtn = this.data.permissionReport
		this.contentLoading = true;
		this.sliceId = this.data.sliceId;
		this.slicePeriod = this.data.slicePeriod;
		this.groupCode = this.data.groupCode;

		// Condition 4 reports modal has 1 table 
		if (
			this.groupCode == GlobalConfig.REPORT_GROUPS.ERSOP ||
			this.groupCode == GlobalConfig.REPORT_GROUPS.ADMIN_VIOLATIONS ||
			this.groupCode == GlobalConfig.REPORT_GROUPS.COURT_REPORTS ||
			this.groupCode == GlobalConfig.REPORT_GROUPS.PROKURATURA ||
			this.groupCode == GlobalConfig.REPORT_GROUPS.PROSECUTORS_WORK ||
			this.groupCode == GlobalConfig.REPORT_GROUPS.CIVIL_CASES ||
			this.groupCode == GlobalConfig.REPORT_GROUPS.KISA ||
			this.groupCode == GlobalConfig.REPORT_GROUPS.GPS_CORRUPTION ||
			this.groupCode == GlobalConfig.REPORT_GROUPS.F8 ||
			this.groupCode == GlobalConfig.REPORT_GROUPS.GP_F7 ||
			this.groupCode == GlobalConfig.REPORT_GROUPS.KUI ||
			this.groupCode == GlobalConfig.REPORT_GROUPS.UGOLOV_PRESLED
		) {
			this.isGroupGov = true;
		}


		this.colsDep = [
			{ field: "code", header: "И/н", width: "90px" },
			{ field: "name", header: "Ведомство", width: "auto" },
		];

		this.colsReg = [
			{ field: "code", header: "И/н", width: "110px" },
			{ field: "name", header: "Регион/Орган", width: "auto" },
		];

		this.colsGovs = [
			{ field: "searchPattern", header: "Код органа", width: "180px" },
			{ field: "name", header: "Наименование", width: "auto" },
		]

		// Get reports list by slice id to genereate tabs
		this.http.getReportsBySliceId(this.sliceId).subscribe(
			reportGroups => {
				this.reportGroups = reportGroups;
				this.reportGroups.forEach(element => {
					if (
						element.code == '800' || element.code == '801' ||
						element.code == '510' || element.code == '511' ||
						element.code == '050' || element.code == '720' || // группа отчетов Ф.2 прокурорский
						element.code == '707' || element.code == '708' || element.code == '710' ||
						element.code == '514' || element.code == '516' || element.code == '519' || // КУИ и 1E
						element.code == '515' || element.code == '518' || // Группа отчетов о работе прокурора
						element.code == '700' || element.code == '701' || element.code == '702' || element.code == '703' || // Гражданские дела ВС
						element.code == '810' // KISA 
					) {
						this.isReportOrgz = true;
					} else {
						this.isReportOrgz = false;
					}
				});
				if (this.isGroupGov) {
					this.generateGridOrgz();
				}
				else {
					// Get regions grid data
					this.http.getRegions().subscribe(
						regionsTree => {
							let regionsTreeFormatted = this.formatGridService.formatGridData([regionsTree], true);
							regionsTreeFormatted[0]["expanded"] = true; // Раскрываем первую ветку по умолчанию

							this.reportGroups.forEach(element => {
								let reportCode = element.code;
								// Get department grid data
								this.http.getDepsByReportId(reportCode).subscribe(departments => {
									this.departments = departments
									this.gridData.deps[reportCode] = this.formatGridService.formatGridData(departments, false);
									if (this.departments[0].code == '03') {
										this.requestedReports.deps[reportCode] = this.departments
										this.isReportsSelectedDeps = true;
									} else {
										this.requestedReports.deps[reportCode] = [];
									}
								},
									error => {
										this.errorHandler.alertError(error);
									},
									() => {
										this.contentLoading = false;
									}
								);
								// Assign regions to grid
								this.gridData.regs[reportCode] = regionsTreeFormatted;
								this.requestedReports.regs[reportCode] = [];
							});
						},
						error => {
							this.errorHandler.alertError(error);
						}
					);
				}
			},
			error => {
				this.errorHandler.alertError(error);
			}
		);
	}


	generateGridOrgz() {
		this.reportGroups.forEach(reportGroup => {
			console.log(reportGroup)
			let groupCode = reportGroup.code;
			if (groupCode == '800' || groupCode == '801') {
				this.hierarchyReportCode = GlobalConfig.HIERARCHY_REPORTS.GROUP_001;
			} else if (groupCode == '050') {
				this.hierarchyReportCode = GlobalConfig.HIERARCHY_REPORTS.GROUP_003
			} else if (groupCode == '810') {
				this.hierarchyReportCode = GlobalConfig.HIERARCHY_REPORTS.GROUP_004
			} else {
				this.hierarchyReportCode = GlobalConfig.HIERARCHY_REPORTS.GROUP_002
			}


			this.http.getGroups4DialogTable(this.hierarchyReportCode, groupCode).subscribe(
				data => {
					this.gridData.orgz[groupCode] = this.formatGridService.formatGridData(data, true, true);
					this.requestedReports.orgz[groupCode] = [];
				},
				error => {
					this.errorHandler.alertError(error);
				},
				() => {
					this.contentLoading = false;
				}
			);
		});
	}

	onNodeExpandGroupOrgz(event, groupCode) {
		let node = event.node;
		if (!Object.entries(node.children[0].data).length && node.children[0].data.constructor === Object) {
			this.loadingOrgz = true;
			const searchPattern = node.data.searchPattern;
			if (groupCode == '800' || groupCode == '801') {
				this.hierarchyReportCode = GlobalConfig.HIERARCHY_REPORTS.GROUP_001;
			} else if (groupCode == '050') {
				this.hierarchyReportCode = GlobalConfig.HIERARCHY_REPORTS.GROUP_003
			} else if (groupCode == '810') {
				this.hierarchyReportCode = GlobalConfig.HIERARCHY_REPORTS.GROUP_004
			} else {
				this.hierarchyReportCode = GlobalConfig.HIERARCHY_REPORTS.GROUP_002
			}

			this.http.getGroupsChildren4DialogTable(searchPattern, this.hierarchyReportCode).then(
				data => {
					event.node.children = this.formatGridService.formatGridData(data, false);
					this.gridData.orgz[groupCode] = [...this.gridData.orgz[groupCode]]; //refresh the data
					this.loadingOrgz = false;
				},
				error => {
					this.errorHandler.alertError(error);
				}
			);
		}
	}

	getReportInfoByCode(groupCode): any {
		if (this.reportGroups != undefined && this.reportGroups) {
			return this.reportGroups.find(item => item.code == groupCode);
		}
	}

	tabChange(index: number) {
		this.tabIndex = index; // current tab index, used in openFirstTab()
		if (this.tabIndex != 0) {
			this.selectedGroupCode = this.reportGroups[this.tabIndex - 1].code;
		} else {
			if (this.isReportsSelectedFn()) {
				this.generateSelectedReportsList();
			}
		}
	}

	onChangeCheckboxStatus(event, groupCode, selectAllStatus) {
		// Calls after every checkbox change. Check for matching regions and deps, or selected ERSOP
		// Returns true if selections ready for report generating
		this.isReportsSelectedFn() ? (this.isReportsSelected = true) : (this.isReportsSelected = false);

		// Check select all checkbox status
		if (selectAllStatus[groupCode] && !event) {
			selectAllStatus[groupCode] = false;
		}
	}

	selectAllRows(groupCode, requestedReports, gridData, selectAllStatus): void {
		// Clear selected reports list
		requestedReports[groupCode].length = 0;
		// Check status of SelectAll checkbox of current group. True means Select all from this group
		if (selectAllStatus[groupCode]) {
			this.pushSelectedAllRows(groupCode, gridData[groupCode], requestedReports);
		}
		// Update grid data and selected reports list
		gridData = [...gridData];
		requestedReports[groupCode] = [...requestedReports[groupCode]];
	}

	pushSelectedAllRows(groupCode, gridData, requestedReports) {
		gridData.forEach(rowNode => {
			if (rowNode.data && Object.keys(rowNode.data).length === 0) {
				return null;
			}
			if (!rowNode.children) {
				requestedReports[groupCode].push(rowNode.data);
			} else {
				requestedReports[groupCode].push(rowNode.data);
				this.pushSelectedAllRows(groupCode, rowNode.children, requestedReports);
			}
		});
	}

	isReportsSelectedFn(): boolean {
		// console.log(this.requestedReports.regs[this.selectedGroupCode])
		// console.log(this.requestedReports.deps[this.selectedGroupCode])

		if (
			(this.requestedReports.regs[this.selectedGroupCode] !== undefined &&
				this.requestedReports.regs[this.selectedGroupCode].length !== 0 &&
				this.requestedReports.deps[this.selectedGroupCode] !== undefined &&
				this.requestedReports.deps[this.selectedGroupCode].length !== 0) ||

			(this.requestedReports.orgz[this.selectedGroupCode] !== undefined && this.requestedReports.orgz[this.selectedGroupCode] !== 0)
		) {
			return true;
		}
		return false;
	}

	generateSelectedReportsList() {
		let counter = 0;
		this.selectedReportsList = [];

		if (this.isGroupGov) {
			let reportInfo = this.getReportInfoByCode(this.selectedGroupCode);
			this.requestedReports.orgz[this.selectedGroupCode].forEach(element => {
				this.selectedReportsList[counter] = {
					report: reportInfo,
					region: element,
				};
				this.selectedReportsQuery[counter] = {
					sliceId: this.sliceId,
					reportCode: this.selectedGroupCode,
					govCode: element.searchPattern,
				};
				counter++;
			});
		} else {
			this.readyReportsParts = 0;
			// Check report Code for start with 0 or not. Example: 060, 510 etc..
			console.log(this.requestedReports.regs)
			for (const [key, value] of Object.entries(this.requestedReports.regs)) {
				// console.log('key' + key)
				this.startWith0ReportCodeRegs = key.startsWith("0"); // search for report code starts with 0
				if (this.startWith0ReportCodeRegs) { // if true
					this.removeLeadingZeroFromStringRegs() // 060 = 60
				}
			}
			// console.log(this.requestedReports.regs)
			this.requestedReports.regs.forEach((element, index) => {
				// console.log(element)
				if (this.startWith0ReportCodeRegs) {
					let strIndex = '0' + index;
					this.regionsTabIndex = strIndex
				} else {
					this.regionsTabIndex = index
				}
				let reportInfo = this.getReportInfoByCode(this.regionsTabIndex);
				// eslint-disable-next-line @typescript-eslint/no-this-alias
				let self = this;
				element.forEach(region => {
					// console.log(this.requestedReports.deps[this.regionsTabIndex])
					if (this.requestedReports.deps[this.regionsTabIndex] != undefined) {
						this.requestedReports.deps[this.regionsTabIndex].forEach(depElemen => {
							// console.log(depElemen);
							self.selectedReportsList[counter] = {
								report: reportInfo,
								region: region,
								department: depElemen,
							};
							self.selectedReportsQuery[counter] = {
								sliceId: self.sliceId,
								reportCode: reportInfo.code,
								orgCode: depElemen.code,
								regCode: region.code,
							};
							counter++;
						});
					}

				});
			});
		}
	}

	removeLeadingZeroFromStringRegs() {
		let newKey;
		let oldKey;
		for (const [key, value] of Object.entries(this.requestedReports.regs)) {
			// console.log(key, value)
			if (key.charAt(0) === '0') {
				oldKey = key;
				newKey = oldKey.substring(1);
				this.requestedReports.regs[newKey] = this.requestedReports.regs[oldKey];
				delete this.requestedReports.regs[oldKey];
			}
		}
		console.log(this.requestedReports.regs)
	}

	removeSelectedReport = function (index, selectedReport) {
		this.selectedReportsList.splice(index, 1);
		this.selectedReportsQuery.splice(index, 1);
		let groupCode = selectedReport.report.code;


		if (this.isGroupGov) {
			let row = selectedReport.region;
			this.requestedReports.orgz[groupCode].splice(this.requestedReports.orgz[groupCode].indexOf(row), 1);
			this.gridData.orgz[groupCode] = [...this.gridData.orgz[groupCode]];
			this.requestedReports.orgz[groupCode] = [...this.requestedReports.orgz[groupCode]];
		}
		else {
			let regionCode = selectedReport.region.code,
				departmentCode = selectedReport.department.code;

			if (this.selectedReportsQuery.findIndex(x => x.orgCode === departmentCode) === -1) {
				this.requestedReports.deps[groupCode].splice(this.requestedReports.deps[groupCode].indexOf(departmentCode), 1);
				this.gridData.deps[groupCode].splice(this.gridData.deps[groupCode].indexOf(departmentCode), 1);

				this.requestedReports.deps[groupCode] = [...this.requestedReports.deps[groupCode]];
			}

			if (this.selectedReportsQuery.findIndex(x => x.regCode === regionCode) === -1) {
				this.requestedReports.regs[groupCode].splice(this.requestedReports.regs[groupCode].indexOf(regionCode), 1);
				this.gridData.regs[groupCode].splice(this.gridData.regs[groupCode].indexOf(regionCode), 1);

				this.requestedReports.regs[groupCode] = [...this.requestedReports.regs[groupCode]];
			}
		}

		if (this.selectedReportsList.length === 0) this.isReportsSelected = false;
	};

	getReports() {
		this.openFirstTab();
		let cntr = 0;
		this.readyReportsParts = 0;
		this.readyReports = [];
		this.isReportsLoading = true;
		setTimeout(() => {
			this.getReportSplices(cntr);
		}, 0);
	}

	getReportSplices(counterFrom) {
		let reportsSlice,
			counterFromIn = counterFrom,
			selectedLang = this.checkLang();
		if (this.selectedReportsQuery != undefined && this.selectedReportsQuery.length > 0) {
			reportsSlice = this.selectedReportsQuery.splice(0, this.sliceSize);
			// console.log(reportsSlice)
			this.generateReports(reportsSlice, selectedLang, counterFromIn);
		} else {
			this.isReportsLoading = false;
		}
	}

	generateReports(reportsSlice: any, selectedLang, counterFrom) {
		if (reportsSlice.length === 0) {
			return false;
		} else {
			// console.log(reportsSlice)
			this.http.generateReports(selectedLang, reportsSlice).subscribe(
				data => {
					this.showReports(data);
					counterFrom += 2;
					this.getReportSplices(counterFrom);
				},
				error => {
					this.errorHandler.alertError(error);
				}
			);
		}
	}

	showReports(data) {
		this.readyReportsParts += data.length;
		this.isReportsLoading = false;

		let reportValues = data,
			reportDownloadUrl = "",
			reportDownloadName = "",
			errMsgMissing = "Отсутствует шаблон отчета",
			errMsg = "Ошибка при формировании данного отчета";

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let self = this;
		reportValues.forEach(function (element) {
			if (element.value == -1) {
				reportDownloadUrl = "#";
				reportDownloadName = errMsgMissing;
			} else if (element.value == -2) {
				reportDownloadUrl = "#";
				reportDownloadName = errMsg;
			} else {
				console.log('1aaaaaaaaaaaaaaaaa')
				console.log(element)
				reportDownloadUrl = self.BASE_API_URL + element.lang + "/slices/reports/" + element.value + "/download";
				reportDownloadName = self.generateReportName(element);
			}

			let readyReportItem = {
				url: reportDownloadUrl,
				name: reportDownloadName,
			};
			self.readyReports.push(readyReportItem);
		});
	}

	generateReportName(element) {
		console.log(element)
		let delimiter = " - ",
			reportName,
			regionName,
			departmentName,
			groupCode = element.reportCode,
			orgCode = element.orgCode,
			regCode = element.regCode,
			govCode = element.govCode,
			langPostfix = "";

		console.log(groupCode)
		if (element.lang !== "RU") {
			langPostfix = delimiter + "[" + element.lang + "]";
		}

		let reportInfo = this.getReportInfoByCode(groupCode);
		reportInfo !== undefined ? (reportName = reportInfo.name + delimiter) : (reportName = "");

		if (this.isGroupGov) {
			let commonIndex = this.requestedReports.orgz[groupCode].findIndex(x => x.searchPattern === govCode);
			commonIndex !== -1 ? (regionName = this.requestedReports.orgz[groupCode][commonIndex].name) : (regionName = "");
			departmentName = "";
		}
		else {
			console.log('aaaa')
			// console.log('regs' + this.requestedReports.regs[groupCode])
			// console.log('deps' + this.requestedReports.deps[groupCode])

			this.requestedReports.regs.forEach((element, key) => {
				// console.log(element, key)
				let regIndex = this.requestedReports.regs[key].findIndex(x => x.code === regCode);
				console.log(regIndex)
				regIndex !== -1 ? (regionName = this.requestedReports.regs[key][regIndex].name) : (regionName = "");

				let depIndex = this.requestedReports.deps[groupCode].findIndex(x => x.code === orgCode);
				depIndex !== -1
					? (departmentName = delimiter + this.requestedReports.deps[groupCode][depIndex].name)
					: (departmentName = "");

			})

			this.requestedReports.deps.forEach((element, key) => {
				// console.log(element, key)
				let regIndex = this.requestedReports.regs[groupCode].findIndex(x => x.code === regCode);
				console.log(regIndex)
				regIndex !== -1 ? (regionName = this.requestedReports.regs[groupCode][regIndex].name) : (regionName = "");

				let depIndex = this.requestedReports.deps[groupCode].findIndex(x => x.code === orgCode);
				depIndex !== -1
					? (departmentName = delimiter + this.requestedReports.deps[groupCode][depIndex].name)
					: (departmentName = "");
			})
		}
		return reportName + regionName + departmentName + langPostfix;
	}

	checkLang() {
		let selectedLang = "";

		if (this.reportLangs.ru.isSelected === false && this.reportLangs.kz.isSelected === false) {
			alert("Выберите язык отчета");
			this.isReportsLoading = false;
			return false;
		}

		if (this.reportLangs.ru.isSelected === true && this.reportLangs.kz.isSelected === true) {
			selectedLang = "all";
		} else if (this.reportLangs.kz.isSelected === true) {
			selectedLang = "kz";
		} else if (this.reportLangs.ru.isSelected === true) {
			selectedLang = "ru";
		}

		return selectedLang;
	}

	openFirstTab() {
		this.tabIndex = 0;
	}

	redirectSystemToShowReport(item) {
		let reportId = item.report.code;
		let regionCode = item.region.code;
		let dvedomostv = item.department.code;
		let sliceId = this.sliceId;

		console.log(reportId, regionCode, dvedomostv, sliceId)
		window.open('http://192.168.210.180/?reportId=' + reportId + '&regionCode=' + regionCode + '&dvedomostv=' + dvedomostv + '&sliceId=' + sliceId)
	}
}
