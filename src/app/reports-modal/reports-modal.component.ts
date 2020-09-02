import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { HttpService } from "../services/http.service";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TreeNode } from "primeng/api";
import { GlobalConfig } from "../global";
import { ErrorHandlerService } from "../services/error-handler.service";
import { FormatGridService } from "../services/format-grid.service";

@Component({
	selector: "app-reports-modal",
	templateUrl: "./reports-modal.component.html",
	styleUrls: ["./reports-modal.component.scss"],
})
export class ReportsModalComponent {
	constructor(public dialog: MatDialog, private http: HttpService) { }
}

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
	colsERSOP: any[];
	colsCourtReport: any[];
	selectedGroupCode: any;
	gridData = { deps: [] as any, regs: [] as any, ersop: [] as any, courtReport: [] as any };
	childrenNode: TreeNode[];

	requestedReports = { deps: [], regs: [], ersop: [], courtReport: [] };
	selectedReportsList: any = [];
	selectedReportsQuery: any = [];
	readyReports: any = [];
	selectAllStatus = { deps: [], regs: [], ersop: [], courtReport: [] };
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
	tabIndex = 0;
	contentLoading = false;
	loadingERSOP: boolean;
	loadingCourtReport: boolean;
	isReportsLoading: boolean;
	groupCode: any;
	isGroupERSOP = false; // Группа отчетов ЕРСОП
	isGroupCourtReport = false; // Группа отчетов о работе суда
	isReport1P = false;
	isReportForm10 = false;
	gridScrollHeight = "400px";
	regionTableIndent = 12;
	hideColsDepTable: boolean;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private http: HttpService,
		private formatGridService: FormatGridService,
		public errorHandler: ErrorHandlerService
	) { }

	ngOnInit() {
		this.contentLoading = true;
		this.sliceId = this.data.sliceId;
		this.slicePeriod = this.data.slicePeriod;
		this.groupCode = this.data.groupCode;

		if (this.groupCode == GlobalConfig.REPORT_GROUPS.ERSOP) { // Если группа отчетов ЕРСОП
			this.isGroupERSOP = true;
		} else if (this.groupCode == GlobalConfig.REPORT_GROUPS.COURT_REPORTS) { // Если группа отчетов о работе суда
			this.isGroupCourtReport = true;
		}


		this.colsDep = [
			{ field: "code", header: "И/н", width: "56px" },
			{ field: "name", header: "Ведомство", width: "auto" },
		];

		this.colsReg = [
			{ field: "code", header: "И/н", width: "90px" },
			{ field: "name", header: "Регион/Орган", width: "auto" },
		];

		this.colsERSOP = [
			{ field: "searchPattern", header: "Код органа", width: "180px" },
			{ field: "name", header: "Наименование", width: "auto" },
		];

		this.colsCourtReport = [
			{ field: "searchPattern", header: "Код органа", width: "180px" },
			{ field: "name", header: "Наименование", width: "auto" },

		]

		// Get reports list by slice id to genereate tabs
		this.http.getReportsBySliceId(this.sliceId).subscribe(
			reportGroups => {
				this.reportGroups = reportGroups;
				this.reportGroups.forEach(element => {
					if (element.code == '800' || element.code == '801') {
						this.isReport1P = true;
					} else if (element.code == '510' || element.code == '511') {
						this.isReportForm10 = true;
					}
				});

				if (this.isGroupERSOP || this.isReport1P) {
					this.generateGridERSOP();
				} else if (this.isGroupCourtReport || this.isReportForm10) {
					this.generateGridCourtReport();
				} else {
					// Get regions grid data
					this.http.getRegions().subscribe(
						regionsTree => {
							let regionsTreeFormatted = this.formatGridService.formatGridData([regionsTree], true);
							regionsTreeFormatted[0]["expanded"] = true; // Раскрываем первую ветку по умолчанию

							this.reportGroups.forEach(element => {
								let groupCode = element.code;
								// Get department grid data
								this.http.getDepsByReportId(groupCode).subscribe(
									departments => {
										this.gridData.deps[groupCode] = this.formatGridService.formatGridData(departments, false);
										this.requestedReports.deps[groupCode] = [];
									},
									error => {
										this.errorHandler.alertError(error);
									},
									() => {
										this.contentLoading = false;
									}
								);
								// Assign regions to grid
								this.gridData.regs[groupCode] = regionsTreeFormatted;
								this.requestedReports.regs[groupCode] = [];
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

	generateGridERSOP() {
		this.reportGroups.forEach(reportGroup => {
			let groupCode = reportGroup.code;

			this.http.getGroupERSOP(GlobalConfig.HIERARCHY_REPORTS.FOR_ERSOP).subscribe(
				data => {
					this.gridData.ersop[groupCode] = this.formatGridService.formatGridData(data, true, true);
					this.requestedReports.ersop[groupCode] = [];
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

	generateGridCourtReport() {
		this.reportGroups.forEach(reportGroup => {
			let groupCode = reportGroup.code;

			this.http.getGroupCourtReport(GlobalConfig.HIERARCHY_REPORTS.FOR_ANOTHER_ORGANIZATIONS).subscribe(
				data => {
					this.gridData.courtReport[groupCode] = this.formatGridService.formatGridData(data, true, true);
					this.requestedReports.courtReport[groupCode] = [];
				},
				error => {
					this.errorHandler.alertError(error);
				},
				() => {
					this.contentLoading = false;
				}
			)

		});
	}

	onNodeExpandGroupERSOP(event, groupCode) {
		let node = event.node;
		if (!Object.entries(node.children[0].data).length && node.children[0].data.constructor === Object) {
			this.loadingERSOP = true;
			const searchPattern = node.data.searchPattern;

			this.http.getGroupERSOPChildren(searchPattern, GlobalConfig.HIERARCHY_REPORTS.FOR_ERSOP).then(
				data => {
					event.node.children = this.formatGridService.formatGridData(data, false);
					this.gridData.ersop[groupCode] = [...this.gridData.ersop[groupCode]]; //refresh the data
					this.loadingERSOP = false;
				},
				error => {
					this.errorHandler.alertError(error);
				}
			);
		}
	}

	onNodeExpandGroupCourtReport(event, groupCode) {
		let node = event.node;
		if (!Object.entries(node.children[0].data).length && node.children[0].data.constructor === Object) {
			this.loadingCourtReport = true;
			const searchPattern = node.data.searchPattern;

			this.http.getGroupCourtReportChildren(searchPattern, GlobalConfig.HIERARCHY_REPORTS.FOR_ANOTHER_ORGANIZATIONS).then(
				data => {
					event.node.children = this.formatGridService.formatGridData(data, false);
					this.gridData.courtReport[groupCode] = [...this.gridData.courtReport[groupCode]]; //refresh the data
					this.loadingCourtReport = false;

				},
				error => {
					this.errorHandler.alertError(error);
				}
			)
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

		if (
			(this.requestedReports.regs[this.selectedGroupCode] !== undefined &&
				this.requestedReports.regs[this.selectedGroupCode].length !== 0 &&
				this.requestedReports.deps[this.selectedGroupCode] !== undefined &&
				this.requestedReports.deps[this.selectedGroupCode].length !== 0) ||
			// if groups is ERSOP
			(this.requestedReports.ersop[this.selectedGroupCode] !== undefined &&
				this.requestedReports.ersop[this.selectedGroupCode].length !== 0) ||
			//if groups is CourtReport
			(this.requestedReports.courtReport[this.selectedGroupCode] !== undefined &&
				this.requestedReports.courtReport[this.selectedGroupCode].length !== 0)
		) {
			return true;
		}
		return false;
	}

	generateSelectedReportsList() {
		let counter = 0;
		this.selectedReportsList = [];


		if (!this.isGroupERSOP && !this.isGroupCourtReport) {
			this.readyReportsParts = 0;
			this.requestedReports.regs.forEach((element, index) => {
				let regionsTabIndex = index;
				let reportInfo = this.getReportInfoByCode(regionsTabIndex);
			})
			this.requestedReports.regs.forEach((element, index) => {
				let regionsTabIndex = index;
				let reportInfo = this.getReportInfoByCode(regionsTabIndex);
				// eslint-disable-next-line @typescript-eslint/no-this-alias
				let self = this;
				element.forEach(region => {
					if (self.requestedReports.deps[regionsTabIndex] != undefined) {
						self.requestedReports.deps[regionsTabIndex].forEach(department => {
							self.selectedReportsList[counter] = {
								report: reportInfo,
								region: region,
								department: department,
							};
							self.selectedReportsQuery[counter] = {
								sliceId: self.sliceId,
								reportCode: reportInfo.code,
								orgCode: department.code,
								regCode: region.code,
							};
							counter++;
						});
					}
				});
			});
		} else if (this.isGroupERSOP) {
			// if group is ERSOP
			let reportInfo = this.getReportInfoByCode(this.selectedGroupCode);
			this.requestedReports.ersop[this.selectedGroupCode].forEach(element => {
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
		} else if (this.isGroupCourtReport) {
			// if group is Court Report
			let reportInfo = this.getReportInfoByCode(this.selectedGroupCode);
			this.requestedReports.courtReport[this.selectedGroupCode].forEach(element => {
				this.selectedReportsList[counter] = {
					report: reportInfo,
					region: element,
				};
				this.selectedReportsQuery[counter] = {
					sliceId: this.sliceId,
					reportCode: this.selectedGroupCode,
					govCode: element.searchPattern,
				}
				counter++;
			});
		}
	}

	removeSelectedReport = function (index, selectedReport) {
		this.selectedReportsList.splice(index, 1);
		this.selectedReportsQuery.splice(index, 1);
		let groupCode = selectedReport.report.code;

		if (this.isGroupERSOP) {
			let row = selectedReport.region;

			this.requestedReports.ersop[groupCode].splice(this.requestedReports.ersop[groupCode].indexOf(row), 1);
			this.gridData.ersop[groupCode] = [...this.gridData.ersop[groupCode]];
			this.requestedReports.ersop[groupCode] = [...this.requestedReports.ersop[groupCode]];
		} else if (this.isGroupCourtReport) {
			let row = selectedReport.region;

			this.requestedReports.courtReport[groupCode].splice(this.requestedReports.courtReport[groupCode].indexOf(row), 1);
			this.gridData.courtReport[groupCode] = [...this.gridData.courtReport[groupCode]];
			this.requestedReports.courtReport[groupCode] = [...this.requestedReports.courtReport[groupCode]]
		} else {
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

	/*=====  Get reports ======*/
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
	/*=====  Get reports end ======*/

	getReportSplices(counterFrom) {
		let reportsSlice,
			counterFromIn = counterFrom,
			selectedLang = this.checkLang();
		if (this.selectedReportsQuery != undefined && this.selectedReportsQuery.length > 0) {
			reportsSlice = this.selectedReportsQuery.splice(0, this.sliceSize);
			this.generateReports(reportsSlice, selectedLang, counterFromIn);
		} else {
			this.isReportsLoading = false;
		}
	}

	generateReports(reportsSlice: any, selectedLang, counterFrom) {
		if (reportsSlice.length === 0) {
			return false;
		} else {
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
		let delimiter = " - ",
			reportName,
			regionName,
			departmentName,
			groupCode = element.reportCode,
			orgCode = element.orgCode,
			regCode = element.regCode,
			govCode = element.govCode,
			langPostfix = "";

		if (element.lang !== "RU") {
			langPostfix = delimiter + "[" + element.lang + "]";
		}

		let reportInfo = this.getReportInfoByCode(groupCode);
		reportInfo !== undefined ? (reportName = reportInfo.name + delimiter) : (reportName = "");

		if (this.isGroupERSOP) {
			let commonIndex = this.requestedReports.ersop[groupCode].findIndex(x => x.searchPattern === govCode);
			commonIndex !== -1 ? (regionName = this.requestedReports.ersop[groupCode][commonIndex].name) : (regionName = "");
			departmentName = "";
		} else if (this.isGroupCourtReport) {
			let commonIndex = this.requestedReports.courtReport[groupCode].findIndex(x => x.searchPattern === govCode);
			commonIndex !== -1 ? (regionName = this.requestedReports.courtReport[groupCode][commonIndex].name) : (regionName = "");
			departmentName = "";
		} else {
			let regIndex = this.requestedReports.regs[groupCode].findIndex(x => x.code === regCode);
			regIndex !== -1 ? (regionName = this.requestedReports.regs[groupCode][regIndex].name) : (regionName = "");

			let depIndex = this.requestedReports.deps[groupCode].findIndex(x => x.code === orgCode);
			depIndex !== -1
				? (departmentName = delimiter + this.requestedReports.deps[groupCode][depIndex].name)
				: (departmentName = "");
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
}
